# @vemjs/plugin-git

## 0.1.4

### Patch Changes

- 6d8d0bd: 2026-07-16 audit fixes. git: sources its diff from the host's `gitDiff` capability (plugin-api 0.1.7) instead of a Node-only `child_process` path that never ran in the browser or the Tauri webview, and refreshes signs on save. telescope: find-files selection now opens the file through the host's `openFile` capability (falling back to the legacy relabel when absent), and the command palette uses the public `executePluginCommand` instead of poking a private field. lualine: the `[+]` modified flag reads core's real `modified` dirty bit rather than the pending-chord key buffer. layout-customizer: `theme.setDefault` restores core 0.3.x's actual Vim-black default palette instead of a stale slate one. Dev toolchain now compiles/tests against `@vemjs/core@^0.3.1` / `plugin-api@^0.1.7` (was two minors behind).

## 0.1.3

### Patch Changes

- 7701036: autopairs: typing a closing bracket/quote that's already sitting right after the cursor (typically the one autopairs just inserted) now steps over it instead of leaving a duplicate (`())` → `()`).

  git: removed hardcoded "mockup" gutter signs that painted fake green/blue/red add/change/delete marks on every buffer regardless of real git state (`window` is always defined in a browser/webview, so this fired unconditionally on both vem.run and vem-desktop). Real `git diff` sign computation — Node/Bun-only, since browsers and webviews can't shell out — also had a latent bug: it never set the subprocess `cwd`, so it always diffed against the process's own working directory instead of the edited file's, and would have failed the moment a real file path was passed in.

## 0.1.2

### Patch Changes

- bea04ce: Avoid Vite browser externalization warnings by hiding the Node `child_process` import behind a runtime-only dynamic import.
- 7f3fa24: Run `git diff` through `execFileSync` with an argument array instead of `execSync` shell interpolation, so a hostile buffer file path can never inject a shell command.
