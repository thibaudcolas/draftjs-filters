# Contribution Guidelines

Thank you for considering to help this project.

We welcome all support, whether on bug reports, feature requests, code, design, reviews, tests, documentation, and more.

Please note that this project is released with a [Contributor Code of Conduct](CODE_OF_CONDUCT.md). By participating in this project you agree to abide by its terms.

## Development

### Install

> Clone the project on your computer. You will also need [Node](https://nodejs.org) and [nvm](https://github.com/creationix/nvm).

```sh
nvm install
# Then, install all project dependencies.
npm install
```

### Working on the project

> Everything mentioned in the installation process should already be done.

```sh
# Make sure you use the right node version.
nvm use
# Start the server and the development tools.
npm run start
# Runs linting.
npm run lint
# Re-formats all of the files in the project (with Prettier).
npm run format
# Run tests in a watcher.
npm run test:watche
# Open the coverage report with:
npm run report:coverage
# Open the build report with:
npm run report:build
# View other available commands with:
npm run
```

### Code style

This project uses [Prettier](https://prettier.io/), [ESLint](https://eslint.org/), and [TypeScript](https://www.typescriptlang.org/). All code should always be checked with those tools.
