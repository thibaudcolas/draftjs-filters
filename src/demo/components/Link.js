// @flow
import React from "react"
import type { Node } from "react"

type Props = {
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

const Link = ({ children }: Props) => {
  return <span className="link">{children}</span>
}

export default Link
