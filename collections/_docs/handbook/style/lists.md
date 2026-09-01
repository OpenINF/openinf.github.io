---
title: Lists
key_point: How to introduce and punctuate lists.
---

A list is for things the reader compares or works through in turn. Prose that
has been chopped into fragments is not a list; it is prose with the connective
tissue removed, and the reader has to put it back.

Three items make a comfortable list. Two are usually a sentence with an _and_ in
it.

## Intros

Introduce a list with a complete sentence, then a colon.

<p class="example">
  <span class="compare-better">Recommended:</span> A landed commit carries three
  trailers:
</p>
<p class="example">
  <span class="compare-worse">Not recommended:</span> A landed commit carries:
</p>

The second reads as a sentence the list has to finish, which means the reader
cannot take any item on its own. It also breaks the moment an item is reordered
or removed.

Keep the introduction and the list in agreement about what the items are. If the
sentence says _three trailers_, three trailers follow — not two trailers and a
note about a third.

Never introduce a list with a fragment ending in a dash, and never with no mark
at all.

## Punctuation

Punctuate by what the item is, and punctuate every item in a list the same way.

Start each item with a capital, unless it opens with something whose case is
fixed: a package name, an identifier, a flag.

<p class="example">
  <span class="compare-better">Recommended:</span> No space after the colon.
</p>
<p class="example">
  <span class="compare-worse">Not recommended:</span> no space after the colon.
</p>

End an item with a full stop when it carries a verb or completes a thought,
whether it is a whole sentence or a fragment. Leave the stop off a bare term,
and end with a colon where the item introduces a block below it.

<p class="example">
  <span class="compare-better">Recommended:</span> At most 50 characters,
  counting an emoji as the one character it looks like.
</p>

An item ending in a colon has to have the block it promises:

- Leave `gpg.format` unset, and set:

  ```text
  [gpg]
  format = ssh
  ```

Do not end items with semicolons, and do not put a conjunction before the last
one. Both are attempts to make a list read as a sentence, and a list that wanted
to be a sentence should have stayed one.

## Ordered or unordered

Number a list when the order is part of the meaning: steps to follow, a
sequence, a ranking. Numbering an unordered list tells the reader that item 1
comes before item 2 in some way, and they will look for the way.

Leave a list unnumbered when the items are alternatives or members of a set,
even a set with a natural order to it.

## Nesting

One level of nesting is usually one too many already. If a list needs a second,
the items have become sections and want headings instead — see
[Capitalization][] for how to set those.

<!-- prettier-ignore-start -->
<!-- LINK DEFINITION LABELS - START -->

[Capitalization]: https://open.inf.is/docs/handbook/style/capitalization/#capitalization-in-headings

<!-- LINK DEFINITION LABELS - END -->
<!-- prettier-ignore-end -->
