// @flow
import React, { Component } from "react"
import {
  Editor,
  EditorState,
  RichUtils,
  convertToRaw,
  CompositeDecorator,
} from "draft-js"
import type { DraftBlockType } from "draft-js/lib/DraftBlockType.js.flow"

import { filterEditorState } from "../../lib/index"

import SentryBoundary from "./SentryBoundary"
import Highlight from "./Highlight"
import Link, { linkStrategy } from "./Link"

import "./FilterableEditor.css"

type Props = {
  filtered: boolean,
}

type State = {
  editorState: EditorState,
}

const BLOCK_TYPES = {
  unstyled: "P",
  "header-two": "H2",
  "header-three": "H3",
  "unordered-list-item": "UL",
}

const INLINE_STYLES = {
  BOLD: "B",
  ITALIC: "I",
}

class FilterableEditor extends Component<Props, State> {
  constructor(props: Props) {
    super(props)

    const decorator = new CompositeDecorator([
      {
        strategy: linkStrategy,
        component: Link,
      },
    ])

    this.state = {
      // $FlowFixMe
      editorState: EditorState.createEmpty(decorator),
    }
    ;(this: any).onChange = this.onChange.bind(this)
    ;(this: any).toggleStyle = this.toggleStyle.bind(this)
    ;(this: any).toggleBlock = this.toggleBlock.bind(this)
  }

  onChange(nextEditorState: EditorState) {
    const { filtered } = this.props
    let nextState = nextEditorState

    if (filtered) {
      const { editorState } = this.state
      const content = editorState.getCurrentContent()
      const shouldFilterPaste =
        nextEditorState.getCurrentContent() !== content &&
        nextEditorState.getLastChangeType() === "insert-fragment"

      if (shouldFilterPaste) {
        nextState = filterEditorState(
          nextEditorState,
          1,
          false,
          Object.keys(BLOCK_TYPES),
          Object.keys(INLINE_STYLES),
          [],
        )
      }
    }

    this.setState({ editorState: nextState })

    sessionStorage.setItem(
      `content`,
      JSON.stringify(convertToRaw(nextEditorState.getCurrentContent())),
    )
  }

  toggleStyle(type: string) {
    const { editorState } = this.state
    this.onChange(RichUtils.toggleInlineStyle(editorState, type))
  }

  toggleBlock(type: DraftBlockType) {
    const { editorState } = this.state
    this.onChange(RichUtils.toggleBlockType(editorState, type))
  }

  render() {
    const { editorState } = this.state
    return (
      <div className="FilterableEditor">
        <SentryBoundary>
          <div className="EditorToolbar">
            {Object.keys(INLINE_STYLES).map((type) => (
              <button key={type} onClick={this.toggleStyle.bind(this, type)}>
                {INLINE_STYLES[type]}
              </button>
            ))}
            {Object.keys(BLOCK_TYPES).map((type) => (
              <button key={type} onClick={this.toggleBlock.bind(this, type)}>
                {BLOCK_TYPES[type]}
              </button>
            ))}
          </div>
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

export default FilterableEditor
