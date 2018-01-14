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
  filterEntityAttributes,
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
  entityTypes: EntityTypes,
  blockEntities: Array<string>,
  whitespacedCharacters: Array<string>,
}

/**
 * Applies whitelist and blacklist operations to the editor content,
 * so the resulting editor state is shaped according to Draftail
 * expectations and configuration.
 * As of now, this doesn't filter line breaks if they aren't disabled
 * as Draft.js does not preserve this type of whitespace on paste anyway.
 */
export const filterEditorState = (
  {
    maxNesting,
    blocks,
    styles,
    entityTypes,
    blockEntities,
    whitespacedCharacters,
  }: FilterOptions,
  editorState: EditorState,
) => {
  const enabledBlockTypes = blocks.concat([
    // Always enabled in a Draftail editor.
    UNSTYLED,
    // Filtered depending on enabled entity types.
    ATOMIC,
  ])
  let enabledEntityTypes = entityTypes.map((t) => t.type)

  const shouldKeepEntityRange = (content, entityKey, block) => {
    const entity = content.getEntity(entityKey)
    const entityData = entity.getData()
    const entityType = entity.getType()
    const blockType = block.getType()

    return (
      shouldKeepEntityType(enabledEntityTypes, entityType) &&
      shouldKeepEntityByAttribute(entityTypes, entityType, entityData) &&
      !shouldRemoveImageEntity(entityType, blockType)
    )
  }

  const filters = [
    preserveAtomicBlocks.bind(null, blockEntities),
    removeInvalidDepthBlocks,
    limitBlockDepth.bind(null, maxNesting),
    filterBlockTypes.bind(null, enabledBlockTypes),
    filterInlineStyles.bind(null, styles),
    // TODO Bug: should not keep atomic blocks if there is no entity.
    filterAtomicBlocks.bind(null, enabledEntityTypes),
    filterEntityRanges.bind(null, shouldKeepEntityRange),
    filterEntityAttributes.bind(null, entityTypes),
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
