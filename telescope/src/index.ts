import { type VemPlugin } from '@vemjs/plugin-api';
import { type FloatingPopupItem } from '@vemjs/core';

export const TelescopePlugin: VemPlugin = {
  name: 'telescope',
  version: '0.1.0',
  activate(context) {
    const editor = context.editorState;

    // 1. Find Files Picker
    context.registerCommand('telescope.findFiles', () => {
      const items: FloatingPopupItem[] = editor.projectFiles.map((filepath: string) => ({
        label: filepath.substring(filepath.lastIndexOf('/') + 1),
        detail: filepath,
        value: filepath,
      }));

      editor.showPopup({
        title: 'Find Files',
        items,
        onSelect: (item: FloatingPopupItem) => {
          editor.setFileUri(item.value);
          console.log(`Telescope: opened file [${item.value}]`);
        },
      });
    });

    // 2. Command Palette (Help Tags) Picker
    context.registerCommand('telescope.helpTags', () => {
      const commandsList = [
        { label: 'layout.toggleSidebar', detail: 'Toggle file tree sidebar layout', value: 'layout.toggleSidebar' },
        { label: 'layout.toggleStatusbar', detail: 'Toggle status line bar position', value: 'layout.toggleStatusbar' },
        { label: 'theme.setDracula', detail: 'Set color theme to Dracula', value: 'theme.setDracula' },
        { label: 'theme.setGruvbox', detail: 'Set color theme to Gruvbox', value: 'theme.setGruvbox' },
        { label: 'theme.setLight', detail: 'Set color theme to Light', value: 'theme.setLight' },
        { label: 'theme.setDefault', detail: 'Set color theme to default slate-dark', value: 'theme.setDefault' },
      ];

      editor.showPopup({
        title: 'Command Palette',
        items: commandsList,
        onSelect: (item: FloatingPopupItem) => {
          (editor as any).pluginCommandCallbacks.forEach((cb: any) => {
            try {
              cb(item.value);
            } catch (e) {
              console.error(e);
            }
          });
        },
      });
    });
  },
};
