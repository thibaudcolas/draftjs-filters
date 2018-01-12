import {
  preserveAtomicBlocks,
  resetBlockDepth,
  resetBlockType,
  filterInlineStyle,
  resetAtomicBlocks,
  filterEntityType,
  whitespaceCharacters,
  filterEditorState,
} from "./index"

const pkg = require("../../package.json")

/**
 * Makes sure the API shape is validated against.
 */
describe(pkg.name, () => {
  it("preserveAtomicBlocks", () => expect(preserveAtomicBlocks).toBeDefined())
  it("resetBlockDepth", () => expect(resetBlockDepth).toBeDefined())
  it("resetBlockType", () => expect(resetBlockType).toBeDefined())
  it("filterInlineStyle", () => expect(filterInlineStyle).toBeDefined())
  it("resetAtomicBlocks", () => expect(resetAtomicBlocks).toBeDefined())
  it("filterEntityType", () => expect(filterEntityType).toBeDefined())
  it("whitespaceCharacters", () => expect(whitespaceCharacters).toBeDefined())
  it("filterEditorState", () => expect(filterEditorState).toBeDefined())
})
