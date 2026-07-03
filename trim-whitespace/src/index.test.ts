import { describe, it, expect } from 'bun:test';
import { VemEditorState } from '@vemjs/core';
import { PluginRegistry } from '@vemjs/plugin-api';
import { TrimWhitespacePlugin } from './index';

describe('Trim Whitespace Plugin', () => {
  it('should trim trailing whitespace when buffer is saved', () => {
    const editor = new VemEditorState('line1   \nline2\nline3  ');
    const registry = new PluginRegistry(editor);
    registry.register(TrimWhitespacePlugin);

    // Verify initial text has spaces
    expect(editor.getText()).toBe('line1   \nline2\nline3  ');

    // Trigger save (simulate :w)
    editor.handleKey(':');
    editor.handleKey('w');
    editor.handleKey('Enter');

    // After save, the trailing whitespace should be trimmed
    expect(editor.getText()).toBe('line1\nline2\nline3');
  });
});
