// @flow
import { EditorState } from "draft-js"
import type { DraftBlockType } from "draft-js/lib/DraftBlockType.js.flow"

import { ATOMIC, UNSTYLED, IMAGE, HORIZONTAL_RULE } from "../constants"
import {
  preserveAtomicBlocks,
  resetBlockDepth,
  resetBlockType,
  removeInvalidDepthBlocks,
} from "./blocks"
import { filterInlineStyle } from "./styles"
import {
  resetAtomicBlocks,
  filterEntityAttributes,
  filterEntityRanges,
  shouldKeepEntityType,
  shouldRemoveImageEntity,
  shouldKeepEntityByAttribute,
} from "./entities"
import { whitespaceCharacters } from "./text"

type EntityTypes = Array<Object>

type FilterOptions = {
  maxListNesting: number,
  enableLineBreak: boolean,
  blockTypes: Array<DraftBlockType>,
  inlineStyles: Array<string>,
  entityTypes: EntityTypes,
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
    maxListNesting,
    enableLineBreak,
    blockTypes,
    inlineStyles,
    entityTypes,
  }: FilterOptions,
  editorState: EditorState,
) => {
  const enabledBlockTypes = blockTypes.concat([
    // Always enabled in a Draftail editor.
    UNSTYLED,
    // Filtered depending on enabled entity types.
    ATOMIC,
  ])
  let enabledEntityTypes = entityTypes.map((t) => t.type)

  const filteredCharacters = ["\t"]

  if (!enableLineBreak) {
    filteredCharacters.push("\n")
  }

  const filterEntities = (content, entityKey, block) => {
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

  const content = editorState.getCurrentContent()
  let nextContent = content
  // At the moment the list is hard-coded. In the future, the idea
  // would be to have separate config for block entities and inline entities.
  nextContent = preserveAtomicBlocks([HORIZONTAL_RULE, IMAGE], nextContent)
  nextContent = removeInvalidDepthBlocks(nextContent)
  nextContent = resetBlockDepth(maxListNesting, nextContent)
  nextContent = resetBlockType(enabledBlockTypes, nextContent)
  nextContent = filterInlineStyle(inlineStyles, nextContent)
  // TODO Bug: should not keep atomic blocks if there is no entity.
  nextContent = resetAtomicBlocks(enabledEntityTypes, nextContent)
  nextContent = filterEntityRanges(filterEntities, nextContent)
  nextContent = filterEntityAttributes(entityTypes, nextContent)
  nextContent = whitespaceCharacters(filteredCharacters, nextContent)

  return nextContent === content
    ? editorState
    : EditorState.set(editorState, {
        currentContent: nextContent,
      })
}
