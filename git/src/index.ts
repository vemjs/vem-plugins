import { type VemPlugin } from '@vemjs/plugin-api';
import { type GutterDecoration } from '@vemjs/core';

export const GitPlugin: VemPlugin = {
  name: 'git',
  version: '0.1.1',
  activate(context) {
    const editor = context.editorState;

    const updateGitSigns = async () => {
      const decorations = new Map<number, GutterDecoration>();
      const fileUri = editor.fileUri;

      if (typeof window !== 'undefined' || !fileUri || fileUri === 'untitled') {
        // Browser or transient mockup git signs
        decorations.set(0, { type: 'add', symbol: '+', color: '#10b981' });
        decorations.set(2, { type: 'change', symbol: '~', color: '#3b82f6' });
        decorations.set(4, { type: 'delete', symbol: '-', color: '#ef4444' });
      } else {
        try {
          // Compile-time dynamic require for child_process
          const cp = (await import('child_process' as any)) as any;
          if (fileUri && fileUri !== 'untitled') {
            const stdout = cp.execSync(`git diff -U0 -- ${fileUri}`, { encoding: 'utf8' }) as string;
            const lines = stdout.split('\n');
            for (const line of lines) {
              if (line.startsWith('@@')) {
                const match = line.match(/@@\s+-\d+(?:,\d+)?\s+\+(\d+)(?:,(\d+))?\s+@@/);
                if (match) {
                  const startLine = parseInt(match[1], 10) - 1;
                  const count = match[2] ? parseInt(match[2], 10) : 1;
                  for (let i = 0; i < count; i++) {
                    decorations.set(startLine + i, { type: 'change', symbol: '~', color: '#3b82f6' });
                  }
                }
              }
            }
          }
        } catch {
          // No-op fallback
        }
      }

      editor.setGutterDecorations(decorations);
    };

    updateGitSigns();

    context.onDidChangeBuffer(() => {
      updateGitSigns();
    });
  },
};
