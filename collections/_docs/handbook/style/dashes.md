---
title: Dashes
key_point: Which dash to use, and how it differs from a colon.
---

Three marks look alike and do different work. Pick by the job, not by which one
the keyboard offers first.

| Mark | Name    | Job                           |
| :--- | :------ | :---------------------------- |
| `-`  | hyphen  | joins words into one modifier |
| `–`  | en dash | spans a range                 |
| `—`  | em dash | breaks a sentence open        |

Write the character itself rather than an approximation. A pair of hyphens is
not an em dash, and a reader copying the text gets the pair.

<p class="example">
  <span class="compare-better">Recommended:</span> The queue squashes the branch
  — every message it carried is kept.
</p>
<p class="example">
  <span class="compare-worse">Not recommended:</span> The queue squashes the
  branch -- every message it carried is kept.
</p>

## Hyphens

A hyphen joins two or more words doing the work of one modifier, and only when
they sit in front of what they describe.

<p class="example">
  <span class="compare-better">Recommended:</span> a command-line tool
</p>
<p class="example">
  <span class="compare-worse">Not recommended:</span> a command line tool
</p>

After the noun, the words go back to being separate and the hyphen goes away.

<p class="example">
  <span class="compare-better">Recommended:</span> the tool runs on the command
  line
</p>
<p class="example">
  <span class="compare-worse">Not recommended:</span> the tool runs on the
  command-line
</p>

An adverb ending in `-ly` is already attached to what follows it, so it takes no
hyphen: a _newly published package_, not a _newly-published package_.

## En dashes

An en dash spans a range, standing in for the word _to_. It takes no spaces
around it.

<p class="example">
  <span class="compare-better">Recommended:</span> Node.js 20–24
</p>
<p class="example">
  <span class="compare-worse">Not recommended:</span> Node.js 20 - 24
</p>

If the range is introduced by _from_ or _between_, finish the phrase with a word
rather than a dash: _from 20 to 24_, never _from 20–24_.

## Em dashes

An em dash breaks a sentence open to let something in — an aside, a correction,
a sharp turn — and then lets it close again. Set it with a space on each side.

Use one where a comma is too quiet and parentheses are too polite. Use two to
fence off an aside in the middle of a sentence, and make sure the sentence still
reads if the fenced part is lifted out.

One pair to a sentence. A second pair leaves the reader unable to tell which
aside ended where.

## When a colon is better

A colon and an em dash both introduce. They differ in what the reader is
promised.

A colon promises that what follows completes what came before — a list, a
definition, a quotation. It points ahead, and the text after it delivers exactly
what the text before it set up.

An em dash promises nothing in particular. It marks a break in the sentence and
lets anything through: an aside, a reversal, a remark the sentence did not need.

<p class="example">
  <span class="compare-better">Recommended:</span> The check does one thing: it
  compares the vendored copy against what upstream serves.
</p>
<p class="example">
  <span class="compare-worse">Not recommended:</span> The check does one thing —
  it compares the vendored copy against what upstream serves.
</p>

Both are correct English there, and the colon is better, because the sentence
before it announced that one thing was coming and the colon is the mark that
keeps the promise.

Prefer the colon whenever what follows is the thing that was just announced.
Keep the em dash for what the sentence did not announce.

When a colon introduces a list, the phrase before it stands alone as a complete
sentence. See [Colons][] for that rule and for the fullwidth colon this project
uses in commit subjects.

<!-- prettier-ignore-start -->
<!-- LINK DEFINITION LABELS - START -->

[Colons]: https://open.inf.is/docs/handbook/style/colons/

<!-- LINK DEFINITION LABELS - END -->
<!-- prettier-ignore-end -->
