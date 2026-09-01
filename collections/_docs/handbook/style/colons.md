---
title: Colons
key_point: A colon indicates that closely related information follows.
google: true
---

## Introductory phrase preceding colon

When a colon introduces a list, the text that precedes the colon _**should**
ordinarily_ be able to stand alone as a complete sentence.

**Examples**

<p class="example">
  <span class="compare-better">Recommended:</span> The fields are defined as
  follows:
</p>
<p class="example">
  <span class="compare-worse">Not recommended:</span> The fields are:
</p>

## The Japanese colon in commit subjects

A commit subject separates its **[Classification][]** from the rest with **[the
Japanese colon][]** — `：`, the fullwidth colon at U+FF1A — rather than with the
ASCII one.

<p class="example">
  <span class="compare-better">Recommended:</span>
  <code>🏗️🔧：let the glob see dot files</code> — U+FF1A, no space after it
</p>
<p class="example">
  <span class="compare-worse">Not recommended:</span>
  <code>🏗️🔧: let the glob see dot files</code> — U+003A and a space
</p>

Those two lines are within a few pixels of each other on screen, which is the
whole difficulty: the mark is one to copy rather than to type.
`nps verify.commits` refuses a subject that lacks it, so a colon typed by hand
fails the pull request rather than landing.

The mark is fullwidth, so the gap a space would give is already inside the
glyph, and no space follows it. An ASCII colon is narrow enough that the emoji
crowds the first word, and the space that would fix the crowding spends one of
the fifty characters a subject is allowed.

It is not chosen for size. `：` takes three bytes in UTF-8 where a colon and a
space take two. What it buys is a subject that reads at the same width as the
emoji beside it, in a terminal and on a page alike.

## Bold and italic text preceding colons

When _non-italic_ (also known as _Roman_) text that precedes a colon is
**bold**, the colon _should **not**_ be made _bold_, _italic_, or _otherwise_
(e.g., _color-stylized_, etc.). This, however, _is **not**_ a hard and fast
rule. In general, use _best intuition_.

## Code text preceding colons

When text that precedes a colon is tagged as `<code>`, don't include the colon
in the **`<code>`** tagging **_unless_** it is _already_ part of the code
itself. For more information about formatting code, see **[Some specific items
to put in code font][]**.

## Colons within sentences

In general, the first word in the text that follows a colon should be in
lowercase. For exceptions, see **[capitalization][]**.

**Examples**

<p class="example">
  <span class="compare-better">Recommended:</span> Tone: concise,
  conversational, friendly, respectful
</p>
<p class="example">
  <span class="compare-better">Recommended:</span> When you add or update
  content to an existing project, remember to take these steps: review the style
  guide, use checklists, enlist a fellow writer or an editor to copyedit your
  work, and request a developmental edit if you feel it's warranted.
</p>

## See also

For more information about how to punctuate introductory material, see the
sections on [list introductions][] and [code-sample introductions][].

For information about when it's better to use colons than dashes, see
[Dashes][].

<!-- prettier-ignore-start -->
<!-- LINK DEFINITION LABELS - START -->

[Some specific items to put in code font]: https://open.inf.is/docs/handbook/style/code-in-text/#some-specific-items-to-put-in-code-font
[capitalization]: https://open.inf.is/docs/handbook/style/capitalization/
[Classification]: https://open.inf.is/docs/handbook/style/commit-messages/#classification
[list introductions]: https://open.inf.is/docs/handbook/style/lists/#intros
[code-sample introductions]: https://open.inf.is/docs/handbook/style/code-samples/#intros
[Dashes]: https://open.inf.is/docs/handbook/style/dashes/#when-a-colon-is-better
[the Japanese colon]: https://wikipedia.org/wiki/Japanese_punctuation#Colon

<!-- LINK DEFINITION LABELS - END -->
<!-- prettier-ignore-end -->
