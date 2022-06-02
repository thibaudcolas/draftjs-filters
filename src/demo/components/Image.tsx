import { ContentBlock, ContentState } from "draft-js"

interface ImageProps {
  block: ContentBlock
  contentState: ContentState
}

const Image = ({ block, contentState }: ImageProps) => {
  const entityKey = block.getEntityAt(0)
  const src = entityKey
    ? contentState.getEntity(entityKey).getData().src
    : "404.svg"

  return <img src={src} alt="" width="256" />
}

export default Image
