import {
  preserveAtomicBlocks,
  removeInvalidDepthBlocks,
  limitBlockDepth,
  filterBlockTypes,
  filterInlineStyles,
  filterAtomicBlocks,
  filterEntityRanges,
  shouldKeepEntityType,
  shouldRemoveImageEntity,
  filterEntityAttributes,
  replaceTextBySpaces,
  filterEditorState,
} from "./index"

const pkg = require("../../package.json")

/**
 * Makes sure the API shape is validated against.
 */
describe(pkg.name, () => {
  it("preserveAtomicBlocks", () => expect(preserveAtomicBlocks).toBeDefined())
  it("removeInvalidDepthBlocks", () =>
    expect(removeInvalidDepthBlocks).toBeDefined())
  it("limitBlockDepth", () => expect(limitBlockDepth).toBeDefined())
  it("filterBlockTypes", () => expect(filterBlockTypes).toBeDefined())
  it("filterInlineStyles", () => expect(filterInlineStyles).toBeDefined())
  it("filterAtomicBlocks", () => expect(filterAtomicBlocks).toBeDefined())
  it("filterEntityRanges", () => expect(filterEntityRanges).toBeDefined())
  it("shouldKeepEntityType", () => expect(shouldKeepEntityType).toBeDefined())
  it("shouldRemoveImageEntity", () =>
    expect(shouldRemoveImageEntity).toBeDefined())
  it("filterEntityAttributes", () =>
    expect(filterEntityAttributes).toBeDefined())
  it("replaceTextBySpaces", () => expect(replaceTextBySpaces).toBeDefined())
  it("filterEditorState", () => expect(filterEditorState).toBeDefined())
})
