import {
  preserveAtomicBlocks,
  resetAtomicBlocks,
  removeInvalidAtomicBlocks,
  removeInvalidDepthBlocks,
  limitBlockDepth,
  preserveBlockByText,
  filterBlockTypes,
  filterInlineStyles,
  cloneEntities,
  filterEntityRanges,
  shouldKeepEntityType,
  shouldRemoveImageEntity,
  filterEntityData,
  replaceTextBySpaces,
  applyContentWithSelection,
  filterEditorState,
} from "./index"

const pkg = require("../../package.json")

/**
 * Makes sure the API shape is validated against.
 */
describe(pkg.name, () => {
  it("has a stable API", () => {
    expect(preserveAtomicBlocks).toBeDefined()
    expect(resetAtomicBlocks).toBeDefined()
    expect(removeInvalidAtomicBlocks).toBeDefined()
    expect(removeInvalidDepthBlocks).toBeDefined()
    expect(limitBlockDepth).toBeDefined()
    expect(preserveBlockByText).toBeDefined()
    expect(filterBlockTypes).toBeDefined()
    expect(filterInlineStyles).toBeDefined()
    expect(cloneEntities).toBeDefined()
    expect(filterEntityRanges).toBeDefined()
    expect(shouldKeepEntityType).toBeDefined()
    expect(shouldRemoveImageEntity).toBeDefined()
    expect(filterEntityData).toBeDefined()
    expect(replaceTextBySpaces).toBeDefined()
    expect(applyContentWithSelection).toBeDefined()
    expect(filterEditorState).toBeDefined()
  })
})
