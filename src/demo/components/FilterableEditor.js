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
import type { DraftEntityType } from "draft-js/lib/DraftEntityType.js.flow"

import { filterEditorState } from "../../lib/index"

import SentryBoundary from "./SentryBoundary"
import Highlight from "./Highlight"
import Link, { linkStrategy } from "./Link"

import "./FilterableEditor.css"

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

const ENTITY_TYPES = [
  {
    type: "LINK",
    label: "🔗",
    attributes: ["url"],
    whitelist: {
      href: "example",
    },
  },
]

const FILTER_CONFIG = {
  maxNesting: 1,
  blocks: Object.keys(BLOCK_TYPES),
  styles: Object.keys(INLINE_STYLES),
  entityTypes: ENTITY_TYPES,
  blockEntities: [],
  whitespacedCharacters: ["\n", "\t"],
}

type Props = {
  filtered: boolean,
}

type State = {
  editorState: EditorState,
}

/**
 * Demo editor, which can be configured to filter content on paste.
 */
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
    ;(this: any).toggleEntity = this.toggleEntity.bind(this)
  }

  onChange(nextEditorState: EditorState) {
    const { filtered } = this.props
    let nextState = nextEditorState

    if (filtered) {
      const { editorState } = this.state
      const content = editorState.getCurrentContent()
      const shouldFilterPaste =
        nextState.getCurrentContent() !== content &&
        nextState.getLastChangeType() === "insert-fragment"

      if (shouldFilterPaste) {
        nextState = filterEditorState(FILTER_CONFIG, nextState)
      }
    }

    this.setState({ editorState: nextState })

    sessionStorage.setItem(
      `content`,
      JSON.stringify(convertToRaw(nextState.getCurrentContent())),
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

  toggleEntity(type: DraftEntityType) {
    const { editorState } = this.state
    let content = editorState.getCurrentContent()
    const selection = editorState.getSelection()
    content = content.createEntity(type, "MUTABLE", {
      url: "http://www.example.com/",
    })
    const entityKey = content.getLastCreatedEntityKey()
    this.onChange(RichUtils.toggleLink(editorState, selection, entityKey))
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
            {ENTITY_TYPES.map((type) => (
              <button
                key={type.type}
                onClick={this.toggleEntity.bind(this, type.type)}
              >
                {type.label}
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
