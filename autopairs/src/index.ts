import { type VemPlugin } from '@vemjs/plugin-api';

export const AutopairsPlugin: VemPlugin = {
  name: 'autopairs',
  version: '0.1.1',
  activate(context) {
    const editor = context.editorState;
    const pairs: Record<string, string> = {
      '(': ')',
      '[': ']',
      '{': '}',
      '"': '"',
      "'": "'",
      '`': '`',
    };

    let isHandling = false;

    context.onDidChangeBuffer(() => {
      if (isHandling) return;
      if (editor.getMode() !== 'INSERT') return;

      const cursor = editor.getCursor();
      const lineIndex = cursor.line;
      const lineText = editor.getBuffer().getLine(lineIndex);

      if (cursor.character <= 0) return;
      const lastTypedChar = lineText[cursor.character - 1];

      const matchingPair = pairs[lastTypedChar];
      if (matchingPair) {
        isHandling = true;
        try {
          const nextChar = lineText[cursor.character];
          if (nextChar === matchingPair) {
            return;
          }

          editor.getBuffer().insertText(cursor, matchingPair);
        } finally {
          isHandling = false;
        }
      }
    });
  },
};
