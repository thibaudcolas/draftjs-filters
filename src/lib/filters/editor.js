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

/**
 * Helper functions to filter/whitelist specific formatting.
 * Meant to be used when pasting unconstrained content.
 */

/**
 * Applies whitelist and blacklist operations to the editor content,
 * so the resulting editor state is shaped according to Draftail
 * expectations and configuration.
 * As of now, this doesn't filter line breaks if they aren't disabled
 * as Draft.js does not preserve this type of whitespace on paste anyway.
 */
export const filterEditorState = ({
  editorState,
  maxListNesting,
  enableHorizontalRule,
  enableLineBreak,
  blockTypes,
  inlineStyles,
  entityTypes,
}: {
  editorState: EditorState,
  maxListNesting: number,
  enableHorizontalRule: boolean,
  enableLineBreak: boolean,
  blockTypes: Array<DraftBlockType>,
  inlineStyles: Array<string>,
  entityTypes: EntityTypes,
}) => {
  let nextEditorState = editorState
  const enabledBlockTypes = blockTypes.concat([
    // Always enabled in a Draftail editor.
    UNSTYLED,
    // Filtered depending on enabled entity types.
    ATOMIC,
  ])
  let enabledEntityTypes = entityTypes.map((t) => t.type)

  if (enableHorizontalRule) {
    enabledEntityTypes.push(HORIZONTAL_RULE)
  }

  // At the moment the list is hard-coded. In the future, the idea
  // would be to have separate config for block entities and inline entities.
  nextEditorState = preserveAtomicBlocks(nextEditorState, [
    HORIZONTAL_RULE,
    IMAGE,
  ])
  nextEditorState = removeInvalidDepthBlocks(nextEditorState)
  nextEditorState = resetBlockDepth(nextEditorState, maxListNesting)
  nextEditorState = resetBlockType(nextEditorState, enabledBlockTypes)
  nextEditorState = filterInlineStyle(nextEditorState, inlineStyles)
  // TODO Bug: should not keep atomic blocks if there is no entity.
  nextEditorState = resetAtomicBlocks(nextEditorState, enabledEntityTypes)
  nextEditorState = filterEntityRanges(
    nextEditorState,
    (content, entityKey, block) => {
      const entity = content.getEntity(entityKey)
      const entityData = entity.getData()
      const entityType = entity.getType()
      const blockType = block.getType()
      return (
        shouldKeepEntityType(enabledEntityTypes, entityType) &&
        shouldKeepEntityByAttribute(entityTypes, entityType, entityData) &&
        !shouldRemoveImageEntity(entityType, blockType)
      )
    },
  )
  let nextContent = nextEditorState.getCurrentContent()

  const filteredCharacters = ["\t"]

  if (!enableLineBreak) {
    filteredCharacters.push("\n")
  }

  nextContent = filterEntityAttributes(entityTypes, nextContent)
  nextContent = whitespaceCharacters(filteredCharacters, nextContent)

  nextEditorState = EditorState.set(nextEditorState, {
    currentContent: nextContent,
  })

  return nextEditorState
}
