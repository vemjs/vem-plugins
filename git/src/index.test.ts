import { describe, it, expect } from 'bun:test';
import { VemEditorState } from '@vemjs/core';
import { PluginRegistry } from '@vemjs/plugin-api';
import { GitPlugin } from './index';

describe('Git Plugin', () => {
  it('should initialize and apply gutter decorations', async () => {
    const editor = new VemEditorState('Line 1\nLine 2\nLine 3\nLine 4\nLine 5');

    const registry = new PluginRegistry(editor);
    registry.register(GitPlugin);

    await new Promise((resolve) => setTimeout(resolve, 0));

    expect(editor.gutterDecorations.size).toBeGreaterThan(0);

    // Add decoration at line index 0 (line 1)
    const addDec = editor.gutterDecorations.get(0);
    expect(addDec).not.toBeUndefined();
    expect(addDec!.type).toBe('add');
    expect(addDec!.color).toBe('#10b981'); // green
  });
});
