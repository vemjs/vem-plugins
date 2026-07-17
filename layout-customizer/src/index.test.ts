import { describe, it, expect } from "bun:test";
import { VemEditorState } from "@vemjs/core";
import { PluginRegistry } from "@vemjs/plugin-api";
import { LayoutCustomizerPlugin } from "./index";

describe("Layout Customizer Plugin", () => {
  it("should allow cycling sidebar and status bar position", () => {
    const editor = new VemEditorState("");
    const registry = new PluginRegistry(editor);
    registry.register(LayoutCustomizerPlugin);

    expect(editor.layoutConfig.sidebarPosition).toBe("left");
    expect(editor.layoutConfig.statusBarPosition).toBe("bottom");

    // Toggle sidebar: left -> right
    registry.executeCommand("layout.toggleSidebar");
    expect(editor.layoutConfig.sidebarPosition).toBe("right");

    // Toggle sidebar: right -> hidden
    registry.executeCommand("layout.toggleSidebar");
    expect(editor.layoutConfig.sidebarPosition).toBe("hidden");

    // Toggle status bar: bottom -> top
    registry.executeCommand("layout.toggleStatusbar");
    expect(editor.layoutConfig.statusBarPosition).toBe("top");
  });

  it("should allow switching themes", () => {
    const editor = new VemEditorState("");
    const registry = new PluginRegistry(editor);
    registry.register(LayoutCustomizerPlugin);

    // Whatever the engine's construction default is, remember it — the
    // plugin must round-trip back to it, not to a palette it hardcodes.
    const initialBg = editor.theme.bg;

    // Set Dracula
    registry.executeCommand("theme.setDracula");
    expect(editor.theme.bg).toBe("#282a36");
    expect(editor.theme.accent).toBe("#ff79c6");

    // theme.setDefault restores the engine's own default look.
    registry.executeCommand("theme.setDefault");
    expect(editor.theme.bg).toBe(initialBg);
  });
});
