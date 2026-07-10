# @vemjs/plugin-git

## 0.1.2

### Patch Changes

- bea04ce: Avoid Vite browser externalization warnings by hiding the Node `child_process` import behind a runtime-only dynamic import.
- 7f3fa24: Run `git diff` through `execFileSync` with an argument array instead of `execSync` shell interpolation, so a hostile buffer file path can never inject a shell command.
