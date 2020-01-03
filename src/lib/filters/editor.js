// @flow
import { ATOMIC, UNSTYLED } from "../constants"
import {
  preserveAtomicBlocks,
  resetAtomicBlocks,
  removeInvalidAtomicBlocks,
} from "./atomic"
import {
  limitBlockDepth,
  preserveBlockByText,
  filterBlockTypes,
  removeInvalidDepthBlocks,
} from "./blocks"
import { filterInlineStyles } from "./styles"
import {
  cloneEntities,
  filterEntityData,
  filterEntityRanges,
  shouldKeepEntityType,
  shouldRemoveImageEntity,
  shouldKeepEntityByAttribute,
} from "./entities"
import { replaceTextBySpaces } from "./text"
import { applyContentWithSelection } from "./selection"

import { ContentState } from "draft-js"
import type { EditorState as EditorStateType } from "draft-js"

type FilterOptions = {
  // Whitelist of allowed block types. unstyled and atomic are always included.
  blocks: $ReadOnlyArray<string>,
  // Whitelist of allowed inline styles.
  styles: $ReadOnlyArray<string>,
  // Whitelist of allowed entities.
  entities: $ReadOnlyArray<{
    // Entity type, eg. "LINK"
    type: string,
    // Allowed attributes. Other attributes will be removed. If this is omitted, all attributes are kept.
    attributes?: $ReadOnlyArray<string>,
    // Refine which entities are kept by whitelisting acceptable values with regular expression patterns.
    // It's also possible to use "true" to signify that a field is required to be present,
    // and "false" for fields required to be absent.
    // If this is omitted, all entities are kept.
    whitelist?: {
      [attribute: string]: string | boolean,
    },
  }>,
  // Maximum amount of depth for lists (0 = no nesting).
  maxNesting: number,
  // Characters to replace with whitespace.
  whitespacedCharacters: Array<string>,
  // Optional: Rules used to automatically convert blocks from one type to another
  // based on the block’s text. Also supports setting the block depth.
  // Defaults to the filters’ built-in block prefix rules.
  blockTextRules?: $ReadOnlyArray<{
    // A regex as a string, to match against block text, e.g. "^(◦|o |o\t)".
    test: string,
    // The type to convert the block to if the test regex matches.
    type: string,
    // The depth to set (e.g. for list items with different prefixes per depth).
    depth: number,
  }>,
}

const BLOCK_PREFIX_RULES = [
  {
    // https://regexper.com/#%5E(%C2%B7%20%7C%E2%80%A2%5Ct%7C%E2%80%A2%7C%F0%9F%93%B7%20%7C%5Ct%7C%20%5Ct)
    test: "^(· |•\t|•|📷 |\t| \t)",
    type: "unordered-list-item",
    depth: 0,
  },
  // https://regexper.com/#%5E(%E2%97%A6%7Co%20%7Co%5Ct)
  { test: "^(◦|o |o\t)", type: "unordered-list-item", depth: 1 },
  // https://regexper.com/#%5E(%C2%A7%20%7C%EF%82%A7%5Ct%7C%E2%97%BE)
  { test: "^(§ |\t|◾)", type: "unordered-list-item", depth: 2 },
  {
    // https://regexper.com/#%5E1%7B0%2C1%7D%5Cd%5C.%5B%20%5Ct%5D
    test: "^1{0,1}\\d\\.[ \t]",
    type: "ordered-list-item",
    depth: 0,
  },
  {
    // Roman numerals from I to XX.
    // https://regexper.com/#%5Ex%7B0%2C1%7D(i%7Cii%7Ciii%7Civ%7Cv%7Cvi%7Cvii%7Cviii%7Cix%7Cx)%5C.%5B%20%5Ct%5D
    test: "^x{0,1}(i|ii|iii|iv|v|vi|vii|viii|ix|x)\\.[ \t]",
    type: "ordered-list-item",
    depth: 2,
  },
  {
    // There is a clash between this and the i., v., x. roman numerals.
    // Those tests are executed in order though, so the roman numerals take priority.
    // We do not want to match too many letters (say aa.), because those could be actual text.
    // https://regexper.com/#%5E%5Ba-z%5D%5C.%5B%20%5Ct%5D
    test: "^[a-z]\\.[ \t]",
    type: "ordered-list-item",
    depth: 1,
  },
]

/**
 * Applies whitelist and blacklist operations to the editor content,
 * to enforce it's shaped according to the options.
 * Will not alter the editor state if there are no changes to make.
 */
export const filterEditorState = (
  options: FilterOptions,
  editorState: EditorStateType,
) => {
  const {
    blocks,
    styles,
    entities,
    maxNesting,
    whitespacedCharacters,
    blockTextRules = BLOCK_PREFIX_RULES,
  } = options
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
    preserveBlockByText.bind(null, blockTextRules),
    limitBlockDepth.bind(null, maxNesting),
    // 2. reset styles and blocks.
    filterInlineStyles.bind(null, styles),
    // Add block types that are always enabled in Draft.js.
    filterBlockTypes.bind(null, blocks.concat([UNSTYLED, ATOMIC])),
    // 4. Process atomic blocks before processing entities.
    preserveAtomicBlocks,
    resetAtomicBlocks,
    // 5. Remove entity ranges (and linked entities)
    filterEntityRanges.bind(null, shouldKeepEntityRange),
    // 6. Remove/filter entity-related matters.
    removeInvalidAtomicBlocks.bind(null, entities),
    filterEntityData.bind(null, entities),
    // 7. Clone entities for which it is necessary.
    cloneEntities,
    // 8. Finally, do text operations.
    replaceTextBySpaces.bind(null, whitespacedCharacters),
  ]

  const content = editorState.getCurrentContent()
  const nextContent = filters.reduce(
    (c, filter: (ContentState) => ContentState) => filter(c),
    content,
  )

  return applyContentWithSelection(editorState, content, nextContent)
}
