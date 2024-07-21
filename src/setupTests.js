import { expect, vi } from "vitest"
import snapshotDiff from "snapshot-diff"

// https://github.com/jest-community/snapshot-diff
expect.addSnapshotSerializer(snapshotDiff.getSnapshotDiffSerializer())

vi.mock("draft-js", async () => {
  const packages = {
    "0.10": "draft-js-10",
    0.11: "draft-js",
  }
  const version = process.env.DRAFTJS_VERSION || "0.11"

  return await vi.importActual(packages[version])
})

const consoleWarn = console.warn

console.warn = function filterWarnings(msg, ...args) {
  // Stop logging React warnings we shouldn’t be doing anything about at this time.
  const supressedWarnings = [
    "Warning: componentWillMount",
    "Warning: componentWillReceiveProps",
    "Warning: componentWillUpdate",
  ]

  if (!supressedWarnings.some((entry) => msg.includes(entry))) {
    consoleWarn.apply(console, ...args)
  }
}
