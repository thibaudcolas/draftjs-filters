// @flow
import React, { Component } from "react"
import { Editor, EditorState, RichUtils, convertToRaw } from "draft-js"
import type { DraftBlockType } from "draft-js/lib/DraftBlockType.js.flow"

import SentryBoundary from "./SentryBoundary"
import Highlight from "./Highlight"

import "./TestEditor.css"

type Props = {}

type State = {
  editorState: EditorState,
}

class TestEditor extends Component<Props, State> {
  constructor(props: Props) {
    super(props)

    this.state = {
      editorState: EditorState.createEmpty(),
    }
    ;(this: any).onChange = this.onChange.bind(this)
    ;(this: any).toggleBlock = this.toggleBlock.bind(this)
  }

  onChange(editorState: EditorState) {
    const content = editorState.getCurrentContent()
    const rawContent = convertToRaw(content)

    this.setState({ editorState })

    sessionStorage.setItem(`content`, JSON.stringify(rawContent))
  }

  toggleBlock(type: DraftBlockType) {
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
