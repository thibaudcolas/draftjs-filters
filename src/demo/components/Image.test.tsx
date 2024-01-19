import { describe, it, expect } from "vitest"
import { render } from "@testing-library/react"
import { convertFromRaw } from "draft-js"

import Image from "./Image"

describe("Image", () => {
  it("renders", () => {
    const content = convertFromRaw({
      entityMap: {
        0: {
          type: "IMAGE",
          mutability: "IMMUTABLE",
          data: {
            src: "/example.png",
          },
        },
      },
      blocks: [
        {
          key: "a",
          text: " ",
          type: "atomic",
          depth: 0,
          inlineStyleRanges: [],
          entityRanges: [
            {
              offset: 0,
              length: 1,
              key: 0,
            },
          ],
        },
      ],
    })

    const { asFragment } = render(
      <Image contentState={content} block={content.getFirstBlock()} />,
    )
    expect(asFragment()).toMatchInlineSnapshot(`
      <DocumentFragment>
        <img
          alt=""
          src="/example.png"
          width="256"
        />
      </DocumentFragment>
    `)
  })

  it("no entity", () => {
    const content = convertFromRaw({
      entityMap: {},
      blocks: [
        {
          key: "a",
          text: " ",
          type: "atomic",
          depth: 0,
          inlineStyleRanges: [],
          entityRanges: [],
        },
      ],
    })

    const { asFragment } = render(
      <Image contentState={content} block={content.getFirstBlock()} />,
    )
    expect(asFragment()).toMatchInlineSnapshot(`
      <DocumentFragment>
        <img
          alt=""
          src="404.svg"
          width="256"
        />
      </DocumentFragment>
    `)
  })
})
