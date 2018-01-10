# [Draft.js filters](https://thibaudcolas.github.io/draftjs-filters/) [![npm](https://img.shields.io/npm/v/draftjs-filters.svg?style=flat-square)](https://www.npmjs.com/package/draftjs-filters) [![Build Status](https://travis-ci.org/thibaudcolas/draftjs-filters.svg?branch=master)](https://travis-ci.org/thibaudcolas/draftjs-filters) [![Coverage Status](https://coveralls.io/repos/github/thibaudcolas/draftjs-filters/badge.svg)](https://coveralls.io/github/thibaudcolas/draftjs-filters)

> Filter [Draft.js](https://facebook.github.io/draft-js/) content when copy-pasting rich text into the editor. Initially made for [Draftail](https://github.com/springload/draftail).

Check out the [online demo](https://thibaudcolas.github.io/draftjs-filters).

## Using the filters

First, grab the package from npm:

```sh
npm install --save draftjs-filters
```

WIP – Then, import the filters' entry point and use it in your `<Editor>`'s `onChange` function:

```js
import { filterEditorState } from "draftjs-filters"

function onChange(nextEditorState) {
  const {
    stateSaveInterval,
    maxListNesting,
    enableHorizontalRule,
    stripPastedStyles,
    blockTypes,
    inlineStyles,
    entityTypes,
  } = this.props
  const { editorState } = this.state
  const content = editorState.getCurrentContent()
  const nextContent = nextEditorState.getCurrentContent()
  const shouldFilterPaste =
    nextContent !== content &&
    !stripPastedStyles &&
    nextEditorState.getLastChangeType() === "insert-fragment"

  let filteredEditorState = nextEditorState
  if (shouldFilterPaste) {
    filteredEditorState = filterEditorState(
      nextEditorState,
      maxListNesting,
      enableHorizontalRule,
      blockTypes,
      inlineStyles,
      entityTypes,
    )
  }

  this.setState({ editorState: filteredEditorState })
}
```

### Browser support and polyfills

The Draft.js filters follow the browser support targets of Draft.js. Be sure to have a look at the [Draft.js required polyfills](https://facebook.github.io/draft-js/docs/advanced-topics-issues-and-pitfalls).

## Contributing

See anything you like in here? Anything missing? We welcome all support, whether on bug reports, feature requests, code, design, reviews, tests, documentation, and more. Please have a look at our [contribution guidelines](.github/CONTRIBUTING.md).

## Development

### Install

> Clone the project on your computer, and install [Node](https://nodejs.org). This project also uses [nvm](https://github.com/creationix/nvm).

```sh
nvm install
# Then, install all project dependencies.
npm install
# Install the git hooks.
./.githooks/deploy
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
npm run flow
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

### Releases

## Credits

View the full list of [contributors](https://github.com/springload/draftail/graphs/contributors). [MIT](LICENSE) licensed. Website content available as [CC0](https://creativecommons.org/publicdomain/zero/1.0/).
