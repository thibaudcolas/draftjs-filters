import { describe, it, expect, vi } from "vitest"
import { render, fireEvent } from "@testing-library/react"
import Highlight from "./Highlight"

describe("Highlight", () => {
  it("renders", () => {
    const { asFragment } = render(<Highlight value="" />)
    expect(asFragment()).toMatchInlineSnapshot(`
      <DocumentFragment>
        <div
          style="position: relative;"
        >
          <button
            style="position: absolute; right: 1rem;"
          >
            Copy
          </button>
          <textarea
            readonly=""
            style="width: 100%; resize: vertical; min-height: 100px;"
          />
        </div>
      </DocumentFragment>
    `)
  })

  it("onCopy", async () => {
    document.execCommand = vi.fn()
    const { findAllByRole } = render(<Highlight value="" />)

    fireEvent.click((await findAllByRole("button"))[0])

    expect(document.execCommand).toHaveBeenCalledWith("copy")
  })
})
