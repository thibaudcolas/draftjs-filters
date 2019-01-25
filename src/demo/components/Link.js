// @flow
import React from "react"
import type { Node } from "react"
import { ContentState } from "draft-js"
import type { ContentBlock } from "draft-js"

type Props = {
  contentState: ContentState,
  entityKey: string,
  children: Node,
}

export const linkStrategy = (
  contentBlock: ContentBlock,
  callback: (start: number, end: number) => void,
  contentState: ContentState,
) => {
  contentBlock.findEntityRanges((character) => {
    const entityKey = character.getEntity()
    return (
      entityKey !== null &&
      contentState.getEntity(entityKey).getType() === "LINK"
    )
  }, callback)
}

const Link = ({ contentState, entityKey, children }: Props) => {
  const entity = contentState.getEntity(entityKey)
  return (
    <span className="link" title={entity.getData().url}>
      {children}
    </span>
  )
}

export default Link
