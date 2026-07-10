# @vemjs/plugin-lualine

## 0.1.2

### Patch Changes

- bea04ce: Replace hardcoded Nerd Font Private Use Area glyphs (git branch, error, warning icons) in the statusline segments with plain text / standard Unicode symbols. The web build only loads plain "JetBrains Mono" from Google Fonts, which has no coverage for those codepoints, so every browser visitor saw tofu boxes in the statusline.
