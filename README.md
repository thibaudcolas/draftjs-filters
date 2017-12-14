# Draft.js transforms

## TODO

* [ ] Entity attribute whitelist per entity, potentially configurable.
* [ ] Entity filtering, attribute-based.

```txt
dropboxpaper-chrome62-macos1013
dropboxpaper-chrome62-win81
dropboxpaper-edge16-win10
dropboxpaper-firefox57-macos1013
dropboxpaper-firefox57-win81
dropboxpaper-ie11-unsupported-strippastedstyles-win81
dropboxpaper-ie11-unsupported-win81
dropboxpaper-safari11-macos1013
googledocs-chrome62-macos1013
googledocs-chrome62-win81
googledocs-edge16-win10
googledocs-firefox57-macos1013
googledocs-firefox57-win81
googledocs-ie11-strippastedstyles-win81
googledocs-ie11-win81
googledocs-safari11-macos1013
```

## Word 2010

* Page link -> `LINK` with `href`, `url`.
* [ ] Filter `href` attribute on `LINK`.
* Email link -> `LINK` with `href`, `url`, eg. `mailto:test@example.com`.
* Link tooltip -> `LINK` with `title` attribute.
* [ ] Potentially filter out `title` attribute on `LINK` if unsupported.
* Internal link -> `LINK` with `"href": "#_Inline_styles"`, `"url": "http://localhost/examples/#_Inline_styles"`.
* [ ] Remove internal links based on `href` starting with `#`.
* Frame link -> `LINK` with `href`, `url`.
* Comment -> `LINK` with `"href": "#_msocom_1"`, `"http://localhost/examples/#_msocom_1"`, and `[T.C1]` text appended after the commented content.
* Comment -> also adding `unstyled` block for comment text at the end of the document, preceded with `[T.C1]`: `"text": "[T.C1]Comment"`. And `LINK` with `"href": "#_msoanchor_1"`, `"url": "http://localhost/examples/#_msoanchor_1"`.
* [ ] Remove comment `LINK` based on `href` attribute.
* [ ] Potentially also remove inserted text, if feasible.
* Title, Subtitle -> `unstyled`.
* Heading 1, Heading 2, Heading 3, Heading 5, Heading 6, Heading 8 -> correct `header-*` level.
* Bold, Italic, Strikethrough, Underline -> `BOLD`, `ITALIC`, `STRIKETHROUGH`, `UNDERLINE`.
* Bigger, smaller, superscript, subscript, monospace -> `unstyled`.
* Text color, background color -> `unstyled`.
* Small caps -> lowercase `unstyled`.
* Outline -> `BOLD`.
* Double strikethrough -> `STRIKETHROUGH`.
* Emphasis -> `ITALIC`.
* Light emphasis, intense emphasis, quote, intense quote, light ref, intense ref, book title -> `unstyled`.
* Left, right, center, justify, indent -> `unstyled`.
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

### Firefox

* Internal link -> `unstyled`, no `LINK`.

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

## iOS11

* Paste is plain text only.
* Emojis preserved

### Word

* Numbered list prefixed with `\t`, eg. `"text": "\tStar list",` (regardless of depth).
* Table columns separated with `\t`, eg. `"text": "row 1 col 1\trow 1 col 2",`.

## Apple Pages

* Paste is identical, plain text, in Safari and Firefox

### Chrome 62 macOS 10.13

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
* image list -> `unordered-list-item`
* Nested image list -> empty `unstyled` at current depth, then `unordered-list-item` at correct depth.
* [ ] Remove empty `unstyled` block in-between list items (`unordered-list-item`, `ordered-list-item`) if the next list item has a non-zero depth? First test what happens with manual editing.
* [ ] At list normalise all non-list block depth to `0`.
* Image -> nothing
* Table -> `unstyled` block per cell, separated by single-space `unstyled` blocks.
* Line -> nothing
* Styled code -> `BOLD` where syntax highlighting matched bold.
* Emojis preserved
* MathML equation -> nothing
* LaTeX equation -> formula as `unstyled`.
* Chart, Shape, Audio media, Video media -> nothing
* Highlight -> `unstyled`

## Word Online

Same behavior in Chrome 62, Safari 11, Firefox 57, Edge 16. Win 8.1, Win 10, macOS 10.13.

* Page link -> `LINK` with `href`, `url`, `rel="noreferrer"`, `target="_blank"`.
* Page link -> `UNDERLINE`.
* [ ] Filter `href` attribute on `LINK`.
* [ ] Filter `rel` attribute on `LINK`.
* [ ] Filter `target` attribute on `LINK`.
* All block text ends with one empty space (" ").
* Title, Subtitle, Heading 1, Heading 2, Heading 3, Heading 5, Heading 6, Heading 8 -> `unstyled`.
* Bold, Italic, Strikethrough, Underline -> `BOLD`, `ITALIC`, `STRIKETHROUGH`, `UNDERLINE`.
* Bigger, smaller, superscript, subscript -> `unstyled`.
* Text color, background color -> `unstyled`.
* Intense emphasis, quote, intense quote, subtle reference -> `ITALIC`.
* Intense reference, book title -> `BOLD`.
* Comment -> `unstyled`.
* Left, right, center, justify, indent, hanging, first line -> `unstyled`.
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

## Line breaks

* Apple Pages Firefox / Safari macOS 10.13 / Safari iOS11 inserts invalid character `"Soft line<?>break"`
* [ ] Remove invalid soft line break character inserted by Apple Pages.
* Dropbox Paper Safari iOS 11 `"Soft "`, `"line break"`
* Google Docs Safari iOS 11, Word Safari iOS 11 `"Soft"`, `"Line break"`
* Apple Pages Chrome 62 macOS 10.13 `"Soft line\n break"`
* Word Online Firefox 57, Safari 11, macOS 10.13 `"Soft \nline break "`
* Word 2010 IE11 `"Soft "`, `"line break"`.
* Word 2010 Chrome 62, Firefox 57 `"Soft \n line break"`.
