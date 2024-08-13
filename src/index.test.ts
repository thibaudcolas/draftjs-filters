import { describe, it, beforeEach, expect, vi } from "vitest"

describe("demo", () => {
  beforeEach(() => {
    vi.resetModules()
  })

  it("mount", async () => {
    document.body.innerHTML = "<div id=root></div>"

    await import("./index")

    expect(document.body.innerHTML).toContain("DraftEditor-root")
  })

  it("no mount", async () => {
    document.body.innerHTML = ""

    await import("./index")

    expect(document.body.innerHTML).toBe("")
  })
})

export {}
