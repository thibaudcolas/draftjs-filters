import { shallow } from "enzyme"
import SentryBoundary from "./SentryBoundary"

describe("SentryBoundary", () => {
  it("renders", () => {
    expect(
      shallow<SentryBoundary>(<SentryBoundary>Test</SentryBoundary>),
    ).toMatchSnapshot()
  })

  it("componentDidCatch", () => {
    const wrapper = shallow<SentryBoundary>(
      <SentryBoundary>Test</SentryBoundary>,
    )

    wrapper.instance().componentDidCatch(new Error("test"))

    expect(wrapper.state("error")).not.toBe(null)
  })

  it("#error", () => {
    expect(
      shallow<SentryBoundary>(<SentryBoundary>Test</SentryBoundary>).setState({
        error: new Error("test"),
      }),
    ).toMatchSnapshot()
  })

  it("#error reload", () => {
    Object.defineProperty(window, "location", {
      configurable: true,
      value: { reload: jest.fn() },
    })

    shallow<SentryBoundary>(<SentryBoundary>Test</SentryBoundary>)
      .setState({
        error: new Error("test"),
      })
      .find("button")
      .simulate("click")
    expect(window.location.reload).toHaveBeenCalled()
  })
})
