# Contribution Guidelines

Thanks for considering contributing to this project.

We welcome all support, whether on bug reports, feature requests, code, design, reviews, tests, documentation, and more.

Please note that this project is released with a [Contributor Code of Conduct](CODE_OF_CONDUCT.md). By participating in this project you agree to abide by its terms.

## Development setup

### Prerequisites

- [Node.js](https://nodejs.org/) (version from `.nvmrc`)
- [nvm](https://github.com/nvm-sh/nvm)

### Install

```sh
# Clone the repository first.
nvm install
nvm use
npm install
```

## Working on the project

```sh
# Ensure the expected Node.js version.
nvm use

# Start the local demo site.
npm run start

# Lint all files.
npm run lint

# Format files with Prettier.
npm run format

# Run tests once.
npm run test

# Or run tests in watch mode.
npm run test:watch

# Open the coverage report.
npm run report:coverage

# See all available scripts.
npm run
```

## Pull requests

Before opening a pull request:

1. Keep changes focused and explain the motivation.
2. Update documentation and tests when relevant.
3. Ensure linting and tests pass locally (`npm run lint` and `npm run test`).

PRs should use clear commit messages (conventional commits are preferred).

## Code style

This project uses [Prettier](https://prettier.io/), [ESLint](https://eslint.org/), and [TypeScript](https://www.typescriptlang.org/). Please run formatting and linting before submitting changes.
