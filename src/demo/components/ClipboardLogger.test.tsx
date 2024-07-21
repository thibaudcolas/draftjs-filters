import { describe, it, expect } from "vitest"
import { render, fireEvent } from "@testing-library/react"
import ClipboardLogger from "./ClipboardLogger"

describe("ClipboardLogger", () => {
  it("renders", () => {
    const { asFragment } = render(<ClipboardLogger />)
    expect(asFragment()).toMatchInlineSnapshot(`
      <DocumentFragment>
        <div>
          <label>
            <div>
              Paste here
            </div>
            <textarea />
          </label>
          <label>
            <div>
              Or here
            </div>
            <input
              type="text"
              value=""
            />
          </label>
        </div>
      </DocumentFragment>
    `)
  })

  it("on paste", () => {
    const { getAllByText } = render(<ClipboardLogger />)

    const clipboardData = {
      clipboardData: {
        getData: () => "Pasted Text",
      },
    }

    // Step 3: Simulate the paste event
    fireEvent.paste(document, clipboardData)

    expect(getAllByText("0: Pasted Text…")).toBeTruthy()
  })

  it("on paste no data", () => {
    const { getAllByText } = render(<ClipboardLogger />)

    const clipboardData = {
      clipboardData: null,
    }

    // Step 3: Simulate the paste event
    fireEvent.paste(document, clipboardData)

    expect(getAllByText("0: …")).toBeTruthy()
  })
})
