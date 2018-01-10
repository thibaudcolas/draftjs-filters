import { filterEditorState } from "./index"

const pkg = require("../../package.json")

describe(pkg.name, () => {
  it("filterEditorState", expect(filterEditorState).toBeDefined())
})
