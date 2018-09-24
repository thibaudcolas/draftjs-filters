# Draft.js filters documentation

## Filtering gotchas

Sometimes, the filters may convert content in an unexpected way. Here is a list of the known trade-offs:

- Empty image lists (`text: '📷 '`) are not converted to empty unordered list items. This is because there is no way to distinguish between them and potential images that happen to have a space next to them.
- Using iOS, all pasted list items are converted to `unordered-list-item`. This is because iOS uses this same prefix regardless of the list type.
- In Word, and for plain-text editors,
  - List items of nesting greater than 2 get reset to depth 0/1/2. This is because those editors reuse the same list item prefixes every 3 depth levels. It's impossible to preserve the real nesting level above depth 2.
  - Numbered lists are only converted to `ordered-list-item` for items 1. to 19. (depth 0), I. to XX. (depth 2), a. to z. (depth 1). This is to reduce the risk of removing text that looks like a list item prefix.
  - A depth 1 `i.` list item will be converted to a depth 2 list item, because of the clash with the lowercase `I.` roman numeral prefix.
