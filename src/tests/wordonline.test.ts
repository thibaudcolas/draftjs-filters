import { testFilteringDiff } from "./utils"
import { wordOnline } from "./fixtures"

describe("Word Online", () => {
  Object.entries(wordOnline).forEach(([key, data]) => {
    it(key, () => testFilteringDiff(data))
  })
})
