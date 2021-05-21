# Pasting analysis

## Overview

### Line breaks

- Apple Pages Firefox / Safari macOS 10.13 / Safari iOS11 inserts invalid character `"Soft line<?>break"`
- Dropbox Paper Safari iOS 11 `"Soft "`, `"line break"`
- Google Docs Safari iOS 11, Word Safari iOS 11 `"Soft"`, `"Line break"`
- Apple Pages Chrome 62 macOS 10.13 `"Soft line\n break"`
- Word Online Firefox 57, Safari 11, macOS 10.13 `"Soft \nline break "`
- Word 2010 IE11 `"Soft "`, `"line break"`.
- Word 2010 Chrome 62, Firefox 57 – Word 2016 Chrome 63, Firefox 57, Edge 16 `"Soft \n line break"`.
- Dropbox Paper all browsers `"Soft "`, `"line break"`.
- Dropbox Paper Safari 11 - contains different whitespace character than for other browsers.
- Dropbox Paper IE11 `stripPastedStyles`: `"Soft "`, `""`, `"line break"`.
- Google Docs all browsers `"Soft\nLine break"`.
- Google Docs IE11 `stripPastedStyles`: `"Soft"`, `"Line break"`

### List item prefixes

#### UL

Depth 0:

```js
// Word 2010 / Word 2016
"· "
// Word 2010, IE11 (plain text)
"•\t"
// Dropbox Paper, IE11 (plain text)
"•"
// Word Safari iOS11
"\t"
// Image list, Word 2010 / Word 2016
"📷 "
// Image list, Word 2010, IE11 (plain text)
" \t"
```

Depth 1:

```js
// Word 2010 / Word 2016
"o "
// Word 2010, IE11 (plain text)
"o\t"
// Dropbox Paper / Google Docs, IE11 (plain text)
"◦"
// Word Safari iOS11
"\t"
```

Depth 2:

```js
// Word 2010 / Word 2016
"§ "
// Word 2010, IE11 (plain text)
"\t"
// Dropbox Paper / Google Docs, IE11 (plain text)
"◾"
// Word Safari iOS11
"\t"
```

#### OL

Depth 0:

```js
// Word 2010 / Word 2016
"1. "
// Word 2010, IE11 (plain text)
"1.\t"
// Dropbox Paper / Google Docs, IE11 (plain text)
"1."
```

Depth 1:

```js
// Word 2010 / Word 2016
"a. "
// Word 2010, IE11 (plain text)
"a.\t"
// Dropbox Paper / Google Docs, IE11 (plain text)
"a."
```

Depth 2:

```js
// Word 2010 / Word 2016
"i. "
// Word 2010, IE11 (plain text)
"i.\t"
// Dropbox Paper / Google Docs, IE11 (plain text)
"i."
```

## By word processor

### Draft.js

> Pasting from Draft.js to Draft.js

#### Same editor

- All formatting is preserved as-is.
- [x] Entity ranges refer to the same entities multiple times.

#### Different editors

- [ ] Successive `unstyled` blocks are concatenated into a single block.
- [ ] `CODE` style is not preserved.
- [ ] `LINK` entities are not preserved.
- [ ] List nesting is not preserved.
- [ ] Line breaks are not preserved.
- [x] `IMAGE` entity is inserted with `📷` character.

### Word 2010

Highly similar between Chrome 62 and Firefox 57.

