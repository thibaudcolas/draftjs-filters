# Contribution Guidelines

Thank you for considering to help this project.

We welcome all support, whether on bug reports, feature requests, code, design, reviews, tests, documentation, and more.

Please note that this project is released with a [Contributor Code of Conduct](/docs/CODE_OF_CONDUCT.md). By participating in this project you agree to abide by its terms.

## Development

### Install

> Clone the project on your computer, and install [Node](https://nodejs.org). This project also uses [nvm](https://github.com/creationix/nvm).

```sh
nvm install
# Then, install all project dependencies.
npm install
# Install the git hooks.
./.githooks/deploy.sh
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
# Start a Flow server for type errors.
npx flow
# Re-formats all of the files in the project (with Prettier).
npm run format
# Run tests in a watcher.
npm run test:watch
# Run test coverage
npm run test:coverage
# Open the coverage report with:
npm run report:coverage
# Open the build report with:
npm run report:build
# View other available commands with:
npm run
```

### Code style

This project uses [Prettier](https://prettier.io/), [ESLint](https://eslint.org/), and [Flow](https://flow.org/). All code should always be checked with those tools.
