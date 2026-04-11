# AGENTS.md

Guidance for coding agents and automated contributors working on this repository.

## Scope

- Keep changes focused on the requested task.
- Prefer small, reviewable pull requests.
- Avoid unrelated refactors.

## Quality checks

Run these before opening a PR:

```sh
nvm use
npm run lint
npm run test
```

For larger changes, also run:

```sh
npm run build
```

## Docs and tests

- Update docs when behavior or workflows change.
- Add or update tests for non-trivial code changes.

## Commit and PR hygiene

- Use clear commit messages (conventional commits preferred).
- Summarize user-facing impact in the PR description.
- Call out trade-offs or follow-up work explicitly.
