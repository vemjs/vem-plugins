import { type VemPlugin } from '@vemjs/plugin-api';
import { type Diagnostic } from '@vemjs/core';

export const LualinePlugin: VemPlugin = {
  name: 'lualine',
  version: '0.1.0',
  activate(context) {
    const editor = context.editorState;
    let isUpdating = false;

    const updateStatusline = () => {
      if (isUpdating) return;
      isUpdating = true;

      try {
        const mode = editor.getMode();
        const theme = editor.theme;
        const cursor = editor.getCursor();
        const buffer = editor.getBuffer();

        // Determine mode color
        let modeBg = theme.accent;
        const modeColor = '#ffffff';
        if (mode === 'INSERT') {
          modeBg = '#10b981'; // emerald-500
        } else if (mode === 'VISUAL') {
          modeBg = '#f59e0b'; // amber-500
        } else if (mode === 'COMMAND') {
          modeBg = '#3b82f6'; // blue-500
        }

        // 1. Mode segment
        const modeSeg = {
          text: ` ${mode} `,
          bg: modeBg,
          color: modeColor,
          bold: true,
        };

        // 2. Git Branch segment
        const branchSeg = {
          text: '  main ',
          bg: '#334155', // slate-700
          color: '#e2e8f0',
        };

        // 3. Filename segment
        const fileUri = editor.fileUri;
        const filename = fileUri.substring(fileUri.lastIndexOf('/') + 1);
        const isModified = editor.getPendingKeys().length > 0;
        const fileSeg = {
          text: ` ${filename}${isModified ? ' [+]' : ''} `,
          bg: '#1e293b', // slate-800
          color: '#f8fafc',
        };

        // Right Side segments:

        // 4. Position segment
        const totalLines = buffer.getLineCount();
        const percentage = totalLines > 1 ? Math.round((cursor.line / (totalLines - 1)) * 100) : 100;
        const posSeg = {
          text: ` Ln ${cursor.line + 1}, Col ${cursor.character + 1} (${percentage}%) `,
          bg: '#1e293b',
          color: '#f8fafc',
        };

        // 5. Diagnostics segment (warnings/errors counts)
        const diags = editor.getDiagnostics();
        const errors = diags.filter((d: Diagnostic) => d.severity === 'error').length;
        const warnings = diags.filter((d: Diagnostic) => d.severity === 'warning').length;
        let diagText = '';
        if (errors > 0) diagText += `  ${errors}`;
        if (warnings > 0) diagText += `  ${warnings}`;
        const diagSeg = diagText
          ? {
              text: diagText + ' ',
              bg: '#ef4444' + '22', // translucent red background
              color: errors > 0 ? '#ef4444' : '#f59e0b',
              bold: true,
            }
          : null;

        // 6. File format segment
        const formatSeg = {
          text: ' UTF-8 [unix] ',
          bg: '#334155',
          color: '#e2e8f0',
        };

        const left = [modeSeg, branchSeg, fileSeg];
        const right = [posSeg, formatSeg];
        if (diagSeg) {
          right.unshift(diagSeg);
        }

        editor.setStatuslineLayout({ left, right });
      } finally {
        isUpdating = false;
      }
    };

    // Update initially
    updateStatusline();

    // Hook editor event to update statusline reactively on cursor/buffer/visual changes
    editor.onChange(() => {
      updateStatusline();
    });
  },
};
