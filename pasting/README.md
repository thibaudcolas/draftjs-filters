Testing matrix

| Editor - Browser  | Chrome Windows | Chrome macOS | Firefox Windows | Firefox macOS | Edge Windows | IE11 Windows | Safari macOS | Safari iOS | Chrome Android |
| ----------------- | -------------- | ------------ | --------------- | ------------- | ------------ | ------------ | ------------ | ---------- | -------------- |
| **Word 2016**     |                |              |                 |               |              |              |              | N/A        | N/A            |
| **Word 2013**     |                | N/A          |                 | N/A           |              |              | N/A          | N/A        | N/A            |
| **Word 2010**     |                | N/A          |                 | N/A           |              |              | N/A          | N/A        | N/A            |
| **Apple Pages**   | N/A            |              | N/A             |               | N/A          | N/A          |              |            | N/A            |
| **Google Docs**   |                |              |                 |               |              |              |              |            |                |
| **Word Online**   |                |              |                 |               |              | Unsupported  |              | ?          | ?              |
| **Dropbox Paper** |                |              |                 |               |              | Unsupported  |              | ?          | ?              |

| Editor - Browser  | Chrome Windows | Chrome macOS    | Firefox Windows | Firefox macOS   | Edge Windows | IE11 Windows | Safari macOS    | Safari iOS | Chrome Android |
| ----------------- | -------------- | --------------- | --------------- | --------------- | ------------ | ------------ | --------------- | ---------- | -------------- |
| **Word 2016**     |                |                 |                 |                 |              |              |                 | iOS11      |                |
| **Word 2013**     |                | N/A             |                 | N/A             |              |              | N/A             | N/A        | N/A            |
| **Word 2010**     | v62, Win8.1    | N/A             | v57, Win8.1     | N/A             |              | Win8.1       | N/A             | N/A        | N/A            |
| **Apple Pages**   | N/A            | v62, macOS10.13 | N/A             | v62, macOS10.13 | N/A          | N/A          | v11, macOS10.13 | iOS11      | N/A            |
| **Google Docs**   | v62, Win8.1    | v62, macOS10.13 | v57, Win8.1     | v62, macOS10.13 | v16, Win10   | Win8.1       | v11, macOS10.13 | iOS11      |                |
| **Word Online**   | v62, Win8.1    | v62, macOS10.13 | v57, Win8.1     | v62, macOS10.13 | v16, Win10   | Unsupported  | v11, macOS10.13 | No paste   | ?              |
| **Dropbox Paper** | v62, Win8.1    | v62, macOS10.13 | v57, Win8.1     | v62, macOS10.13 | v16, Win10   | Unsupported  | v11, macOS10.13 | iOS11      | ?              |

---

---

## TODO

* [ ] Entity attribute whitelist per entity, potentially configurable.
* [ ] Entity filtering, attribute-based.
* [ ] Line break filtering

## LINK

> Attributes: `url`, potentially `title` if unsupported?

* [ ] Filter `href` attribute on `LINK`.
* [ ] Filter `title` attribute on `LINK`.
* [ ] Filter `rel` attribute on `LINK`.
* [ ] Filter `target` attribute on `LINK`.
* [ ] Apple Pages allows setting mail subject. Keep or discard?

Removal criteria:

* [ ] `href` starts with `#`

## IMAGE

> Attributes: `src`, potentially `alt`

Removal criteria:

* [ ] `src` starts with `file:`
* [ ] `src` starts with `data:`
* [ ] `src` starts with `http:`
* [ ] `src` starts with `https:`

## Other

* [ ] Advise users to turn on `stripPastedStyles` in their implementation with IE11 detection.
* [ ] Remove `CODE` style in `code-block`.
* [ ] Prevent adding `CODE` style in `code-block`.
* [ ] Remove non-list blocks with non-zero depth.
* [ ] Make sure blocks with image and more text are either split, or image is removed.
* [ ] Remove invalid soft line break character inserted by Apple Pages.

## Later

* [ ] Handle `\t` (tab) inserted by Safari iOS, IE11.

Line breaks:

