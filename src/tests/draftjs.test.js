import { testFilteringDiff } from "./utils"
import { draftjs } from "./fixtures"

describe("Draft.js", () => {
  Object.keys(draftjs).forEach((key) => {
    it(key, () => testFilteringDiff(draftjs[key]))
  })
})
