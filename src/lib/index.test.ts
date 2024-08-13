import { describe, it, expect } from "vitest"
import * as exports from "./index"

/**
 * Makes sure the API shape is validated against.
 */
describe("draftjs-filters", () => {
  it("has a stable API", () => {
    expect(exports).toMatchInlineSnapshot(`
      {
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
