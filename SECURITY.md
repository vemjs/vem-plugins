# Security Policy

## Supported Versions

These plugins are pre-1.0 and ship from the latest published release only. Security fixes land on
the latest minor of each package; older `0.x` minors are not back-patched.

| Package                           | Supported            |
| --------------------------------- | -------------------- |
| `@vemjs/plugin-autopairs`         | latest `0.x` release |
| `@vemjs/plugin-git`               | latest `0.x` release |
| `@vemjs/plugin-layout-customizer` | latest `0.x` release |
| `@vemjs/plugin-lualine`           | latest `0.x` release |
| `@vemjs/plugin-telescope`         | latest `0.x` release |
| `@vemjs/plugin-treesitter`        | latest `0.x` release |
| `@vemjs/plugin-trim-whitespace`   | latest `0.x` release |

## Reporting a Vulnerability

If you discover a security vulnerability within this project, please DO NOT create a public issue.
Instead, report it privately via
[GitHub Security Advisories](https://github.com/vemjs/vem-plugins/security/advisories/new).

`@vemjs/plugin-git` shells out to the system `git` binary using an argument array (never a shell
string), specifically so a crafted file path can't inject a command — if you find a way around
that, it's a high-priority report.

We take all security issues seriously and will respond to reports as quickly as possible. Upon verification, we will provide a timeline for the fix and coordinate a public disclosure after the patch has been released.
