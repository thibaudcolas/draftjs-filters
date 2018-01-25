// @flow
import React, { Component } from "react"
import {
  Editor,
  EditorState,
  RichUtils,
  convertToRaw,
  CompositeDecorator,
  AtomicBlockUtils,
  ContentBlock,
} from "draft-js"
import type { DraftBlockType } from "draft-js/lib/DraftBlockType.js.flow"
import type { DraftEntityType } from "draft-js/lib/DraftEntityType.js.flow"

import { filterEditorState } from "../../lib/index"

import SentryBoundary from "./SentryBoundary"
import Highlight from "./Highlight"
import Link, { linkStrategy } from "./Link"
import Image from "./Image"

import "./FilterableEditor.css"

const BLOCK_TYPES = {
  unstyled: "P",
  "header-one": "H1",
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
      href: "^(http:|https:|undefined$)",
    },
  },
  {
    type: "IMAGE",
    label: "📷",
    attributes: ["src"],
    whitelist: {
      src: "^http",
    },
  },
]

const FILTER_CONFIG = {
  blocks: Object.keys(BLOCK_TYPES),
  styles: Object.keys(INLINE_STYLES),
  entities: ENTITY_TYPES,
  maxNesting: 1,
  whitespacedCharacters: ["\n", "\t", "📷"],
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
    ;(this: any).blockRenderer = this.blockRenderer.bind(this)
  }

  onChange(editorState: EditorState) {
    const { filtered } = this.props
    let nextState = editorState

    if (filtered) {
      const shouldFilterPaste =
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

    if (type === "IMAGE") {
      content = content.createEntity(type, "IMMUTABLE", {
        src:
          "https://thibaudcolas.github.io/draftjs-filters/word-toolbars-overload.jpg",
      })
      const entityKey = content.getLastCreatedEntityKey()
      this.onChange(
        AtomicBlockUtils.insertAtomicBlock(editorState, entityKey, " "),
      )
    } else {
      content = content.createEntity(type, "MUTABLE", {
        url: "http://www.example.com/",
      })
      const entityKey = content.getLastCreatedEntityKey()
      const selection = editorState.getSelection()
      this.onChange(RichUtils.toggleLink(editorState, selection, entityKey))
    }
  }

  blockRenderer(block: ContentBlock) {
    if (block.getType() !== "atomic") {
      return null
    }

    return {
      component: Image,
      editable: false,
    }
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
            blockRendererFn={this.blockRenderer}
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
