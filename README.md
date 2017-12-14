# Draft.js transforms

## TODO

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

```
word2010-chrome62-win81
word2010-firefox57-win81
word2010-ie11-noequation-strippastedstyles-win81
```

### IE11

* The equation content makes the browser crash on copy-paste.
* Rich paste is all in a single line

### IE11 - stripPastedStyles

* `stripPastedStyles` correctly separates the content.
* Small caps -> uppercase.
* Light ref, intense ref, book title -> uppercase.
* Bulleted list prefixed with `•\t` (depth 0), `o\t`, `\t` (depth 1 & 2).
* Numbered list prefixed with `1.\t` (depth 0), `a.\t`, `i.\t` (depth 1 & 2).
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
