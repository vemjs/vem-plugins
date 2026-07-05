import { type VemPlugin } from '@vemjs/plugin-api';
import { type TextSpan } from '@vemjs/core';

const COLORS = {
  keyword: '#ff79c6', // pink
  string: '#f1fa8c', // yellow
  comment: '#6272a4', // blue-gray
  number: '#bd93f9', // purple
  builtin: '#8be9fd', // cyan
  function: '#50fa7b', // green
  default: '#f8f8f2', // off-white
};

export const TreesitterPlugin: VemPlugin = {
  name: 'treesitter',
  version: '0.1.1',
  activate(context) {
    const editor = context.editorState;

    const highlightLine = (lineText: string): TextSpan[] => {
      if (!lineText) return [];

      const tokens: TextSpan[] = [];
      let remaining = lineText;

      const regexes = [
        { type: 'comment', regex: /^\/\/.*$/ },
        { type: 'string', regex: /^"[^"\\]*(?:\\.[^"\\]*)*"/ },
        { type: 'string', regex: /^'[^'\\]*(?:\\.[^'\\]*)*'/ },
        { type: 'string', regex: /^`[^`\\]*(?:\\.[^`\\]*)*`/ },
        {
          type: 'keyword',
          regex:
            /^(?:const|let|var|function|return|class|import|from|export|if|else|for|while|new|typeof|instanceof|switch|case|break)\b/,
        },
        { type: 'number', regex: /^\b\d+(?:\.\d+)?\b/ },
        {
          type: 'builtin',
          regex: /^(?:console|window|document|process|Math|JSON|Object|Array|String|Number|Boolean)\b/,
        },
        { type: 'function', regex: /^\b[a-zA-Z_][a-zA-Z0-9_]*(?=\s*\()/ },
        { type: 'default', regex: /^[^"'`/\w]+/ }, // operators/whitespace
        { type: 'default', regex: /^\w+/ }, // identifiers
      ];

      while (remaining.length > 0) {
        let matched = false;
        for (const item of regexes) {
          const match = remaining.match(item.regex);
          if (match) {
            const text = match[0];
            const color = COLORS[item.type as keyof typeof COLORS] || COLORS.default;
            tokens.push({ text, color });
            remaining = remaining.substring(text.length);
            matched = true;
            break;
          }
        }
        if (!matched) {
          tokens.push({ text: remaining[0], color: COLORS.default });
          remaining = remaining.substring(1);
        }
      }

      return tokens;
    };

    editor.setSyntaxHighlighter(highlightLine);
  },
};
