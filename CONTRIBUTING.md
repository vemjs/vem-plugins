# Contributing to vem-plugins

## Process

`Issue → Branch → PR → Review → Merge`, same as every other `vemjs` repo:

1. Open an issue, unless one already covers it.
2. Branch from `main`.
3. Make the change with tests — every plugin here has its own `src/index.test.ts`.
4. Open a PR against `main`. CI (test, lint, format) must pass.
5. A maintainer reviews and merges.

## Local development

```bash
git clone https://github.com/vemjs/vem-plugins.git
cd vem-plugins
bun install
bun test
```

## Adding a new plugin

1. `mkdir my-plugin && cd my-plugin`, copy the `package.json`/`tsconfig.json` shape from an
   existing plugin (e.g. `autopairs`).
2. Add the directory to the root `package.json`'s `workspaces` array and to `build`'s `for dir in
…` list.
3. Write `src/index.ts` exporting a `VemPlugin` (see the README's "Writing a new plugin" section)
   and `src/index.test.ts` with real coverage — register it via `PluginRegistry` in the test and
   assert on `VemEditorState` changes, not just that `activate()` doesn't throw.
4. Add a changeset (`bun run changeset`) for the initial publish.

## Versioning and releases

[Changesets](https://github.com/changesets/changesets), one changeset per user-visible change:

```bash
bun run changeset
```

`patch` for bug fixes, `minor` for backward-compatible new features, `major` for breaking changes.
Merging to `main` with pending changesets opens (or updates) a "Version Packages" PR; merging that
publishes the bumped packages to npm automatically.

## Security

Please don't file public issues for security vulnerabilities — see [SECURITY.md](SECURITY.md).
