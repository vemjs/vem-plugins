import { describe, it, expect, beforeAll, afterAll } from "bun:test";
import { execFileSync } from "child_process";
import { mkdtempSync, rmSync, writeFileSync, realpathSync } from "fs";
import { tmpdir } from "os";
import { join, dirname } from "path";
import { VemEditorState } from "@vemjs/core";
import { PluginRegistry } from "@vemjs/plugin-api";
import { GitPlugin } from "./index";

// The test host provides the same capability shape the desktop's Tauri
// backend does — shelling out from the file's own directory.
const shellGitDiff = async (fileUri: string): Promise<string | null> => {
  try {
    return execFileSync("git", ["diff", "-U0", "--", fileUri], {
      cwd: dirname(fileUri),
      encoding: "utf8",
    });
  } catch {
    return null;
  }
};

describe("Git Plugin", () => {
  it("shows no gutter signs for an untitled buffer (no fabricated mock data)", async () => {
    const editor = new VemEditorState("Line 1\nLine 2\nLine 3\nLine 4\nLine 5");

    const registry = new PluginRegistry(editor, { gitDiff: shellGitDiff });
    registry.register(GitPlugin);

    await new Promise((resolve) => setTimeout(resolve, 0));

    // Regression: this plugin used to paint hardcoded green/blue/red signs
    // on lines 0/2/4 of every buffer, real diff or not.
    expect(editor.gutterDecorations.size).toBe(0);
  });

  it("shows no gutter signs when the host provides no gitDiff capability (browser)", async () => {
    const editor = new VemEditorState("line1\nline2");
    editor.setFileUri("/definitely/a/real/path.txt");

    const registry = new PluginRegistry(editor);
    registry.register(GitPlugin);

    await new Promise((resolve) => setTimeout(resolve, 0));

    expect(editor.gutterDecorations.size).toBe(0);
  });

  describe("with a real git repo", () => {
    let dir = "";
    let filePath = "";

    beforeAll(() => {
      dir = realpathSync(mkdtempSync(join(tmpdir(), "vem-git-plugin-test-")));
      filePath = join(dir, "sample.txt");

      execFileSync("git", ["init", "-q"], { cwd: dir });
      execFileSync("git", ["config", "user.email", "test@vem.run"], {
        cwd: dir,
      });
      execFileSync("git", ["config", "user.name", "vem test"], { cwd: dir });
      writeFileSync(filePath, "line1\nline2\nline3\n");
      execFileSync("git", ["add", "sample.txt"], { cwd: dir });
      execFileSync("git", ["commit", "-q", "-m", "initial"], { cwd: dir });
      writeFileSync(filePath, "line1\nCHANGED\nline3\n");
    });

    afterAll(() => {
      if (dir) rmSync(dir, { recursive: true, force: true });
    });

    it("marks real changed lines from the host's gitDiff capability", async () => {
      const editor = new VemEditorState("line1\nCHANGED\nline3");
      editor.setFileUri(filePath);

      const registry = new PluginRegistry(editor, { gitDiff: shellGitDiff });
      registry.register(GitPlugin);

      await new Promise((resolve) => setTimeout(resolve, 0));

      const dec = editor.gutterDecorations.get(1); // 0-indexed line 2, the changed line
      expect(dec).not.toBeUndefined();
      expect(dec!.type).toBe("change");
      expect(editor.gutterDecorations.has(0)).toBe(false);
      expect(editor.gutterDecorations.has(2)).toBe(false);
    });
  });
});
