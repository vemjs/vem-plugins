# @vemjs/plugin-lualine

## 0.1.3

### Patch Changes

- 6d8d0bd: 2026-07-16 audit fixes. git: sources its diff from the host's `gitDiff` capability (plugin-api 0.1.7) instead of a Node-only `child_process` path that never ran in the browser or the Tauri webview, and refreshes signs on save. telescope: find-files selection now opens the file through the host's `openFile` capability (falling back to the legacy relabel when absent), and the command palette uses the public `executePluginCommand` instead of poking a private field. lualine: the `[+]` modified flag reads core's real `modified` dirty bit rather than the pending-chord key buffer. layout-customizer: `theme.setDefault` restores core 0.3.x's actual Vim-black default palette instead of a stale slate one. Dev toolchain now compiles/tests against `@vemjs/core@^0.3.1` / `plugin-api@^0.1.7` (was two minors behind).

## 0.1.2

### Patch Changes

- bea04ce: Replace hardcoded Nerd Font Private Use Area glyphs (git branch, error, warning icons) in the statusline segments with plain text / standard Unicode symbols. The web build only loads plain "JetBrains Mono" from Google Fonts, which has no coverage for those codepoints, so every browser visitor saw tofu boxes in the statusline.