- Title, Subtitle -> `unstyled`.
- Bold, Italic, Strikethrough, Underline -> `BOLD`, `ITALIC`, `STRIKETHROUGH`, `UNDERLINE`.
- Bigger, smaller, superscript, subscript, monospace -> `unstyled`.
- Text color, background color -> `unstyled`.
- Small caps -> lowercase `unstyled`.
- Outline -> `BOLD`.
- Double strikethrough -> `STRIKETHROUGH`.
- Emphasis -> `ITALIC`.
- Light emphasis, intense emphasis, quote, intense quote, light ref, intense ref, book title -> `unstyled`.
- Left, right, center, justify, indent -> `unstyled`.
- Page link -> `LINK` with `href`, `url`.
- [x] Filter `href` attribute on `LINK`.
- Email link -> `LINK` with `href`, `url`, eg. `mailto:test@example.com`.
- Link tooltip -> `LINK` with `title` attribute.
- [x] Potentially filter out `title` attribute on `LINK` if unsupported.
- Internal link -> `LINK` with `"href": "#_Inline_styles"`, `"url": "http://localhost/#_Inline_styles"`.
- Firefox 57 - Internal link -> `unstyled`, no `LINK`.
- [x] Remove internal links based on `href` starting with `#`.
- Frame link -> `LINK` with `href`, `url`.
- Comment -> `LINK` with `"href": "#_msocom_1"`, `"http://localhost/#_msocom_1"`, and `[T.C1]` text appended after the commented content.
- Comment -> also adding `unstyled` block for comment text at the end of the document, preceded with `[T.C1]`: `"text": "[T.C1]Comment"`. And `LINK` with `"href": "#_msoanchor_1"`, `"url": "http://localhost/#_msoanchor_1"`.
- [x] Remove comment `LINK` based on `href` attribute.
- ~[ ] Potentially also remove inserted text, if feasible.~
- Heading 1, Heading 2, Heading 3, Heading 5, Heading 6, Heading 8 -> correct `header-*` level.
- Heading 7, Heading 8, Heading 9 -> `unstyled`.
- [x] Bullet list -> `unstyled` prefixed with `·` (depth 0), `o`, `§` (depth 1 & 2).
- [x] Number list prefixed with `1.` (depth 0), `a.`, `i.` (depth 1 & 2).
- Star list -> `unstyled` prefixed with `📷`, and `IMAGE` entity with `"alt": "*"` `"height": "15"`, `"width": "15"`, `"src": "file:///C:\\truncated\\msohtmlclip1\\01\\clip_image001.gif"`.
- [x] Remove image entities and their text when `src` uses `file:///` protocol.
- Unstyled with borders -> `unstyled`.
- Image -> `unstyled` with entity applied to "📷" camera emoji.
- Image -> `IMAGE` with `file:///` for `src`, `width` and `height`.
- Image caption -> `unstyled` after image block.
- Table cells as separate `unstyled` blocks, eg. `"text": "row 1 col 1",`.
- Styled code -> `unstyled`.
- Line break -> `Soft \n line break`.
- Emojis preserved.
- Equation -> `IMAGE` with `file:///` for `src`, `width` and `height`.
- Shape -> `IMAGE` with `file:///` for `src`, `width` and `height`.
- SmartArt -> `IMAGE` with `file:///` for `src`, `width` and `height`.
- Chart -> `IMAGE` with `file:///` for `src`, `width` and `height`.
- WordArt -> `unstyled` block with whitespace text (multiple spaces).

#### IE11

- The equation content makes the browser crash on copy-paste.
- Rich paste is all in a single line
- [x] Advise users to turn on `stripPastedStyles` in their implementation with IE11 detection.

#### IE11 - stripPastedStyles

- `stripPastedStyles` correctly separates the content.
- Small caps -> uppercase.
- Light ref, intense ref, book title -> uppercase.
- [x] Bullet list prefixed with `•\t` (depth 0), `o\t`, `\t` (depth 1 & 2).
- [x] Number list prefixed with `1.\t` (depth 0), `a.\t`, `i.\t` (depth 1 & 2).
- Star list prefixed with `\t` (depth 0), `o\t`, `\t` (depth 1 & 2).
- Table columns separated with `\t`, eg. `"text": "row 1 col 1\trow 1 col 2",`.
- [x] Investigate equation block with single tab character `"text": "\t"`.

### Word 2016

#### Windows

- With Word 2010 document, same as Word 2010 results in Chrome 63, Firefox 57, Edge 16. Also identical in IE11, except for the equation crash.
- With Word 2016 (macOS) document, same as Word 2010 results in Chrome 63, Firefox 57, Edge 16. Also identical in IE11, except for the equation crash.

### Google Docs

Same behavior in Firefox 57 Win 8.1 & macOS 10.13, Chrome 62 Win 8.1 & macOS 10.13, Safari 11, Edge 16 Win 10 unless specified.

- Title, Subtitle -> `unstyled`.
- Bold, Italic, Strikethrough, Underline -> `BOLD`, `ITALIC`, `STRIKETHROUGH`, `UNDERLINE`.
- Bigger, smaller, superscript, subscript, colored text, background text -> `unstyled`.
- Page link -> `LINK` with `href`, `url`.
- Page link -> `UNDERLINE` applied where link is.
- Bookmark link -> `LINK` with `href`, `url` with reference as URL hash, eg. `#heading=h.h40mjmbsff92`
- Bookmark link -> `UNDERLINE` applied where link is.
- Comment -> `unstyled`, no comment text
- Left, right, center, justify, indent -> `unstyled`.
- Heading 1, Heading 2, Heading 3, Heading 5, Heading 6, Heading 8 -> correct `header-*` level.
- Bullet list -> `unordered-list-item`
- Nested bullet list -> `unordered-list-item` at correct depth.
- Numbered list -> `ordered-list-item`
- Nested numbered list -> `ordered-list-item` at correct depth.
- Star list -> `unordered-list-item`
- Nested star list -> `unordered-list-item` at correct depth.
- Unstyled with borders -> `unstyled`.
- Image -> `unstyled` with entity applied to "📷" camera emoji.
- Image -> `IMAGE` with `src` pointing to Google Docs (CDN, `*.googleusercontent.com`), `height`, `width`.
- [x] Potentially filter hotlinked `IMAGE` entities?
- Image wrap text -> `IMAGE` with camera emoji followed by soft line break (`\n`).
- Safari 11, Chrome 62 - wrap text `IMAGE` has `BOLD` style applied.
- Table cell -> one `unstyled` block per cell.
- Horizontal line -> nothing.
- Styled code -> `unstyled`.
- Soft line break -> `"Soft\nLine break"`
- Emojis preserved
- Drawing -> `IMAGE` with `src` pointing at `docs.google.com/drawings`.
- Chart -> `IMAGE` with `src` pointing at `*.googleusercontent.com`.
- Bookmark -> `unstyled`.

