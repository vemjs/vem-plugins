---
"@vemjs/plugin-git": patch
---

Run `git diff` through `execFileSync` with an argument array instead of `execSync` shell interpolation, so a hostile buffer file path can never inject a shell command.