* Apple Pages Firefox / Safari macOS 10.13 / Safari iOS11 inserts invalid character `"Soft line<?>break"`
* Dropbox Paper Safari iOS 11 `"Soft "`, `"line break"`
* Google Docs Safari iOS 11, Word Safari iOS 11 `"Soft"`, `"Line break"`
* Apple Pages Chrome 62 macOS 10.13 `"Soft line\n break"`
* Word Online Firefox 57, Safari 11, macOS 10.13 `"Soft \nline break "`
* Word 2010 IE11 `"Soft "`, `"line break"`.
* Word 2010 Chrome 62, Firefox 57 `"Soft \n line break"`.
* Dropbox Paper all browsers `"Soft "`, `"line break"`.
* Dropbox Paper Safari 11 - contains different whitespace character than for other browsers.
* Dropbox Paper IE11 `stripPastedStyles`: `"Soft "`, `""`, `"line break"`.
* Google Docs all browsers `"Soft\nLine break"`.
* Google Docs IE11 `stripPastedStyles`: `"Soft"`, `"Line break"`

## Word 2010

Highly similar between Chrome 62 and Firefox 57.

* Title, Subtitle -> `unstyled`.
* Bold, Italic, Strikethrough, Underline -> `BOLD`, `ITALIC`, `STRIKETHROUGH`, `UNDERLINE`.
* Bigger, smaller, superscript, subscript, monospace -> `unstyled`.
* Text color, background color -> `unstyled`.
* Small caps -> lowercase `unstyled`.
* Outline -> `BOLD`.
* Double strikethrough -> `STRIKETHROUGH`.
* Emphasis -> `ITALIC`.
* Light emphasis, intense emphasis, quote, intense quote, light ref, intense ref, book title -> `unstyled`.
* Left, right, center, justify, indent -> `unstyled`.
* Page link -> `LINK` with `href`, `url`.
* [ ] Filter `href` attribute on `LINK`.
* Email link -> `LINK` with `href`, `url`, eg. `mailto:test@example.com`.
* Link tooltip -> `LINK` with `title` attribute.
* [ ] Potentially filter out `title` attribute on `LINK` if unsupported.
* Internal link -> `LINK` with `"href": "#_Inline_styles"`, `"url": "http://localhost/examples/#_Inline_styles"`.
* Firefox 57 - Internal link -> `unstyled`, no `LINK`.
* [ ] Remove internal links based on `href` starting with `#`.
* Frame link -> `LINK` with `href`, `url`.
* Comment -> `LINK` with `"href": "#_msocom_1"`, `"http://localhost/examples/#_msocom_1"`, and `[T.C1]` text appended after the commented content.
* Comment -> also adding `unstyled` block for comment text at the end of the document, preceded with `[T.C1]`: `"text": "[T.C1]Comment"`. And `LINK` with `"href": "#_msoanchor_1"`, `"url": "http://localhost/examples/#_msoanchor_1"`.
* [ ] Remove comment `LINK` based on `href` attribute.
* ~[ ] Potentially also remove inserted text, if feasible.~
* Heading 1, Heading 2, Heading 3, Heading 5, Heading 6, Heading 8 -> correct `header-*` level.
* Heading 7, Heading 8, Heading 9 -> `unstyled`.
* Bullet list -> `unstyled` prefixed with `·` (depth 0), `o`, `§` (depth 1 & 2).
* Number list prefixed with `1.` (depth 0), `a.`, `i.` (depth 1 & 2).
* Star list -> `unstyled` prefixed with `📷`, and `IMAGE` entity with `"alt": "*"` `"height": "15"`, `"width": "15"`, `"src": "file:///C:\\truncated\\msohtmlclip1\\01\\clip_image001.gif"`.
* [ ] Remove image entities and their text when `src` uses `file:///` protocol.
* Unstyled with borders -> `unstyled`.
* Image -> `unstyled` with entity applied to "📷" camera emoji.
* Image -> `IMAGE` with `file:///` for `src`, `width` and `height`.
* Image caption -> `unstyled` after image block.
* Table cells as separate `unstyled` blocks, eg. `"text": "row 1 col 1",`.
* Styled code -> `unstyled`.
* Line break -> `Soft \n line break`.
* Emojis preserved.
* Equation -> `IMAGE` with `file:///` for `src`, `width` and `height`.
* Shape -> `IMAGE` with `file:///` for `src`, `width` and `height`.
* SmartArt -> `IMAGE` with `file:///` for `src`, `width` and `height`.
* Chart -> `IMAGE` with `file:///` for `src`, `width` and `height`.
* WordArt -> `unstyled` block with whitespace text (multiple spaces).

