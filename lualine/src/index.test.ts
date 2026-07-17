import { describe, it, expect } from "bun:test";
import { VemEditorState } from "@vemjs/core";
import { PluginRegistry } from "@vemjs/plugin-api";
import { LualinePlugin } from "./index";

describe("Lualine Plugin", () => {
  it("should generate lualine custom statusline segments", () => {
    const editor = new VemEditorState("Line 1\nLine 2");
    editor.setFileUri("/workspace/src/app.ts");

    const registry = new PluginRegistry(editor);
    registry.register(LualinePlugin);

    const layout = editor.statuslineLayout;
    expect(layout.left.length).toBe(3);
    expect(layout.right.length).toBe(2);

    // Mode segment NORMAL
    expect(layout.left[0].text).toBe(" NORMAL ");
    expect(layout.left[0].bold).toBe(true);

    // Filename segment
    expect(layout.left[2].text).toBe(" app.ts ");

    // Position segment
    expect(layout.right[0].text).toBe(" Ln 1, Col 1 (0%) ");
  });

  it("should update segments when mode or cursor position changes", () => {
    const editor = new VemEditorState("Line 1\nLine 2");
    editor.setFileUri("/workspace/src/app.ts");

    const registry = new PluginRegistry(editor);
    registry.register(LualinePlugin);

    // Change mode to INSERT
    editor.handleKey("i");
    expect(editor.statuslineLayout.left[0].text).toBe(" INSERT ");
    expect(editor.statuslineLayout.left[0].bg).toBe("#10b981"); // green

    // Move cursor down in NORMAL
    editor.handleKey("Escape");
    editor.handleKey("j");
    expect(editor.statuslineLayout.right[0].text).toBe(" Ln 2, Col 1 (100%) ");
  });
});

describe("Lualine modified flag", () => {
  it("shows [+] for real edits and clears it on :w — not for pending chords", () => {
    const editor = new VemEditorState("Line 1");
    editor.setFileUri("/workspace/app.ts");
    const registry = new PluginRegistry(editor);
    registry.register(LualinePlugin);

    const fileText = () => editor.statuslineLayout.left[2].text;

    // A pending chord (`d` waiting for `dd`) is NOT a modification.
    editor.handleKey("d");
    expect(editor.getPendingKeys().length).toBeGreaterThan(0);
    expect(fileText()).toBe(" app.ts ");
    editor.handleKey("Escape");

    // A real edit sets the flag…
    editor.handleKey("i");
    editor.handleKey("x");
    editor.handleKey("Escape");
    expect(fileText()).toBe(" app.ts [+] ");

    // …and :w clears it.
    editor.handleKey(":");
    editor.handleKey("w");
    editor.handleKey("Enter");
    expect(fileText()).toBe(" app.ts ");
  });
});
