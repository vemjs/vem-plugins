import { type VemPlugin } from '@vemjs/plugin-api';

const THEMES: Record<string, any> = {
  default: {
    bg: '#0f172a',
    fg: '#e2e8f0',
    sidebarBg: '#090d16',
    gutterBg: '#0b0f19',
    gutterFg: '#64748b',
    statusBarBg: '#1e293b',
    statusBarFg: '#e2e8f0',
    accent: '#8b5cf6',
  },
  light: {
    bg: '#f8fafc',
    fg: '#0f172a',
    sidebarBg: '#f1f5f9',
    gutterBg: '#f1f5f9',
    gutterFg: '#94a3b8',
    statusBarBg: '#e2e8f0',
    statusBarFg: '#0f172a',
    accent: '#2563eb',
  },
  gruvbox: {
    bg: '#282828',
    fg: '#ebdbb2',
    sidebarBg: '#1d2021',
    gutterBg: '#1d2021',
    gutterFg: '#a89984',
    statusBarBg: '#3c3836',
    statusBarFg: '#ebdbb2',
    accent: '#d79921',
  },
  dracula: {
    bg: '#282a36',
    fg: '#f8f8f2',
    sidebarBg: '#191a21',
    gutterBg: '#191a21',
    gutterFg: '#6272a4',
    statusBarBg: '#44475a',
    statusBarFg: '#f8f8f2',
    accent: '#ff79c6',
  },
};

export const LayoutCustomizerPlugin: VemPlugin = {
  name: 'layout-customizer',
  version: '0.1.0',
  activate(context) {
    const editor = context.editorState;

    // Command to cycle sidebar: left -> right -> hidden -> left
    context.registerCommand('layout.toggleSidebar', () => {
      const current = editor.layoutConfig.sidebarPosition;
      let next: 'left' | 'right' | 'hidden' = 'left';
      if (current === 'left') next = 'right';
      else if (current === 'right') next = 'hidden';
      editor.setLayoutConfig({ sidebarPosition: next });
    });

    // Command to cycle status bar: bottom -> top -> bottom
    context.registerCommand('layout.toggleStatusbar', () => {
      const current = editor.layoutConfig.statusBarPosition;
      const next = current === 'bottom' ? 'top' : 'bottom';
      editor.setLayoutConfig({ statusBarPosition: next });
    });

    // Commands to select themes
    context.registerCommand('theme.setLight', () => {
      editor.setTheme(THEMES.light);
    });

    context.registerCommand('theme.setGruvbox', () => {
      editor.setTheme(THEMES.gruvbox);
    });

    context.registerCommand('theme.setDracula', () => {
      editor.setTheme(THEMES.dracula);
    });

    context.registerCommand('theme.setDefault', () => {
      editor.setTheme(THEMES.default);
    });

    // Support a unified command to select theme by name
    context.registerCommand('theme.setTheme', () => {
      // In a real editor, this could read command bar text or prompt.
      // Here we just toggle to next theme as a demonstration.
      const themeNames = Object.keys(THEMES);
      const currentBg = editor.theme.bg;
      let currentName = 'default';
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