### IE11

* The equation content makes the browser crash on copy-paste.
* Rich paste is all in a single line
* [ ] Advise users to turn on `stripPastedStyles` in their implementation with IE11 detection.

### IE11 - stripPastedStyles

* `stripPastedStyles` correctly separates the content.
* Small caps -> uppercase.
* Light ref, intense ref, book title -> uppercase.
* Bullet list prefixed with `•\t` (depth 0), `o\t`, `\t` (depth 1 & 2).
* Number list prefixed with `1.\t` (depth 0), `a.\t`, `i.\t` (depth 1 & 2).
* Star list prefixed with `\t` (depth 0), `o\t`, `\t` (depth 1 & 2).
* Table columns separated with `\t`, eg. `"text": "row 1 col 1\trow 1 col 2",`.
* [ ] Investigate equation block with single tab character `"text": "\t"`.

## Google Docs

Same behavior in Firefox 57 Win 8.1 & macOS 10.13, Chrome 62 Win 8.1 & macOS 10.13, Safari 11, Edge 16 Win 10 unless specified.

* Title, Subtitle -> `unstyled`.
* Bold, Italic, Strikethrough, Underline -> `BOLD`, `ITALIC`, `STRIKETHROUGH`, `UNDERLINE`.
* Bigger, smaller, superscript, subscript, colored text, background text -> `unstyled`.
* Page link -> `LINK` with `href`, `url`.
* Page link -> `UNDERLINE` applied where link is.
* Bookmark link -> `LINK` with `href`, `url` with reference as URL hash, eg. `#heading=h.h40mjmbsff92`
* Bookmark link -> `UNDERLINE` applied where link is.
* Comment -> `unstyled`, no comment text
* Left, right, center, justify, indent -> `unstyled`.
* Heading 1, Heading 2, Heading 3, Heading 5, Heading 6, Heading 8 -> correct `header-*` level.
* Bullet list -> `unordered-list-item`
* Nested bullet list -> `unordered-list-item` at correct depth.
* Numbered list -> `ordered-list-item`
* Nested numbered list -> `ordered-list-item` at correct depth.
* Star list -> `unordered-list-item`
* Nested star list -> `unordered-list-item` at correct depth.
* Unstyled with borders -> `unstyled`.
* Image -> `unstyled` with entity applied to "📷" camera emoji.
* Image -> `IMAGE` with `src` pointing to Google Docs (CDN, `*.googleusercontent.com`), `height`, `width`.
* [ ] Potentially filter hotlinked `IMAGE` entities?
* Image wrap text -> `IMAGE` with camera emoji followed by soft line break (`\n`).
* Safari 11, Chrome 62 - wrap text `IMAGE` has `BOLD` style applied.
* [ ] Remove styles applied on block-level entities.
* Table cell -> one `unstyled` block per cell.
* Horizontal line -> nothing.
* Styled code -> `unstyled`.
* Soft line break -> `"Soft\nLine break"`
* Emojis preserved
* Drawing -> `IMAGE` with `src` pointing at `docs.google.com/drawings`.
* Chart -> `IMAGE` with `src` pointing at `*.googleusercontent.com`.
* Bookmark -> `unstyled`.

### IE11

* Rich paste is all in a single line
* [ ] Advise users to turn on `stripPastedStyles` in their implementation with IE11 detection.

### IE11 - stripPastedStyles

* Soft line break -> `"Soft"`, `"Line break"`

## Dropbox Paper

