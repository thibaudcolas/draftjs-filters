// @flow
import { EditorState } from "draft-js"
import type { DraftBlockType } from "draft-js/lib/DraftBlockType.js.flow"

import { ATOMIC, UNSTYLED } from "../constants"
import {
  preserveAtomicBlocks,
  resetAtomicBlocks,
  removeInvalidAtomicBlocks,
} from "./atomic"
import {
  limitBlockDepth,
  filterBlockTypes,
  removeInvalidDepthBlocks,
} from "./blocks"
import { filterInlineStyles } from "./styles"
import {
  filterEntityData,
  filterEntityRanges,
  shouldKeepEntityType,
  shouldRemoveImageEntity,
  shouldKeepEntityByAttribute,
} from "./entities"
import { replaceTextBySpaces } from "./text"

type FilterOptions = {
  // Whitelist of allowed block types. unstyled and atomic are always included.
  blocks: Array<DraftBlockType>,
  // Whitelist of allowed inline styles.
  styles: Array<string>,
  // Whitelist of allowed entities.
  entities: Array<{
    // Entity type, eg. "LINK"
    type: string,
    // Allowed attributes. Other attributes will be removed.
    attributes: Array<string>,
    // Refine which entities are kept by whitelisting acceptable values with regular expression patterns.
    whitelist: Object,
  }>,
  // Maximum amount of depth for lists (0 = no nesting).
  maxNesting: number,
  // Characters to replace with whitespace.
  whitespacedCharacters: Array<string>,
}

/**
 * Applies whitelist and blacklist operations to the editor content,
 * to enforce it's shaped according to the options.
 */
export const filterEditorState = (
  {
    blocks,
    styles,
    entities,
    maxNesting,
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
    // 1. clean up blocks.
    removeInvalidDepthBlocks,
    limitBlockDepth.bind(null, maxNesting),
    // 2. reset styles and blocks.
    filterInlineStyles.bind(null, styles),
    // Add block types that are always enabled in Draft.js.
    filterBlockTypes.bind(null, blocks.concat([UNSTYLED, ATOMIC])),
    // 4. Process atomic blocks.
    preserveAtomicBlocks,
    resetAtomicBlocks,
    // 5. Remove entity ranges (and linked entities)
    filterEntityRanges.bind(null, shouldKeepEntityRange),
    // 6. Remove/filter entity-related matters.
    removeInvalidAtomicBlocks.bind(null, entities),
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
