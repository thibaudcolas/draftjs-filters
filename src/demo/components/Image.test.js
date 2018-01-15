import React from "react"
import { shallow } from "enzyme"
import { convertFromRaw } from "draft-js"

import Image from "./Image"

describe("Image", () => {
  it("renders", () => {
    const content = convertFromRaw({
      entityMap: {
        "0": {
          type: "IMAGE",
          data: {
            src: "/example.png",
          },
        },
      },
      blocks: [
        {
          key: "a",
          text: " ",
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

    expect(
      shallow(<Image contentState={content} block={content.getFirstBlock()} />),
    ).toMatchSnapshot()
  })

  it("no entity", () => {
    const content = convertFromRaw({
      entityMap: {},
      blocks: [
        {
          key: "a",
          text: " ",
        },
      ],
    })

    expect(
      shallow(<Image contentState={content} block={content.getFirstBlock()} />),
    ).toMatchSnapshot()
  })
})
