// @flow
import { EditorState } from "draft-js"
import type { DraftBlockType } from "draft-js/lib/DraftBlockType.js.flow"

import { ATOMIC, UNSTYLED } from "../constants"
import {
  preserveAtomicBlocks,
  limitBlockDepth,
  filterBlockTypes,
  removeInvalidDepthBlocks,
} from "./blocks"
import { filterInlineStyles } from "./styles"
import {
  filterAtomicBlocks,
  filterEntityData,
  filterEntityRanges,
  shouldKeepEntityType,
  shouldRemoveImageEntity,
  shouldKeepEntityByAttribute,
} from "./entities"
import { replaceTextBySpaces } from "./text"

type EntityTypes = Array<Object>

type FilterOptions = {
  maxNesting: number,
  blocks: Array<DraftBlockType>,
  styles: Array<string>,
  entities: EntityTypes,
  blockEntities: Array<string>,
  whitespacedCharacters: Array<string>,
}

/**
 * Applies whitelist and blacklist operations to the editor content,
 * to enforce it's shaped according to the options.
 */
export const filterEditorState = (
  {
    maxNesting,
    blocks,
    styles,
    entities,
    blockEntities,
    whitespacedCharacters,
  }: FilterOptions,
  editorState: EditorState,
) => {
  const shouldKeepEntityRange = (content, entityKey, block) => {
    const entity = content.getEntity(entityKey)
    const entityData = entity.getData()
    const entityType = entity.getType()
    const blockType = block.getType()

    return (
      shouldKeepEntityType(entities, entityType) &&
      shouldKeepEntityByAttribute(entities, entityType, entityData) &&
      !shouldRemoveImageEntity(entityType, blockType)
    )
  }

  // Order matters. Some filters may need the information filtered out by others.
  const filters = [
    preserveAtomicBlocks.bind(null, blockEntities),
    removeInvalidDepthBlocks,
    limitBlockDepth.bind(null, maxNesting),
    // Add block types that are always enabled in Draft.js.
    filterBlockTypes.bind(null, blocks.concat([UNSTYLED, ATOMIC])),
    filterInlineStyles.bind(null, styles),
    // TODO Bug: should not keep atomic blocks if there is no entity.
    filterAtomicBlocks.bind(null, entities),
    filterEntityRanges.bind(null, shouldKeepEntityRange),
    filterEntityData.bind(null, entities),
    replaceTextBySpaces.bind(null, whitespacedCharacters),
  ]

  const content = editorState.getCurrentContent()
  const nextContent = filters.reduce((c, filter) => filter(c), content)

  return nextContent === content
    ? editorState
    : EditorState.set(editorState, {
        currentContent: nextContent,
      })
}