#### IE11

- Rich paste is all in a single line
- [x] Advise users to turn on `stripPastedStyles` in their implementation with IE11 detection.

#### IE11 - stripPastedStyles

- Soft line break -> `"Soft"`, `"Line break"`

### Dropbox Paper

Same behavior in Firefox 57 Win 8.1 & macOS 10.13, Chrome 62 Win 8.1 & macOS 10.13, Safari 11, Edge 16 Win 10 unless specified.

- Title -> `header-one`
- Bold, Italic, Strikethrough, Underline -> `BOLD`, `ITALIC`, `STRIKETHROUGH`, `UNDERLINE`.
- Code -> `unstyled`
- Comment -> `unstyled` with comment text added after comment position.
- Page link -> `LINK` with `href`, `url`, `"rel": "noreferrer nofollow noopener",`, `"target": "_blank",`.
- Mention -> `LINK` with `href`, `url` pointing at user profile `/ep/profile/iX86truncated`.
- Safari 11 - Mention link -> `unstyled`, no entity
- Safari 11, Firefox 57 - Mention link -> `href` and `url` are absolute path `/ep/profile/iX86truncated`.
- Edge 16 - Mention link -> `href` is full URL, `https://paper.dropbox.com/ep/profile/iX86truncated`.
- Chrome 62 - Mention link -> `href` is absolute path `/ep/profile/iX86truncated`, `url` is full URL, `"url": "http://localhost/ep/profile/iX86truncated"`.
- Dropbox paper link -> `LINK` with `href`, `url`.
- Heading one, heading two -> `header-one`, `header-two`
- Heading three -> `unstyled`
- Bullet list -> `unordered-list-item`
- Nested bullet list -> `unordered-list-item` at correct depth.
- Numbered list -> `ordered-list-item`
- Nested numbered list -> `ordered-list-item` at correct depth.
- Action list -> `unordered-list-item`
- Nested action list -> `unordered-list-item` at correct depth.
- Image, table, section break -> all concatenated into a single `unstyled` block.
- Table cells separated by nothing.
- Section break -> nothing
- Image -> `unstyled` with entity applied to "📷" camera emoji.
- Image -> `IMAGE` with `src` pointing to Dropbox Paper (CDN, `https://d2mxuefqeaa7sj.cloudfront.net/`).
- [x] Potentially filter hotlinked `IMAGE` entities?
- Code block -> `code-block`, one block per line.
- Code block -> `CODE` style applied on each line.
- [ ] Remove `CODE` style in `code-block`?
- Soft line break -> `"Soft "`, `"line break"`.
- Safari 11 - Soft line break contains different whitespace character than for other browsers.
- Emojis -> converted to `IMAGE` with `src` pointing to Dropbox Paper (`https://paper.dropboxstatic.com/static/img/ace/emoji/`), `alt` describing the emoji, `"height": "16"`.
- Dropbox document link, Trello card, YouTube video, GitHub Gist -> all concatenated into a single `unstyled` block, all with URL in-text and `LINK` entity pointing at source.

#### IE11

Unsupported, warning message displayed but document still partially renders.

- Rich paste is all in a single line
- [x] Advise users to turn on `stripPastedStyles` in their implementation with IE11 detection.

#### IE11 - stripPastedStyles

- Bullet list prefixed with `•` (depth 0), `◦`, `◾` (depth 1 & 2).
- Number list prefixed with `1.` (depth 0), `a.`, `i.` (depth 1 & 2).
- Action list prefixed with empty space at all depth levels.
- Section break -> `unstyled` with `"text": "--------------------------------------------------------------------------------",`.
- Soft line break -> `"Soft "`, `""`, `"line break"`

### Apple Pages

