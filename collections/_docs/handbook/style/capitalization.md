---
title: Capitalization
key_point: When to capitalize, and when to leave a word lowercase.
---

Capitalize a name. Leave everything else alone. Most disagreements about
capitalization are really disagreements about whether a thing is a name, and
answering that question settles the spelling.

A capital letter is a claim that a word is the name of one particular thing.
Applying it to an ordinary noun — a feature, a format, a role — asks the reader
to look for a proper noun that is not there.

## Capitalization in headings

A page title is set in title case, capitalizing the first word, the last word,
and everything between them except articles, coordinating conjunctions, and
prepositions.

<p class="example">
  <span class="compare-better">Recommended:</span> Documenting Command-Line
  Syntax
</p>
<p class="example">
  <span class="compare-worse">Not recommended:</span> Documenting command-line
  syntax
</p>

The exceptions are what the rule turns on. A preposition in the middle of a
title stays lowercase however long the title is:

<p class="example">
  <span class="compare-better">Recommended:</span> Code in Text
</p>
<p class="example">
  <span class="compare-worse">Not recommended:</span> Code In Text
</p>

A heading inside a page is set in sentence case: the first word capitalized, and
after that only what would be capitalized in running text.

<p class="example">
  <span class="compare-better">Recommended:</span> Explaining placeholders
</p>
<p class="example">
  <span class="compare-worse">Not recommended:</span> Explaining Placeholders
</p>

An adapted page follows these rules too. A page that carries an attribution line
says where its wording came from, not whose house style it is set in, and a
reader moving between pages should not be able to tell which is which from the
headings.

## The name of the project

The project is **OpenINF**. One capital at the front for _Open_, three at the
back for _INF_, and nothing else.

<p class="example">
  <span class="compare-better">Recommended:</span> OpenINF
</p>
<p class="example">
  <span class="compare-worse">Not recommended:</span> OPENINF, Openinf, openINF
</p>

Setting the name in full capitals is shouting it, and a name that shouts in
running text is a name the reader learns to skip. This holds in headings, in
navigation, and in the small print at the foot of a page — nowhere is it
`OPENINF`.

The scope on npm is lowercase, because npm scopes are lowercase: `@openinf`.
Write a package name exactly as it is published, in code font, and never
capitalize it to start a sentence. Rewrite the sentence instead.

<p class="example">
  <span class="compare-better">Recommended:</span> The
  <code>@openinf/util-types</code> package has no dependencies.
</p>
<p class="example">
  <span class="compare-worse">Not recommended:</span>
  <code>@openinf/util-types</code> has no dependencies.
</p>

## Words that only look like names

Technologies, formats, and general concepts are ordinary nouns. They take a
capital only where a name is embedded in them.

| Write                | Not                  |
| :------------------- | :------------------- |
| open source          | Open Source          |
| the web              | the Web              |
| the internet         | the Internet         |
| a pull request       | a Pull Request       |
| the command line     | the Command Line     |
| JavaScript, npm, Git | Javascript, NPM, git |

The last row is the exception that proves the rule: those three are names, and
each has one correct spelling that is neither all lowercase nor all capitals.

## After a colon

A colon does not start a new sentence, so what follows it is capitalized only if
it would be capitalized anywhere else. See [Colons][] for when the colon is the
right mark at all.

<!-- prettier-ignore-start -->
<!-- LINK DEFINITION LABELS - START -->

[Colons]: https://open.inf.is/docs/handbook/style/colons/

<!-- LINK DEFINITION LABELS - END -->
<!-- prettier-ignore-end -->
