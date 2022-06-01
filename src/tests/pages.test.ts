import { testFilteringDiff } from "./utils"
import { applePages } from "./fixtures"

describe("Apple Pages", () => {
  Object.entries(applePages).forEach(([key, data]) => {
    it(key, () => testFilteringDiff(data))
  })
})
