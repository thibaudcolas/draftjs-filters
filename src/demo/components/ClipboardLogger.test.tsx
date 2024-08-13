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

  it("on type in textarea", () => {
    render(<ClipboardLogger />)

    const field = document.querySelector("textarea") as HTMLTextAreaElement
    fireEvent.change(field, { target: { value: "Typed Text" } })
    expect(field.value).toBe("Typed Text")
  })

  it("on type in input", () => {
    render(<ClipboardLogger />)

    const field = document.querySelector("[type='text']") as HTMLInputElement
    fireEvent.change(field, { target: { value: "Typed Text" } })
    expect(field.value).toBe("Typed Text")
  })
})
