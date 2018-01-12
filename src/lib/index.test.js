import {
  preserveAtomicBlocks,
  resetBlockDepth,
  resetBlockType,
  filterInlineStyle,
  resetAtomicBlocks,
  filterEntityType,
  filterEditorState,
} from "./index"

const pkg = require("../../package.json")

/**
 * Makes sure the API shape is validated against.
 */
describe(pkg.name, () => {
  it("filterEditorState", () => expect(filterEditorState).toBeDefined())
})
