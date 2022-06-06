import * as exports from "./index"

const pkg = require("../../package.json")

/**
 * Makes sure the API shape is validated against.
 */
describe(pkg.name, () => {
  it("has a stable API", () => {
    expect(exports).toMatchInlineSnapshot(`
      Object {
        "applyContentWithSelection": [Function],
        "cloneEntities": [Function],
        "condenseBlocks": [Function],
        "filterBlockTypes": [Function],
        "filterEditorState": [Function],
        "filterEntityData": [Function],
        "filterEntityRanges": [Function],
        "filterInlineStyles": [Function],
        "limitBlockDepth": [Function],
        "preserveAtomicBlocks": [Function],
        "preserveBlockByText": [Function],
        "removeInvalidAtomicBlocks": [Function],
        "removeInvalidDepthBlocks": [Function],
        "replaceTextBySpaces": [Function],
        "resetAtomicBlocks": [Function],
        "shouldKeepEntityByAttribute": [Function],
        "shouldKeepEntityType": [Function],
        "shouldRemoveImageEntity": [Function],
      }
    `)
  })
})
