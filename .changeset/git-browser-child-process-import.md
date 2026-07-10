---
"@vemjs/plugin-git": patch
---

Avoid Vite browser externalization warnings by hiding the Node `child_process` import behind a runtime-only dynamic import.
