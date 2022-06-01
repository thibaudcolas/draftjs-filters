import { ContentState, ContentBlock } from "draft-js"
import { ReactNode } from "react"

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

interface LinkProps {
  contentState: ContentState
  entityKey: string
  children: ReactNode
}

const Link = ({ contentState, entityKey, children }: LinkProps) => {
  const entity = contentState.getEntity(entityKey)
  return (
    <span className="link" title={entity.getData().url}>
      {children}
    </span>
  )
}

export default Link
