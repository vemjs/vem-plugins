import { type VemPlugin } from "@vemjs/plugin-api";
import { type GutterDecoration } from "@vemjs/core";

export const GitPlugin: VemPlugin = {
  name: "git",
  version: "0.1.2",
  activate(context) {
    const editor = context.editorState;

    const updateGitSigns = async () => {
      const decorations = new Map<number, GutterDecoration>();
      const fileUri = editor.fileUri;
      const hasRealFile =
        !!fileUri && fileUri !== "untitled" && !fileUri.includes("\0");

      // The diff comes from the host's `gitDiff` capability (plugin-api >=
      // 0.1.7): the desktop build backs it with a Tauri command, a Node/Bun
      // test host can shell out directly, and a plain browser host provides
      // nothing — in which case there are no signs, never fabricated ones.
      if (hasRealFile && context.gitDiff) {
        try {
          const stdout = await context.gitDiff(fileUri);
          const lines = (stdout ?? "").split("\n");
          for (const line of lines) {
            if (line.startsWith("@@")) {
              const match = line.match(
                /@@\s+-\d+(?:,\d+)?\s+\+(\d+)(?:,(\d+))?\s+@@/,
              );
              if (match) {
                const startLine = parseInt(match[1], 10) - 1;
                const count = match[2] ? parseInt(match[2], 10) : 1;
                for (let i = 0; i < count; i++) {
                  decorations.set(startLine + i, {
                    type: "change",
                    symbol: "~",
                    color: "#3b82f6",
                  });
                }
              }
            }
          }
        } catch {
          // No git repo, git not installed, or the file isn't tracked — show
          // no signs rather than guessing.
        }
      }

      editor.setGutterDecorations(decorations);
    };

    updateGitSigns();

    context.onDidChangeBuffer(() => {
      updateGitSigns();
    });
    // A save is the moment the on-disk file actually changes — refresh even
    // when the buffer text itself didn't fire a change (e.g. `:w` after
    // trim-whitespace rewrote lines).
    context.onSave(() => {
      updateGitSigns();
    });
  },
};
