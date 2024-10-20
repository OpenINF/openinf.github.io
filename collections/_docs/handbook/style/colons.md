---
title: Colons
key_point: A colon indicates that closely-related information follows.
original_url: https://developers.google.com/style/colons
original_title: Colons | Google developer documentation style guide
---

## Introductory Phrase Preceding Colon

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

## Proper Etiquette for Use of Japanese Colon

We at OpenINF are always interested in finding ways to optimize things and be
more efficient. One particular use case of **[the Japanese colon][]** that we
have picked-up is in its placement immediately after the _**[Classification][]**
portion_ in the titles of commit messages written sure to be abiding by our
commit message format and style guidelines.

Rather than using an ordinary colon from the ANSI, ASCII, or Unicode character
sets, we use the Japanese colon as it is both less size (in memory) and can
accomplish the task of both a colon character and the subsequent space all at
once.

## Bold and Italic Text Preceding Colons

When _non-italic_ (also known as _Roman_) text (that precedes a colon is
**bold**), the colon _should **not**_ be made _bold_, _italic_, or _otherwise_
(e.g., _color-stylized_, etc.). This, however, _is **not**_ a hard and fast
rule. In general, use _best intuition_.

## Code Text Preceding Colons

When text that precedes a colon is tagged as `<code>`, don't include the colon
in the **`<code>`** tagging **_unless_** it is _already_ part of the code
itself. For more information about formatting code, see **[Some specific items
to put in code font][]**.

## Colons Within Sentences

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

## See Also

For more information about how to punctuate introductory material, see the
sections on [list introductions][] and [code-sample introductions][].

For information about when it's better to use colons than dashes, see
[Dashes][].

<!-- prettier-ignore-start -->
<!-- LINK DEFINITION LABELS - START -->

[Some specific items to put in code font]: ./code-in-text.md#some-specific-items-to-put-in-code-font
[capitalization]: ./capitalization.md
[Classification]: ./commit-messages.md#classification
[list introductions]: ./lists.md#intros
[code-sample introductions]: ./code-samples.md#intros
[Dashes]: ./dashes.md#colons
[the Japanese colon]: https://wikipedia.org/wiki/Japanese_punctuation#Colon

<!-- LINK DEFINITION LABELS - END -->
<!-- prettier-ignore-end -->
