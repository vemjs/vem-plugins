import { type VemPlugin } from '@vemjs/plugin-api';

export const TrimWhitespacePlugin: VemPlugin = {
  name: 'trim-whitespace',
  version: '0.1.0',
  activate(context) {
    const editor = context.editorState;

    context.onSave(() => {
      const buffer = editor.getBuffer();
      const count = buffer.getLineCount();

      for (let i = 0; i < count; i++) {
        const line = buffer.getLine(i);
        const trimmed = line.trimEnd();
        if (trimmed !== line) {
          buffer.setLine(i, trimmed);
        }
      }
    });
  },
};
