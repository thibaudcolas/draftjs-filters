# [Draft.js filters](https://thibaudcolas.github.io/draftjs-filters/) [![npm](https://img.shields.io/npm/v/draftjs-filters.svg)](https://www.npmjs.com/package/draftjs-filters) [![Build Status](https://travis-ci.org/thibaudcolas/draftjs-filters.svg?branch=master)](https://travis-ci.org/thibaudcolas/draftjs-filters) [![Coverage Status](https://coveralls.io/repos/github/thibaudcolas/draftjs-filters/badge.svg)](https://coveralls.io/github/thibaudcolas/draftjs-filters) [<img src="https://cdn.rawgit.com/springload/awesome-wagtail/ac912cc661a7099813f90545adffa6bb3e75216c/logo.svg" width="104" align="right" alt="Wagtail">](https://wagtail.io/)

> Filter [Draft.js](https://facebook.github.io/draft-js/) content to preserve only the formatting you allow. Built for [Draftail](https://github.com/springload/draftail) and [Wagtail](https://github.com/wagtail/wagtail).

[![Screenshot of Microsoft Word with tens of toolbars activated](https://thibaudcolas.github.io/draftjs-filters/word-toolbars-overload.jpg)](https://thibaudcolas.github.io/draftjs-filters)

The main use case is to select what formatting to keep when copy-pasting rich text into an editor, for example from Word or Google Docs, addressing Draft.js limitations like [#166](https://github.com/facebook/draft-js/issues/166) and [#504](https://github.com/facebook/draft-js/issues/504). Check out the [online demo](https://thibaudcolas.github.io/draftjs-filters)!

> If you want to learn more about how this is used in practice, have a look at [Rethinking rich text pipelines with Draft.js](https://wagtail.io/blog/rethinking-rich-text-pipelines-with-draft-js/).

## Using the filters

First, grab the package from npm:

```sh
npm install --save draftjs-filters
```

Then, in your editor import `filterEditorState` and call it in the Draft.js `onChange` handler. This function takes two parameters: the filtering configuration, and the `editorState`.

```js
import { filterEditorState } from "draftjs-filters"

function onChange(nextState) {
  const { editorState } = this.state
  let filteredState = nextState

  const shouldFilterPaste =
    nextState.getCurrentContent() !== editorState.getCurrentContent() &&
    nextState.getLastChangeType() === "insert-fragment"

  if (shouldFilterPaste) {
    filteredState = filterEditorState(
      {
        blocks: ["header-two", "header-three", "unordered-list-item"],
        styles: ["BOLD"],
        entities: [
          {
            type: "IMAGE",
            attributes: ["src"],
            whitelist: {
              src: "^http",
            },
          },
          {
            type: "LINK",
            attributes: ["url"],
          },
        ],
        maxNesting: 1,
        whitespacedCharacters: ["\n", "\t", "📷"],
      },
      filteredState,
    )
  }

  this.setState({ editorState: filteredState })
}
```

Here are the available options:

```jsx
// Whitelist of allowed block types. unstyled and atomic are always included.
blocks: Array<string>,
// Whitelist of allowed inline styles.
styles: Array<string>,
// Whitelist of allowed entities.
entities: Array<{
    // Entity type, eg. "LINK"
    type: string,
    // Allowed attributes. Other attributes will be removed.
    attributes: Array<string>,
    // Refine which entities are kept by whitelisting acceptable values with regular expression patterns.
    whitelist: {
      [attribute: string]: string,
    },
}>,
// Maximum amount of depth for lists (0 = no nesting).
maxNesting: number,
// Characters to replace with whitespace.
whitespacedCharacters: Array<string>,
```

### Types

If your project uses [Flow](https://flow.org/), type inference should just work. If you don't use Flow, it won't get in your way either.

### Advanced usage

`filterEditorState` isn't very flexible. If you want more control over the filtering, simply compose your own filter function with the other single-purpose utilities. The Draft.js filters are published as ES6 modules using [Rollup](https://rollupjs.org/) – module bundlers like Rollup and Webpack will tree shake (remove) the unused functions so you only bundle the code you use.

```jsx
/**
 * Creates atomic blocks where they would be required for a block-level entity
 * to work correctly, when such an entity exists.
 * Note: at the moment, this is only useful for IMAGE entities that Draft.js
 * injects on arbitrary blocks on paste.
 */

preserveAtomicBlocks((content: ContentState))

/**
 * Resets atomic blocks to have a single-space char and no styles.
 */

resetAtomicBlocks((content: ContentState))

/**
 * Removes atomic blocks for which the entity isn't whitelisted.
 */

removeInvalidAtomicBlocks((whitelist: Array<Object>), (content: ContentState))

/**
 * Removes blocks that have a non-zero depth, and aren't list items.
 * Happens with Apple Pages inserting `unstyled` items between list items.
 */

removeInvalidDepthBlocks((content: ContentState))

/**
 * Resets the depth of all the content to at most max.
 */

limitBlockDepth((max: number), (content: ContentState))

/**
 * Changes block type and depth based on the block's text. – some word processors
 * add a specific prefix within the text, eg. "· Bulleted list" in Word 2010.
 * Also removes the matched text.
 * This is meant first and foremost for list items where the list bullet or numeral
 * ends up in the text. Other use cases may not be well covered.
 */
preserveBlockByText(
  (rules: Array<{
    test: string,
    type: string,
    depth: number,
  }>),
  (content: ContentState),
)

/**
 * Converts all block types not present in the whitelist to unstyled.
 * Also sets depth to 0 (for potentially nested list items).
 */

filterBlockTypes((whitelist: Array<string>), (content: ContentState))

/**
 * Removes all styles not present in the whitelist.
 */

filterInlineStyles((whitelist: Array<string>), (content: ContentState))

/**
 * Clones entities in the entityMap, so each range points to its own entity instance.
 * This only clones entities as necessary – if an entity is only referenced
 * in a single range, it won't be changed.
 */
cloneEntities((content: ContentState))

/**
 * Filters entity ranges (where entities are applied on text) based on the result of
 * the callback function. Returning true keeps the entity range, false removes it.
 * Draft.js automatically removes entities if they are not applied on any text.
 */

filterEntityRanges(
  (filterFn: (
    content: ContentState,
    entityKey: string,
    block: ContentBlock,
  ) => boolean),
  (content: ContentState),
)

/**
 * Keeps all entity types (images, links, documents, embeds) that are enabled.
 */

shouldKeepEntityType((whitelist: Array<Object>), (type: string))

/**
 * Removes invalid images – they should only be in atomic blocks.
 * This only removes the image entity, not the camera emoji (📷) that Draft.js inserts.
 * If we want to remove this in the future, consider that:
 * - It needs to be removed in the block text, where it's 2 chars / 1 code point.
 * - The corresponding CharacterMetadata needs to be removed too, and it's 2 instances
 */

shouldRemoveImageEntity((entityType: string), (blockType: string))

/**
 * Filters entities based on the data they contain.
 */

shouldKeepEntityByAttribute(
  (entityTypes: Array<Object>),
  (entityType: string),
  (data: Object),
)

/**
 * Filters data on an entity to only retain what is whitelisted.
 */

filterEntityData((entityTypes: Array<Object>), (content: ContentState))

/**
 * Replaces the given characters by their equivalent length of spaces, in all blocks.
 */

replaceTextBySpaces((characters: Array<string>), (content: ContentState))
```

### Browser support and polyfills

The Draft.js filters follow the browser support targets of Draft.js. Be sure to have a look at the [required Draft.js polyfills](https://facebook.github.io/draft-js/docs/advanced-topics-issues-and-pitfalls).

#### Word processor support

Have a look at our test data in [`pasting/`](pasting).

| Editor - Browser  | Chrome Windows | Chrome macOS | Firefox Windows | Firefox macOS | Edge Windows | IE11 Windows | Safari macOS | Safari iOS | Chrome Android |
| ----------------- | -------------- | ------------ | --------------- | ------------- | ------------ | ------------ | ------------ | ---------- | -------------- |
| **Word 2016**     |                |              |                 |               |              |              |              | N/A        | N/A            |
| **Word 2010**     |                | N/A          |                 | N/A           |              |              | N/A          | N/A        | N/A            |
| **Apple Pages**   | N/A            |              | N/A             |               | N/A          | N/A          |              |            | N/A            |
| **Google Docs**   |                |              |                 |               |              |              |              |            |                |
| **Word Online**   |                |              |                 |               |              | Unsupported  |              | ?          | ?              |
| **Dropbox Paper** |                |              |                 |               |              | Unsupported  |              | ?          | ?              |
| **Draft.js**      |                |              |                 |               |              |              |              |            |                |

Use the [Draft.js Cut/Copy/Paste testing plan](https://github.com/facebook/draft-js/wiki/Manual-Testing#cutcopypaste). We target specific external sources, and have ready-made test documents available to test them:

##### External sources

Here are external sources we want to pay special attention to, and for which we have ready-made test documents with diverse rich content.

- [Microsoft Word 2016](/pasting/documents/Draft.js%20paste%20test%20document%20Word2016%20macOS.docx)
- [Microsoft Word 2010](/pasting/documents/Draft.js%20paste%20test%20document%20Word2010.docx)
- [Google Docs](https://docs.google.com/document/d/1YjqkIMC3q4jAzy__-S4fb6mC_w9EssmA6aZbGYWFv80/edit)
- [Dropbox Paper](https://paper.dropbox.com/doc/Draft.js-paste-test-document-njfdkwmkeGQ9KICjVwLmU)
- [Apple Pages](/pasting/documents/Draft.js%20paste%20test%20document.pages)
- [Microsoft Word Online](https://1drv.ms/w/s!AuGin45FpiF5hjzm9QdWHYGqPrqm)

#### IE11

There are [known Draft.js issues](https://github.com/facebook/draft-js/issues/986) with pasting in IE11. For now, we advise users to turn on `stripPastedStyles` in IE11 only so that Draft.js removes all formatting but preserves whitespace:

```jsx
const IS_IE11 = !window.ActiveXObject && "ActiveXObject" in window

const editor = <Editor stripPastedStyles={IS_IE11} />
```

## Contributing

See anything you like in here? Anything missing? We welcome all support, whether on bug reports, feature requests, code, design, reviews, tests, documentation, and more. Please have a look at our [contribution guidelines](.github/CONTRIBUTING.md).

## Credits

View the full list of [contributors](https://github.com/springload/draftail/graphs/contributors). [MIT](LICENSE) licensed. Website content available as [CC0](https://creativecommons.org/publicdomain/zero/1.0/).

Microsoft Word toolbars screenshot from _PCWorld – Microsoft Word Turns 25_ article.
