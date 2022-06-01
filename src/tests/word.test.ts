import { testFilteringDiff } from "./utils"
import { microsoftWord } from "./fixtures"

describe("Microsoft Word", () => {
  Object.keys(microsoftWord).forEach((key) => {
    it(key, () => testFilteringDiff(microsoftWord[key]))
  })
})
