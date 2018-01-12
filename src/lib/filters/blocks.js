import { EditorState } from "draft-js"
import type { DraftBlockType } from "draft-js/lib/DraftBlockType.js.flow"

import { ATOMIC, UNSTYLED } from "../constants"

/**
 * Creates atomic blocks where they would be required for a block-level entity
 * to work correctly, when such an entity exists.
 * Note: at the moment, this is only useful for IMAGE entities that Draft.js
 * injects on arbitrary blocks on paste.
 */
export const preserveAtomicBlocks = (
  editorState: EditorState,
  entityTypes: Array<string>,
) => {
  const content = editorState.getCurrentContent()
  const blockMap = content.getBlockMap()

  const perservedBlocks = blockMap
    .filter((block) => {
      const entityKey = block.getEntityAt(0)

      return (
        entityKey &&
        entityTypes.includes(content.getEntity(entityKey).getType())
      )
    })
    .map((block) => block.set("type", ATOMIC))

  if (perservedBlocks.size !== 0) {
    return EditorState.set(editorState, {
      currentContent: content.merge({
        blockMap: blockMap.merge(perservedBlocks),
      }),
    })
  }

  return editorState
}

/**
 * Resets the depth of all the content to at most maxNesting.
 */
export const resetBlockDepth = (
  editorState: EditorState,
  maxNesting: number,
) => {
  const content = editorState.getCurrentContent()
  const blockMap = content.getBlockMap()

  const changedBlocks = blockMap
    .filter((block) => block.getDepth() > maxNesting)
    .map((block) => block.set("depth", maxNesting))

  if (changedBlocks.size !== 0) {
    return EditorState.set(editorState, {
      currentContent: content.merge({
        blockMap: blockMap.merge(changedBlocks),
      }),
    })
  }

  return editorState
}

/**
 * Resets all blocks that use unavailable types to unstyled.
 */
export const resetBlockType = (
  editorState: EditorState,
  enabledTypes: Array<DraftBlockType>,
) => {
  const content = editorState.getCurrentContent()
  const blockMap = content.getBlockMap()

  const changedBlocks = blockMap
    .filter((block) => !enabledTypes.includes(block.getType()))
    .map((block) => block.set("type", UNSTYLED))

  if (changedBlocks.size !== 0) {
    return EditorState.set(editorState, {
      currentContent: content.merge({
        blockMap: blockMap.merge(changedBlocks),
      }),
    })
  }

  return editorState
}
