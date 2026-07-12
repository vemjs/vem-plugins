import { type VemPlugin } from "@vemjs/plugin-api";

export const AutopairsPlugin: VemPlugin = {
  name: "autopairs",
  version: "0.1.1",
  activate(context) {
    const editor = context.editorState;
    const pairs: Record<string, string> = {
      "(": ")",
      "[": "]",
      "{": "}",
      '"': '"',
      "'": "'",
      "`": "`",
    };

    // Every character a pair can close with — includes the symmetric quote
    // chars, since they close themselves too.
    const closers = new Set(Object.values(pairs));

    let isHandling = false;

    context.onDidChangeBuffer(() => {
      if (isHandling) return;
      if (editor.getMode() !== "INSERT") return;

      const cursor = editor.getCursor();
      const lineIndex = cursor.line;
      const lineText = editor.getBuffer().getLine(lineIndex);

      if (cursor.character <= 0) return;
      const lastTypedChar = lineText[cursor.character - 1];

      // Type-over: the user just typed a closing char that's already sitting
      // right after the cursor (typically the one we auto-inserted moments
      // ago). Step over it instead of inserting a duplicate — e.g. typing
      // ")" right before an auto-paired ")" should move past it, not leave
      // "))" behind.
      if (
        closers.has(lastTypedChar) &&
        lineText[cursor.character] === lastTypedChar
      ) {
        isHandling = true;
        try {
          const before = lineText.substring(0, cursor.character - 1);
          const after = lineText.substring(cursor.character);
          editor.getBuffer().setLine(lineIndex, before + after);
          editor.setCursor(lineIndex, cursor.character);
        } finally {
          isHandling = false;
        }
        return;
      }

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