Same behavior in Firefox 57 Win 8.1 & macOS 10.13, Chrome 62 Win 8.1 & macOS 10.13, Safari 11, Edge 16 Win 10 unless specified.

* Title -> `header-one`
* Bold, Italic, Strikethrough, Underline -> `BOLD`, `ITALIC`, `STRIKETHROUGH`, `UNDERLINE`.
* Code -> `unstyled`
* Comment -> `unstyled` with comment text added after comment position.
* Page link -> `LINK` with `href`, `url`, `"rel": "noreferrer nofollow noopener",`, `"target": "_blank",`.
* Mention -> `LINK` with `href`, `url` pointing at user profile `/ep/profile/iX86truncated`.
* Safari 11 - Mention link -> `unstyled`, no entity
* Safari 11, Firefox 57 - Mention link -> `href` and `url` are absolute path `/ep/profile/iX86truncated`.
* Edge 16 - Mention link -> `href` is full URL, `https://paper.dropbox.com/ep/profile/iX86truncated`.
* Chrome 62 - Mention link -> `href` is absolute path `/ep/profile/iX86truncated`, `url` is full URL, `"url": "http://localhost/ep/profile/iX86truncated"`.
* Dropbox paper link -> `LINK` with `href`, `url`.
* Heading one, heading two -> `header-one`, `header-two`
* Heading three -> `unstyled`
* Bullet list -> `unordered-list-item`
* Nested bullet list -> `unordered-list-item` at correct depth.
* Numbered list -> `ordered-list-item`
* Nested numbered list -> `ordered-list-item` at correct depth.
* Action list -> `unordered-list-item`
* Nested action list -> `unordered-list-item` at correct depth.
* Image, table, section break -> all concatenated into a single `unstyled` block.
* Table cells separated by nothing.
* Section break -> nothing
* Image -> `unstyled` with entity applied to "📷" camera emoji.
* Image -> `IMAGE` with `src` pointing to Dropbox Paper (CDN, `https://d2mxuefqeaa7sj.cloudfront.net/`).
* [ ] Potentially filter hotlinked `IMAGE` entities?
* Code block -> `code-block`, one block per line.
* Code block -> `CODE` style applied on each line.
* [ ] Remove `CODE` style in `code-block`?
* Soft line break -> `"Soft "`, `"line break"`.
* Safari 11 - Soft line break contains different whitespace character than for other browsers.
* Emojis -> converted to `IMAGE` with `src` pointing to Dropbox Paper (`https://paper.dropboxstatic.com/static/img/ace/emoji/`), `alt` describing the emoji, `"height": "16"`.
* Dropbox document link, Trello card, YouTube video, GitHub Gist -> all concatenated into a single `unstyled` block, all with URL in-text and `LINK` entity pointing at source.

### IE11

Unsupported, warning message displayed but document still partially renders.

* Rich paste is all in a single line
* [ ] Advise users to turn on `stripPastedStyles` in their implementation with IE11 detection.

### IE11 - stripPastedStyles

* Bullet list prefixed with `•` (depth 0), `◦`, `◾` (depth 1 & 2).
* Number list prefixed with `1.` (depth 0), `a.`, `i.` (depth 1 & 2).
* Action list prefixed with empty space at all depth levels.
* Section break -> `unstyled` with `"text": "--------------------------------------------------------------------------------",`.
* Soft line break -> `"Soft "`, `""`, `"line break"`

## Apple Pages

* Paste is identical, plain text, in Safari and Firefox

### Chrome 62 macOS 10.13

