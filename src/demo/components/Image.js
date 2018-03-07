// @flow
import React from "react"
import { ContentBlock, ContentState } from "draft-js"

const Image = ({
  block,
  contentState,
}: {
  block: ContentBlock,
  contentState: ContentState,
}) => {
  const entityKey = block.getEntityAt(0)
  const src = entityKey
    ? contentState.getEntity(entityKey).getData().src
    : "404.svg"

  return <img src={src} alt="" width="256" />
}

export default Image
