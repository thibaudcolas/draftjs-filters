import { testFilteringDiff } from "./utils"
import { draftjs } from "./fixtures"

describe("Draft.js", () => {
  Object.entries(draftjs).forEach(([key, data]) => {
    it(key, () => testFilteringDiff(data))
  })
})
