---
title: Code in Text
key_point: What to set in code font, and how to explain placeholders.
---

Code font marks text the computer reads as-is. It tells the reader that what is
between the marks is to be typed, or found, exactly as written — that the
capitalization matters, the underscore is really there, and the plural `s` is
not part of it.

Use it for what the machine reads. Do not use it for emphasis; that is what
**bold** is for, and a reader who has learned that code font means _literal_ is
misled every time it means _important_.

## Some specific items to put in code font

| Item                     | Example                             |
| :----------------------- | :---------------------------------- |
| File and directory names | `eleventy.config.mjs`, `_includes/` |
| Commands and flags       | `pnpm install`, `--frozen-lockfile` |
| Package and scope names  | `@openinf/util-types`               |
| Identifiers in code      | `replaceInlineSvg`, `$utilities`    |
| Literal values           | `true`, `null`, `0`, `"production"` |
| Environment variables    | `ELEVENTY_ENV`                      |
| HTML elements            | `<var>`, `<code>`                   |
| Selectors and classes    | `.doc-prose`, `#sidebar-toggle`     |
| Git refs and trailers    | `live`, `Signed-off-by`             |

Leave in ordinary text the things that are names of concepts rather than strings
to be typed: a pull request, the commit queue, the style handbook.

<p class="example">
  <span class="compare-better">Recommended:</span> Run <code>nps test</code>
  before opening a pull request.
</p>
<p class="example">
  <span class="compare-worse">Not recommended:</span> Run <code>nps test</code>
  before opening a <code>pull request</code>.
</p>

A trailing punctuation mark belongs outside the code font unless the mark is
part of the thing being named.

<p class="example">
  <span class="compare-better">Recommended:</span> The config lives in
  <code>eleventy.config.mjs</code>.
</p>
<p class="example">
  <span class="compare-worse">Not recommended:</span> The config lives in
  <code>eleventy.config.mjs.</code>
</p>

## Explaining placeholders

A placeholder stands where the reader supplies a value of their own. Mark it
with the `<var>` element so it is visibly not a literal, and name it in
uppercase with an underscore between words. The case carries the meaning where
the markup cannot: in a terminal, in a plain-text file, in anything that strips
the element away.

<p class="example">
  <span class="compare-better">Recommended:</span>
  <code>gh pr view <var>PULL_REQUEST_NUMBER</var></code>
</p>
<p class="example">
  <span class="compare-worse">Not recommended:</span>
  <code>gh pr view <var>pull-request-number</var></code>
</p>

A mixed spelling is worse than either, so no `PULL_request_number` and no
`pullRequestNumber`.

Then say what to put there. A placeholder the reader has to guess at is worse
than no placeholder, because it looks like it has already been explained.

Explain it in the sentence that introduces the sample, or in a list directly
after it, naming each placeholder in the order shown:

<p class="example">
  <span class="compare-better">Recommended:</span> Replace
  <var>PULL_REQUEST_NUMBER</var> with the pull request's number, which
  <code>gh pr list</code> prints.
</p>

Do not explain a placeholder whose name already answers the question.
<var>PULL_REQUEST_NUMBER</var> in a command that plainly takes a pull request
needs no sentence of its own; <var>REF</var> does, because a reader cannot tell
whether it wants a branch, a tag, or a commit.

For how placeholders are set in command-line syntax specifically — including
optional and repeated arguments — see [Documenting Command-Line Syntax][].

<!-- prettier-ignore-start -->
<!-- LINK DEFINITION LABELS - START -->

[Documenting Command-Line Syntax]: https://open.inf.is/docs/handbook/style/code-syntax/

<!-- LINK DEFINITION LABELS - END -->
<!-- prettier-ignore-end -->
