import { EditorState } from "draft-js"
import type { DraftBlockType } from "draft-js/lib/DraftBlockType.js.flow"

import {
  ATOMIC,
  UNSTYLED,
  UNORDERED_LIST_ITEM,
  ORDERED_LIST_ITEM,
} from "../constants"

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
 * Removes blocks that have a non-zero depth, and aren't list items.
 * Happens with Apple Pages inserting `unstyled` items between list items.
 */
export const removeInvalidDepthBlocks = (editorState) => {
  const content = editorState.getCurrentContent()
  const blockMap = content.getBlockMap()

  const isValidDepthBlock = (block) => {
    const isListBlock = [UNORDERED_LIST_ITEM, ORDERED_LIST_ITEM].includes(
      block.getType(),
    )

    return isListBlock || block.getDepth() === 0
  }

  const filteredBlocks = blockMap.filter(isValidDepthBlock)

  if (filteredBlocks.size !== blockMap.size) {
    return EditorState.set(editorState, {
      currentContent: content.merge({
        blockMap: filteredBlocks,
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