* Bold, italic -> `BOLD`, `ITALIC`
* Strikethrough, monospace, underline, outline, bigger, smaller, superscript, subscript -> `unstyled`.
* Small caps -> lowercase `unstyled`.
* Red, text background, shadow -> `unstyled`
* Emphasis -> `BOLD`.
* Page link -> `LINK` with `href`, `url`.
* [ ] Filter `href` attribute on `LINK`.
* Email link -> `LINK` with `href`, `url`, eg. `mailto:test@example.com?subject=subject`.
* [ ] Allows setting mail subject. Keep or discard?
* Bookmark link -> `unstyled`.
* Comment -> `unstyled`.
* Bold + link + comment -> `link` only.
* Title, Heading 1, Heading 2 -> `unstyled` with `BOLD`.
* Heading 3 -> `unstyled`
* Bullet list -> `unordered-list-item`
* Nested bullet list -> empty `unstyled` at current depth, then `unordered-list-item` at correct depth.
* Numbered list -> `ordered-list-item`
* Nested numbered list -> empty `unstyled` at current depth, then `ordered-list-item` at correct depth.
* Dashed list -> `unordered-list-item`
* Nested dashed list -> empty `unstyled` at current depth, then `unordered-list-item` at correct depth.
* Image list -> `unordered-list-item`
* Nested image list -> empty `unstyled` at current depth, then `unordered-list-item` at correct depth.
* [ ] Remove empty `unstyled` block in-between list items (`unordered-list-item`, `ordered-list-item`) if the next list item has a non-zero depth? First test what happens with manual editing.
* [ ] At list normalise all non-list block depth to `0`.
* Image -> nothing
* Table -> `unstyled` block per cell, separated by single-space `unstyled` blocks.
* Line -> nothing
* Styled code -> `BOLD` where syntax highlighting matched bold.
* Soft line break has invalid character `"Soft line<?>break"`
* [ ] Remove invalid soft line break character inserted by Apple Pages.
* Emojis preserved
* MathML equation -> nothing
* LaTeX equation -> formula as `unstyled`.
* Chart, Shape, Audio media, Video media -> nothing
* Highlight -> `unstyled`

## Word Online

Same behavior in Chrome 62, Safari 11, Firefox 57, Edge 16. Win 8.1, Win 10, macOS 10.13.

* All block text ends with one empty space (" ").
* Title, Subtitle -> `unstyled`.
* Bold, Italic, Strikethrough, Underline -> `BOLD`, `ITALIC`, `STRIKETHROUGH`, `UNDERLINE`.
* Bigger, smaller, superscript, subscript -> `unstyled`.
* Text color, background color -> `unstyled`.
* Intense emphasis, quote, intense quote, subtle reference -> `ITALIC`.
* Intense reference, book title -> `BOLD`.
* Page link -> `LINK` with `href`, `url`, `rel="noreferrer"`, `target="_blank"`.
* Page link -> `UNDERLINE` applied where link is.
* [ ] Filter `href` attribute on `LINK`.
* [ ] Filter `rel` attribute on `LINK`.
* [ ] Filter `target` attribute on `LINK`.
* Comment -> `unstyled`.
* Left, right, center, justify, indent, hanging, first line -> `unstyled`.
* Heading 1, Heading 2, Heading 3, Heading 5, Heading 6, Heading 8 -> `unstyled`.
* Heading 4, Heading 7, Heading 9 -> `unstyled` with `ITALIC`
* Bullet list -> `unordered-list-item`
* Nested bullet list -> non-nested `unordered-list-item`.
* Numbered list -> `ordered-list-item`
* Nested numbered list -> non-nested `ordered-list-item`.
* Checkbox list -> `unordered-list-item`
* Nested checkbox list -> non-nested `unordered-list-item`.
* Image -> `unstyled` with entity applied to "📷" camera emoji.
* Image -> `IMAGE` with data URI `src`, and `alt` if present.
* [ ] Filter `IMAGE` entities using data URIs.
* Image with text next to it -> `unstyled` with entity applied to "📷" and text in the same block.
* [ ] Make sure blocks with image and more text are either split, or image is removed.
* Styled code -> `unstyled`.
* Emojis -> preserved but with `BOLD` applied.
* Inline styles (`ITALIC`, `BOLD`) are split differently (and may be contiguous) between browsers.

### IE11

Unsupported, document does not open.

## iOS11

* Paste is plain text only.
* Emojis preserved

### Word

* Numbered list prefixed with `\t`, eg. `"text": "\tStar list",` (regardless of depth).
* Table columns separated with `\t`, eg. `"text": "row 1 col 1\trow 1 col 2",`.
