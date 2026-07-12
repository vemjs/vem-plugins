import { type VemPlugin } from "@vemjs/plugin-api";
import { type GutterDecoration } from "@vemjs/core";

export const GitPlugin: VemPlugin = {
  name: "git",
  version: "0.1.1",
  activate(context) {
    const editor = context.editorState;

    const updateGitSigns = async () => {
      const decorations = new Map<number, GutterDecoration>();
      const fileUri = editor.fileUri;
      const hasRealFile =
        !!fileUri && fileUri !== "untitled" && !fileUri.includes("\0");
      // Browsers and webviews (vem.run, and vem-desktop's Tauri webview) have
      // no shell access — `child_process` only resolves in a real Node/Bun
      // runtime. Desktop git integration should route through a Tauri
      // backend command instead (see vem-desktop's `get_vem_dirs` pattern),
      // not this Node-only path.
      const canShellOut = typeof window === "undefined";

      if (hasRealFile && canShellOut) {
        try {
          const nodeChildProcess = "child_process";
          const nodePath = "path";
          const cp = (await import(/* @vite-ignore */ nodeChildProcess)) as any;
          const path = (await import(/* @vite-ignore */ nodePath)) as any;
          // Run from the file's own directory, not this process's cwd — a
          // desktop app is almost never launched from inside the project the
          // open file belongs to, and `git diff -- <path>` resolves `path`
          // relative to cwd's repository, not the path's own.
          const stdout = cp.execFileSync(
            "git",
            ["diff", "-U0", "--", fileUri],
            {
              cwd: path.dirname(fileUri),
              encoding: "utf8",
            },
          ) as string;
          const lines = stdout.split("\n");
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
      // Untitled buffers and non-shell-capable runtimes always end up here
      // with an empty map: no fabricated decorations.

      editor.setGutterDecorations(decorations);
    };

    updateGitSigns();

    context.onDidChangeBuffer(() => {
      updateGitSigns();
    });
  },
};
