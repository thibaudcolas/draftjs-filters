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
  convertFromRaw,
} from "draft-js"
import type { DraftBlockType } from "draft-js/lib/DraftBlockType.js.flow"
import type { DraftEntityType } from "draft-js/lib/DraftEntityType.js.flow"

import { filterEditorState } from "../../lib/index"

import SentryBoundary from "./SentryBoundary"
import Highlight from "./Highlight"
import Link, { linkStrategy } from "./Link"
import Image from "./Image"

import "./FilterableEditor.css"

const BLOCKS = {
  unstyled: "P",
  "unordered-list-item": "UL",
  "header-one": "H1",
  "header-two": "H2",
  "header-three": "H3",
}

const BLOCKS_EXTENDED = {
  unstyled: "P",
  "unordered-list-item": "UL",
  "ordered-list-item": "OL",
  "header-one": "H1",
  "header-two": "H2",
  "header-three": "H3",
  "header-four": "H4",
  "header-five": "H5",
  "header-six": "H6",
  blockquote: "❝",
  "code-block": "{ }",
}

const STYLES = {
  BOLD: "B",
  ITALIC: "I",
}

const STYLES_EXTENDED = {
  BOLD: "B",
  ITALIC: "I",
  CODE: "`",
  STRIKETHROUGH: "~",
  UNDERLINE: "_",
}

const ENTITIES = [
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

const MAX_NESTING = 1

const MAX_NESTING_EXTENDED = 4

type Props = {
  filtered: boolean,
  extended: boolean,
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
    const { extended } = props

    const decorator = new CompositeDecorator([
      {
        strategy: linkStrategy,
        component: Link,
      },
    ])

    const save = window.sessionStorage.getItem("extended")
    let editorState

    if (extended && save) {
      const content = convertFromRaw(JSON.parse(save))
      // $FlowFixMe
      editorState = EditorState.createWithContent(content, decorator)
    } else {
      // $FlowFixMe
      editorState = EditorState.createEmpty(decorator)
    }

    this.state = {
      editorState: editorState,
    }
    ;(this: any).onChange = this.onChange.bind(this)
    ;(this: any).onTab = this.onTab.bind(this)
    ;(this: any).toggleStyle = this.toggleStyle.bind(this)
    ;(this: any).toggleBlock = this.toggleBlock.bind(this)
    ;(this: any).toggleEntity = this.toggleEntity.bind(this)
    ;(this: any).blockRenderer = this.blockRenderer.bind(this)
  }

  onChange(editorState: EditorState) {
    const { filtered, extended } = this.props
    let nextState = editorState

    if (filtered) {
      const shouldFilterPaste =
        nextState.getLastChangeType() === "insert-fragment"

      if (shouldFilterPaste) {
        const filters = {
          blocks: Object.keys(extended ? BLOCKS_EXTENDED : BLOCKS),
          styles: Object.keys(extended ? STYLES_EXTENDED : STYLES),
          entities: ENTITIES,
          maxNesting: extended ? MAX_NESTING_EXTENDED : MAX_NESTING,
          whitespacedCharacters: ["\n", "\t", "📷"],
        }

        nextState = filterEditorState(filters, nextState)
      }
    }

    this.setState({ editorState: nextState })

    window.sessionStorage.setItem(
      `content`,
      JSON.stringify(convertToRaw(nextState.getCurrentContent())),
    )
  }

  toggleStyle(type: string, e: Event) {
    const { editorState } = this.state
    this.onChange(RichUtils.toggleInlineStyle(editorState, type))

    e.preventDefault()
  }

  toggleBlock(type: DraftBlockType, e: Event) {
    const { editorState } = this.state
    this.onChange(RichUtils.toggleBlockType(editorState, type))

    e.preventDefault()
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

  onTab(event: SyntheticKeyboardEvent<>) {
    const { extended } = this.props
    const { editorState } = this.state
    const maxNesting = extended ? MAX_NESTING_EXTENDED : MAX_NESTING
    const newState = RichUtils.onTab(event, editorState, maxNesting)

    this.onChange(newState)
  }

  render() {
    const { extended } = this.props
    const { editorState } = this.state
    const styles = extended ? STYLES_EXTENDED : STYLES
    const blocks = extended ? BLOCKS_EXTENDED : BLOCKS

    return (
      <div className="FilterableEditor">
        <SentryBoundary>
          <div className="EditorToolbar">
            {Object.keys(styles).map((type) => (
              <button
                key={type}
                onMouseDown={this.toggleStyle.bind(this, type)}
              >
                {STYLES_EXTENDED[type]}
              </button>
            ))}
            {Object.keys(blocks).map((type) => (
              <button
                key={type}
                onMouseDown={this.toggleBlock.bind(this, type)}
              >
                {BLOCKS_EXTENDED[type]}
              </button>
            ))}
            {ENTITIES.map((type) => (
              <button
                key={type.type}
                onMouseDown={this.toggleEntity.bind(this, type.type)}
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
            onTab={this.onTab}
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
