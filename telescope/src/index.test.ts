import { describe, it, expect } from 'bun:test';
import { VemEditorState } from '@vemjs/core';
import { PluginRegistry } from '@vemjs/plugin-api';
import { TelescopePlugin } from './index';

describe('Telescope Plugin', () => {
  it('should initialize find files picker and filter items', () => {
    const editor = new VemEditorState('');
    editor.projectFiles = ['src/main.ts', 'src/style.css', 'package.json', 'README.md'];

    const registry = new PluginRegistry(editor);
    registry.register(TelescopePlugin);

    expect(editor.activePopup).toBeNull();

    // Trigger findFiles
    registry.executeCommand('telescope.findFiles');
    expect(editor.activePopup).not.toBeNull();
    expect(editor.activePopup!.title).toBe('Find Files');
    expect(editor.getFilteredPopupItems().length).toBe(4);

    // Search query 'main'
    editor.handleKey('m');
    editor.handleKey('a');
    editor.handleKey('i');
    editor.handleKey('n');
    expect(editor.popupFilterText).toBe('main');

    const filtered = editor.getFilteredPopupItems();
    expect(filtered.length).toBe(1);
    expect(filtered[0].label).toBe('main.ts');
    expect(filtered[0].value).toBe('src/main.ts');

    // Confirm selection
    editor.handleKey('Enter');
    expect(editor.activePopup).toBeNull();
    expect(editor.fileUri).toBe('src/main.ts');
  });

  it('should support navigating and selecting in command palette', () => {
    const editor = new VemEditorState('');
    const registry = new PluginRegistry(editor);
    registry.register(TelescopePlugin);

    // Trigger helpTags (Command Palette)
    registry.executeCommand('telescope.helpTags');
    expect(editor.activePopup!.title).toBe('Command Palette');

    // Move down to Dracula theme (index 2)
    editor.handleKey('j');
    editor.handleKey('j');
    expect(editor.activePopupIndex).toBe(2);
    expect(editor.getFilteredPopupItems()[2].value).toBe('theme.setDracula');

    // Setup a mock listener for the theme.setDracula command
    let draculaTriggered = false;
    registry.register({
      name: 'theme-mock',
      version: '0.1.0',
      activate(ctx) {
        ctx.registerCommand('theme.setDracula', () => {
          draculaTriggered = true;
        });
      },
    });

    // Confirm command execution
    editor.handleKey('Enter');
    expect(draculaTriggered).toBe(true);
    expect(editor.activePopup).toBeNull();
  });
});
