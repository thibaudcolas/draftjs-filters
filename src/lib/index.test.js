import {
  preserveAtomicBlocks,
  removeInvalidDepthBlocks,
  resetBlockDepth,
  resetBlockType,
  filterInlineStyle,
  resetAtomicBlocks,
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
  it("resetBlockDepth", () => expect(resetBlockDepth).toBeDefined())
  it("resetBlockType", () => expect(resetBlockType).toBeDefined())
  it("filterInlineStyle", () => expect(filterInlineStyle).toBeDefined())
  it("resetAtomicBlocks", () => expect(resetAtomicBlocks).toBeDefined())
  it("filterEntityRanges", () => expect(filterEntityRanges).toBeDefined())
  it("shouldKeepEntityType", () => expect(shouldKeepEntityType).toBeDefined())
  it("shouldRemoveImageEntity", () =>
    expect(shouldRemoveImageEntity).toBeDefined())
  it("filterEntityAttributes", () =>
    expect(filterEntityAttributes).toBeDefined())
  it("replaceTextBySpaces", () => expect(replaceTextBySpaces).toBeDefined())
  it("filterEditorState", () => expect(filterEditorState).toBeDefined())
})
