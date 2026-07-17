import { type VemPlugin } from "@vemjs/plugin-api";

const THEMES: Record<string, any> = {
  // Mirrors @vemjs/core's DEFAULT_THEME (0.3.x Vim-black) so `theme.setDefault`
  // actually restores the out-of-the-box look — the old slate palette here
  // predated core's Vim-faithful default and silently diverged from it.
  default: {
    bg: "#000000",
    fg: "#d0d0d0",
    sidebarBg: "#080808",
    gutterBg: "#000000",
    gutterFg: "#767676",
    statusBarBg: "#bcbcbc",
    statusBarFg: "#080808",
    accent: "#5f87d7",
    nonText: "#5f87d7",
  },
  light: {
    bg: "#f8fafc",
    fg: "#0f172a",
    sidebarBg: "#f1f5f9",
    gutterBg: "#f1f5f9",
    gutterFg: "#94a3b8",
    statusBarBg: "#e2e8f0",
    statusBarFg: "#0f172a",
    accent: "#2563eb",
  },
  gruvbox: {
    bg: "#282828",
    fg: "#ebdbb2",
    sidebarBg: "#1d2021",
    gutterBg: "#1d2021",
    gutterFg: "#a89984",
    statusBarBg: "#3c3836",
    statusBarFg: "#ebdbb2",
    accent: "#d79921",
  },
  dracula: {
    bg: "#282a36",
    fg: "#f8f8f2",
    sidebarBg: "#191a21",
    gutterBg: "#191a21",
    gutterFg: "#6272a4",
    statusBarBg: "#44475a",
    statusBarFg: "#f8f8f2",
    accent: "#ff79c6",
  },
};

export const LayoutCustomizerPlugin: VemPlugin = {
  name: "layout-customizer",
  version: "0.1.1",
  activate(context) {
    const editor = context.editorState;

    // Command to cycle sidebar: left -> right -> hidden -> left
    context.registerCommand("layout.toggleSidebar", () => {
      const current = editor.layoutConfig.sidebarPosition;
      let next: "left" | "right" | "hidden" = "left";
      if (current === "left") next = "right";
      else if (current === "right") next = "hidden";
      editor.setLayoutConfig({ sidebarPosition: next });
    });

    // Command to cycle status bar: bottom -> top -> bottom
    context.registerCommand("layout.toggleStatusbar", () => {
      const current = editor.layoutConfig.statusBarPosition;
      const next = current === "bottom" ? "top" : "bottom";
      editor.setLayoutConfig({ statusBarPosition: next });
    });

    // Commands to select themes
    context.registerCommand("theme.setLight", () => {
      editor.setTheme(THEMES.light);
    });

    context.registerCommand("theme.setGruvbox", () => {
      editor.setTheme(THEMES.gruvbox);
    });

    context.registerCommand("theme.setDracula", () => {
      editor.setTheme(THEMES.dracula);
    });

    context.registerCommand("theme.setDefault", () => {
      editor.setTheme(THEMES.default);
    });

    // Support a unified command to select theme by name
    context.registerCommand("theme.setTheme", () => {
      // In a real editor, this could read command bar text or prompt.
      // Here we just toggle to next theme as a demonstration.
      const themeNames = Object.keys(THEMES);
      const currentBg = editor.theme.bg;
      let currentName = "default";
      for (const name of themeNames) {
        if (THEMES[name].bg === currentBg) {
          currentName = name;
          break;
        }
      }
      const idx = themeNames.indexOf(currentName);
      const nextName = themeNames[(idx + 1) % themeNames.length];
      editor.setTheme(THEMES[nextName]);
    });
  },
};
