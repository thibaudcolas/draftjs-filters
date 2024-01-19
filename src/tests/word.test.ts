import { describe, it } from "vitest"
import { testFilteringDiff } from "./utils"
import { microsoftWord } from "./fixtures"

describe("Microsoft Word", () => {
  Object.entries(microsoftWord).forEach(([key, data]) => {
    it(key, () => testFilteringDiff(data))
  })
})
