// @flow
import React from "react"
import type { Node } from "react"

type Props = {
  contentState: Object,
  entityKey: string,
  children: Node,
}

export const linkStrategy = (
  contentBlock: Object,
  callback: Function,
  contentState: Object,
) => {
  contentBlock.findEntityRanges((character) => {
    const entityKey = character.getEntity()
    return (
      entityKey !== null &&
      // $FlowFixMe
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
