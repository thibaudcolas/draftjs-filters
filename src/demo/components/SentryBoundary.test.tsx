import { describe, it, expect, vi } from "vitest"
import { render, fireEvent } from "@testing-library/react"
import SentryBoundary from "./SentryBoundary"

// A component that throws an error when a certain prop is true
const ErrorComponent = ({ throwError }: { throwError: boolean }) => {
  if (throwError) {
    throw new Error("Test error")
  }
  return <div>Normal operation</div>
}

describe("SentryBoundary", () => {
  it("renders", () => {
    const { asFragment } = render(<SentryBoundary>Test</SentryBoundary>)
    expect(asFragment()).toMatchInlineSnapshot(`
      <DocumentFragment>
        Test
      </DocumentFragment>
    `)
  })

  it("catches errors with componentDidCatch", () => {
    Object.defineProperty(window, "location", {
      configurable: true,
      value: { reload: vi.fn() },
    })

    // Render the SentryBoundary with the ErrorComponent inside
    const { getByText } = render(
      <SentryBoundary>
        <ErrorComponent throwError={true} />
      </SentryBoundary>,
    )

    expect(getByText("Oops. The editor just crashed.")).toBeTruthy()

    fireEvent.click(getByText("Reload the page"))

    expect(window.location.reload).toHaveBeenCalled()
  })
})
