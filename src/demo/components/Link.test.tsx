import { describe, it, expect, vi } from "vitest"
import { render } from "@testing-library/react"
import {
  EditorState,
  ContentState,
  convertFromHTML,
  convertFromRaw,
} from "draft-js"

import Link, { linkStrategy } from "./Link"

describe("Link", () => {
  it("renders", () => {
    const contentState = convertFromRaw({
      entityMap: {
        0: {
          type: "LINK",
          mutability: "MUTABLE",
          data: {
            url: "www.example.com",
          },
        },
      },
      blocks: [
        {
          key: "6i47q",
          text: "NA link doc",
          type: "unstyled",
          depth: 0,
          inlineStyleRanges: [],
          entityRanges: [
            {
              offset: 3,
              length: 4,
              key: 0,
            },
          ],
          data: {},
        },
      ],
    })
    const entityKey = contentState.getFirstBlock().getEntityAt(3)

    const { asFragment } = render(
      <Link contentState={contentState} entityKey={entityKey}>
        Test
      </Link>,
    )
    expect(asFragment()).toMatchInlineSnapshot(`
      <DocumentFragment>
        <span
          class="link"
          title="www.example.com"
        >
          Test
        </span>
      </DocumentFragment>
    `)
  })
})

describe("linkStrategy", () => {
  it("works", () => {
    const editorState = EditorState.createWithContent(
      ContentState.createFromBlockArray(
        convertFromHTML(`<h1><a href="http://example.com/">Test</a></h1>`)
          .contentBlocks,
      ),
    )
    const currentContent = editorState.getCurrentContent()
    const callback = vi.fn()
    linkStrategy(currentContent.getFirstBlock(), callback, currentContent)
    expect(callback).toHaveBeenCalled()
  })
})
