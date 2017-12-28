// @flow
import PropTypes from "prop-types"
import React, { Component } from "react"
import type { Node } from "react"

const Raven = window.Raven
const isRavenAvailable = !!Raven

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
    this.setState({ error })

    if (isRavenAvailable) {
      Raven.captureException(error, { extra: errorInfo })
    }
  }

  render() {
    const { children } = this.props
    const { error } = this.state

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
                      Raven.lastEventId() && Raven.showReportDialog()
                    }
                  >
                    Submit a report
                  </button>
                ) : (
                  <a
                    href="https://github.com/thibaudcolas/draftjs-paste/issues"
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      textDecoration: "underline",
                    }}
                  >
                    Open a GitHub issue
                  </a>
                )}
                <span> or </span>
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

SentryBoundary.propTypes = {
  children: PropTypes.node.isRequired,
}

export default SentryBoundary