- Paste is identical, plain text, in Safari and Firefox

#### Chrome 62 macOS 10.13

- Bold, italic -> `BOLD`, `ITALIC`
- Strikethrough, monospace, underline, outline, bigger, smaller, superscript, subscript -> `unstyled`.
- Small caps -> lowercase `unstyled`.
- Red, text background, shadow -> `unstyled`
- Emphasis -> `BOLD`.
- Page link -> `LINK` with `href`, `url`.
- [x] Filter `href` attribute on `LINK`.
- Email link -> `LINK` with `href`, `url`, eg. `mailto:test@example.com?subject=subject`.
- ~[ ] Allows setting mail subject. Keep or discard?~
- Bookmark link -> `unstyled`.
- Comment -> `unstyled`.
- Bold + link + comment -> `link` only.
- Title, Heading 1, Heading 2 -> `unstyled` with `BOLD`.
- Heading 3 -> `unstyled`
- Bullet list -> `unordered-list-item`
- Nested bullet list -> empty `unstyled` at current depth, then `unordered-list-item` at correct depth.
- Numbered list -> `ordered-list-item`
- Nested numbered list -> empty `unstyled` at current depth, then `ordered-list-item` at correct depth.
- Dashed list -> `unordered-list-item`
- Nested dashed list -> empty `unstyled` at current depth, then `unordered-list-item` at correct depth.
- Image list -> `unordered-list-item`
- Nested image list -> empty `unstyled` at current depth, then `unordered-list-item` at correct depth.
- [x] Remove non-list blocks with depth not `0`.
- Image -> nothing
- Table -> `unstyled` block per cell, separated by single-space `unstyled` blocks.
- Line -> nothing
- Styled code -> `BOLD` where syntax highlighting matched bold.
- Soft line break has invalid character `"Soft line<?>break"`
- ~[ ] Remove invalid soft line break character inserted by Apple Pages.~
- Emojis preserved
- MathML equation -> nothing
- LaTeX equation -> formula as `unstyled`.
- Chart, Shape, Audio media, Video media -> nothing
- Highlight -> `unstyled`

### Word Online

Same behavior in Chrome 62, Safari 11, Firefox 57, Edge 16. Win 8.1, Win 10, macOS 10.13.

- All block text ends with one empty space (" ").
- Title, Subtitle -> `unstyled`.
- Bold, Italic, Strikethrough, Underline -> `BOLD`, `ITALIC`, `STRIKETHROUGH`, `UNDERLINE`.
- Bigger, smaller, superscript, subscript -> `unstyled`.
- Text color, background color -> `unstyled`.
- Intense emphasis, quote, intense quote, subtle reference -> `ITALIC`.
- Intense reference, book title -> `BOLD`.
- Page link -> `LINK` with `href`, `url`, `rel="noreferrer"`, `target="_blank"`.
- Page link -> `UNDERLINE` applied where link is.
- [x] Filter `href` attribute on `LINK`.
- [x] Filter `rel` attribute on `LINK`.
- [x] Filter `target` attribute on `LINK`.
- Comment -> `unstyled`.
- Left, right, center, justify, indent, hanging, first line -> `unstyled`.
- Heading 1, Heading 2, Heading 3, Heading 5, Heading 6, Heading 8 -> `unstyled`.
- Heading 4, Heading 7, Heading 9 -> `unstyled` with `ITALIC`
- Bullet list -> `unordered-list-item`
- Nested bullet list -> non-nested `unordered-list-item`.
- Numbered list -> `ordered-list-item`
- Nested numbered list -> non-nested `ordered-list-item`.
- Checkbox list -> `unordered-list-item`
- Nested checkbox list -> non-nested `unordered-list-item`.
- Image -> `unstyled` with entity applied to "📷" camera emoji.
- Image -> `IMAGE` with data URI `src`, and `alt` if present.
- [x] Filter `IMAGE` entities using data URIs.
- Image with text next to it -> `unstyled` with entity applied to "📷" and text in the same block.
- [ ] Make sure blocks with image and more text are either split, or image is removed.
- Styled code -> `unstyled`.
- Emojis -> preserved but with `BOLD` applied.
- Inline styles (`ITALIC`, `BOLD`) are split differently (and may be contiguous) between browsers.

#### IE11

Unsupported, document does not open.

### iOS11

- Paste is plain text only.
- Emojis preserved

#### Word

- [x] Bullet list prefixed with `\t`, eg. `"text": "\tBullet list",` (regardless of depth).
- [x] Numbered list prefixed with `\t`, eg. `"text": "\tNumber list",` (regardless of depth).
- Table columns separated with `\t`, eg. `"text": "row 1 col 1\trow 1 col 2",`.
