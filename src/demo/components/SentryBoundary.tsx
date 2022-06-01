import { Component, ReactNode } from "react"

interface SentryBoundaryProps {
  children: ReactNode
}

interface SentryBoundaryState {
  error: Error | null | undefined
}

class SentryBoundary extends Component<
  SentryBoundaryProps,
  SentryBoundaryState
> {
  constructor(props: SentryBoundaryProps) {
    super(props)
    this.state = {
      error: null,
    }
  }

  componentDidCatch(error: Error) {
    this.setState({
      error,
    })
  }

  render() {
    const { children } = this.props
    const { error } = this.state

    return error ? (
      <div className="DraftEditor-root">
        <div className="DraftEditor-editorContainer">
          <div className="public-DraftEditor-content">
            <div className="u-text-center">
              <p>Oops. The editor just crashed.</p>
              <p>
                Our team has been notified. You can provide us with more
                information if you want to.
              </p>
              <div>
                <a
                  href="https://github.com/thibaudcolas/draftjs-filters/issues"
                  target="_blank"
                  rel="noreferrer"
                  style={{
                    textDecoration: "underline",
                  }}
                >
                  Open a GitHub issue
                </a>
                <span>&nbsp;</span>
                <button type="button" onClick={() => window.location.reload()}>
                  Reload the page
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    ) : (
      children
    )
  }
}

export default SentryBoundary
