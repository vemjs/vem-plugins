import { describe, it, expect } from 'bun:test';
import { VemEditorState } from '@vemjs/core';
import { PluginRegistry } from '@vemjs/plugin-api';
import { TreesitterPlugin } from './index';

describe('Treesitter Plugin', () => {
  it('should format line text into styled spans', () => {
    const editor = new VemEditorState('const x = "hello"; // comment');

    const registry = new PluginRegistry(editor);
    registry.register(TreesitterPlugin);

    expect(editor.highlightLine).not.toBeUndefined();

    const spans = editor.highlightLine!('const x = "hello";', 0);
    expect(spans.length).toBeGreaterThan(0);

    // First token is keyword const
    expect(spans[0].text).toBe('const');
    expect(spans[0].color).toBe('#ff79c6'); // keyword color pink

    // String hello
    const stringSpan = spans.find((s) => s.text === '"hello"');
    expect(stringSpan).not.toBeUndefined();
    expect(stringSpan!.color).toBe('#f1fa8c'); // string color yellow
  });
});
