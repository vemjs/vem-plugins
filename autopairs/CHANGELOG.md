# @vemjs/plugin-autopairs

## 0.1.2

### Patch Changes

- 7701036: autopairs: typing a closing bracket/quote that's already sitting right after the cursor (typically the one autopairs just inserted) now steps over it instead of leaving a duplicate (`())` → `()`).

  git: removed hardcoded "mockup" gutter signs that painted fake green/blue/red add/change/delete marks on every buffer regardless of real git state (`window` is always defined in a browser/webview, so this fired unconditionally on both vem.run and vem-desktop). Real `git diff` sign computation — Node/Bun-only, since browsers and webviews can't shell out — also had a latent bug: it never set the subprocess `cwd`, so it always diffed against the process's own working directory instead of the edited file's, and would have failed the moment a real file path was passed in.
