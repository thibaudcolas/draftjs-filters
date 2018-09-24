// @flow
import React, { Component } from "react"
import type { Node } from "react"

type Props = {
  children: Node,
}

type State = {
  error: ?Error,
}

class SentryBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = { error: null }
  }

  componentDidCatch(error: Error, errorInfo: Object) {
    const isRavenAvailable = !!window.Raven
    this.setState({ error })

    if (isRavenAvailable) {
      window.Raven.captureException(error, { extra: errorInfo })
    }
  }

  render() {
    const { children } = this.props
    const { error } = this.state
    const isRavenAvailable = !!window.Raven

    return error ? (
      <div className="DraftEditor-root">
        <div className="DraftEditor-editorContainer">
          <div className="public-DraftEditor-content">
            {/* <img src={oops} /> */}
            <div className="u-text-center">
              <p>Oops. The editor just crashed.</p>
              <p>
                Our team has been notified. You can provide us with more
                information if you want to.
              </p>
              <div>
                {isRavenAvailable ? (
                  <button
                    type="button"
                    onClick={() =>
                      window.Raven.lastEventId() &&
                      window.Raven.showReportDialog()
                    }
                  >
                    Submit a report
                  </button>
                ) : (
                  <a
                    href="https://github.com/thibaudcolas/draftjs-filters/issues"
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      textDecoration: "underline",
                    }}
                  >
                    Open a GitHub issue
                  </a>
                )}
                <span>&nbsp;</span>
                <button
                  type="button"
                  onClick={() => window.location.reload(false)}
                >
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
