import { describe, it, expect } from "bun:test";
import { VemEditorState } from "@vemjs/core";
import { PluginRegistry } from "@vemjs/plugin-api";
import { AutopairsPlugin } from "./index";

describe("Autopairs Plugin", () => {
  it("should automatically close brackets in INSERT mode", () => {
    const editor = new VemEditorState("");
    const registry = new PluginRegistry(editor);
    registry.register(AutopairsPlugin);

    // Go to INSERT mode
    editor.handleKey("i");

    // Type '('
    editor.handleKey("(");

    // The buffer should contain '()' and the cursor should be between them (char 1)
    expect(editor.getText()).toBe("()");
    expect(editor.getCursor().character).toBe(1);

    // Type '{'
    editor.handleKey("{");

    // The buffer should contain '({})' and the cursor should be at char 2
    expect(editor.getText()).toBe("({})");
    expect(editor.getCursor().character).toBe(2);
  });

  it("types over an auto-inserted closer instead of duplicating it", () => {
    const editor = new VemEditorState("");
    const registry = new PluginRegistry(editor);
    registry.register(AutopairsPlugin);

    editor.handleKey("i");
    editor.handleKey("(");
    editor.handleKey("{");
    // Buffer is '({})', cursor between { and }.

    editor.handleKey("}");
    expect(editor.getText()).toBe("({})");
    expect(editor.getCursor().character).toBe(3);

    editor.handleKey(")");
    expect(editor.getText()).toBe("({})");
    expect(editor.getCursor().character).toBe(4);
  });

  it("types over an auto-inserted quote instead of duplicating it", () => {
    const editor = new VemEditorState("");
    const registry = new PluginRegistry(editor);
    registry.register(AutopairsPlugin);

    editor.handleKey("i");
    editor.handleKey('"');
    // Buffer is '""', cursor between the quotes.

    editor.handleKey('"');
    expect(editor.getText()).toBe('""');
    expect(editor.getCursor().character).toBe(2);
  });

  it("still inserts a literal closer with no matching opener nearby", () => {
    const editor = new VemEditorState("");
    const registry = new PluginRegistry(editor);
    registry.register(AutopairsPlugin);

    editor.handleKey("i");
    editor.handleKey(")");

    expect(editor.getText()).toBe(")");
    expect(editor.getCursor().character).toBe(1);
  });
});
