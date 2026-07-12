# vem-plugins

[![CI](https://github.com/vemjs/vem-plugins/actions/workflows/ci.yml/badge.svg)](https://github.com/vemjs/vem-plugins/actions/workflows/ci.yml)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

The official plugins for [Vem](https://github.com/vemjs/vem), a canvas-native modal editor. Each
plugin is a standalone `@vemjs/plugin-api` `VemPlugin` — a plain object with an `activate(context)`
function — published as its own npm package so consumers only install what they use.

## Packages

| Package                                                  | What it does                                                                      |
| -------------------------------------------------------- | --------------------------------------------------------------------------------- |
| [`@vemjs/plugin-autopairs`](./autopairs)                 | Auto-closes brackets/quotes in INSERT mode, with type-over instead of duplicating |
| [`@vemjs/plugin-git`](./git)                             | Gutter add/change/delete signs from `git diff` (Node/Bun runtimes only)           |
| [`@vemjs/plugin-layout-customizer`](./layout-customizer) | Toggle sidebar position/statusbar position, resize the sidebar                    |
| [`@vemjs/plugin-lualine`](./lualine)                     | A lualine-style statusline (mode/file/position segments)                          |
| [`@vemjs/plugin-telescope`](./telescope)                 | Fuzzy file finder and help-tag picker (`:Telescope`-style popups)                 |
| [`@vemjs/plugin-treesitter`](./treesitter)               | Syntax highlighting (`:syntax on`)                                                |
| [`@vemjs/plugin-trim-whitespace`](./trim-whitespace)     | Strips trailing whitespace on save                                                |

Most of these are deferred/opt-in by default in [vem.run](https://vem.run) and
[vem-desktop](https://github.com/vemjs/vem-desktop) — Vem boots as a faithfully blank Vim, and
appearance plugins (lualine, treesitter) activate on demand via `:Lualine` / `:syntax on`.

## Development

Each plugin is a Bun workspace member with its own `package.json`, tests, and build:

```bash
git clone https://github.com/vemjs/vem-plugins.git
cd vem-plugins
bun install
bun test        # runs every plugin's test suite
bun run build    # builds every plugin
```

To work on one plugin in isolation:

```bash
cd autopairs
bun test
```

## Writing a new plugin

A `VemPlugin` is:

```ts
import { type VemPlugin } from "@vemjs/plugin-api";

export const MyPlugin: VemPlugin = {
  name: "my-plugin",
  version: "0.1.0",
  activate(context) {
    const editor = context.editorState;
    // context.onDidChangeBuffer / onDidChangeMode / onDidOpenBuffer / onSave,
    // context.registerCommand, context.registerKeybinding — see @vemjs/plugin-api.
  },
};
```

Plugins that need real system access (shelling out, filesystem, native APIs) only work in a
Node/Bun runtime — both vem.run's browser build and vem-desktop's Tauri webview always have
`window` defined and no `child_process`, so gate any such logic on
`typeof window === "undefined"` and fail closed (no fabricated behavior) rather than guessing, the
way `@vemjs/plugin-git` does for its `git diff` gutter signs.

## Versioning and releases

Each plugin is versioned independently via [Changesets](https://github.com/changesets/changesets).
Add one for any user-visible change:

```bash
bun run changeset
```

Merging to `main` with pending changesets opens (or updates) a "Version Packages" PR; merging that
PR publishes the bumped packages to npm automatically.

## Related repositories

- [**vem**](https://github.com/vemjs/vem) — the editor engine these plugins target
  (`@vemjs/core`, `@vemjs/plugin-api`)
- [**vem-website**](https://github.com/vemjs/vem-website) — [vem.run](https://vem.run), which
  loads the official plugin set from this repo
- [**vem-desktop**](https://github.com/vemjs/vem-desktop) — the desktop shell, same plugin set

## License

MIT
