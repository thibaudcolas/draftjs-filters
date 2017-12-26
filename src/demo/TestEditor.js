import React, { Component } from "react"
import { Editor, EditorState, RichUtils, convertToRaw } from "draft-js"

import SentryBoundary from "./SentryBoundary"
import Highlight from "./Highlight"

import "./TestEditor.css"

class TestEditor extends Component {
  constructor(props) {
    super(props)

    this.state = {
      editorState: EditorState.createEmpty(),
    }

    this.onChange = this.onChange.bind(this)
    this.toggleBlock = this.toggleBlock.bind(this)
  }

  onChange(editorState) {
    const content = editorState.getCurrentContent()
    const rawContent = convertToRaw(content)

    this.setState({ editorState })

    sessionStorage.setItem(`content`, JSON.stringify(rawContent))
  }

  toggleBlock(type, e) {
    const { editorState } = this.state
    this.onChange(RichUtils.toggleBlockType(editorState, type))
  }

  render() {
    const { editorState } = this.state
    return (
      <div className="TestEditor">
        <SentryBoundary>
          <button onClick={this.toggleBlock.bind(this, "unstyled")}>P</button>
          <button onClick={this.toggleBlock.bind(this, "header-two")}>
            H2
          </button>
          <button onClick={this.toggleBlock.bind(this, "header-three")}>
            H3
          </button>
          <button onClick={this.toggleBlock.bind(this, "unordered-list-item")}>
            UL
          </button>
          <button onClick={this.toggleBlock.bind(this, "code-block")}>
            Code
          </button>
          <Editor
            editorState={editorState}
            onChange={this.onChange}
            stripPastedStyles={false}
          />
        </SentryBoundary>
        <details>
          <summary>
            <span className="link">Debug</span>
          </summary>
          <ul className="list-inline">
            <li>
              <span>Version: 0</span>
            </li>
          </ul>
          <Highlight
            language="js"
            value={JSON.stringify(
              convertToRaw(editorState.getCurrentContent()),
              null,
              2,
            )}
          />
        </details>
      </div>
    )
  }
}

export default TestEditor
