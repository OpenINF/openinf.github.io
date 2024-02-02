# Tables

In many contexts, tables are the best way to represent sets of related pieces of
data. However, in some contexts, other approaches are better choices.

## List or table?

Tables and lists are both ways to present a set of similarly structured items;
sometimes it's not obvious when to choose one presentation over the other. To
decide which presentation to use, consult the following table:

Item type

Example

How to present

Each item is a single unit.

A list of programming language names, or a list of steps to follow.

Use a [numbered list, lettered list, or bulleted list](lists.md).

Each item is a pair of pieces of related data.

A list of term/definition pairs.

Use a [description list](lists.md). (Or, in some contexts, a table.)

Each item is three or more pieces of related data.

A set of parameters, where each parameter has a name, a data type, and a
description.

Use a table.

### Places not to use tables

- Don't use tables to lay out a page; use your site's standard CSS instead.
- Usually if you have only one row of material, a table isn't the best choice
  for how to present it. But in some contexts (especially for consistency of
  layout in reference docs), it may be.
- If you have only one column in your table, turn the table into a list.
- Don't use tables to lay out code snippets.
- Don't use tables to lay out long one-dimensional lists in multiple columns.
  For example, if you have a long list of function names, don't try to save
  space by splitting the list in half and presenting the two halves as a
  two-column table. Use tables only to present two-dimensional data—that is,
  material that semantically makes sense to display in rows and columns.
- Avoid tables in the middle of a numbered procedure.

## Multi-paragraph table cells

Any table cell can contain more than one paragraph.

To create multiple paragraphs, use the `<p>` element rather than using the
`<br>` element. (The HTML specification describes which uses of
`<[br](https://html.spec.whatwg.org/multipage/semantics.md#the-br-element)>` are
legitimate and which aren't.)

Example of a table with some cells that contain more than one paragraph:

Attribute name

Type

Description

`foo`

Placeholder

Used as a placeholder.

Usually the first placeholder in a series.

`bar`

Placeholder

Used as a placeholder.

Usually the second placeholder in a series.

## Table placement

- When introducing a table, use a complete sentence and try to refer to the
  table's position, using a phrase like "the following table" or "the preceding
  table."
- Don't put a table in the middle of a sentence.
- If your table refers to footnotes, place them immediately following the table.

## Table captions

If your document contains only one table, the table doesn't need a caption.
However, be sure to place the table adjacent to the text that refers to it.

If your document contains more than one table in fairly close proximity to each
other, include a caption for each one, using a
`<[caption](https://html.spec.whatwg.org/multipage/tables.md#the-caption-element)>`
element as the first child of the `<table>` element. Start the caption with a
number, in the form "<b>Table number.</b> Description". Use sentence case for
the caption, but don't place a period at the end.

When referring to the table from text, refer to it by its number. For example:
"... as shown in table 2." Do not capitalize "table" unless it starts a
sentence.

Your site's CSS determines the styling and placement of the caption.

Recommended:

<table>
  <caption><b>Table 1.</b> Prehistoric birds</caption>
  ...
</table>

## Table formatting

- Don't add styling to the table element.
- Don't merge cells. Don't use `colspan` or `rowsspan` attributes.
- Sort rows in a logical order, or alphabetically if there is no logical order.

## Table column heads

- Use sentence case.
- Write concise headings and omit articles (_a_, _an_, _the_).
- Don't end with punctuation, including a period, an ellipsis, or a colon.
- Use table headings for the first column and the first row only. Use the
  [`th` element](https://www.w3.org/TR/2014/REC-html5-20141028/tabular-data.md#the-th-element).
- Include the [`scope`](https://www.w3.org/TR/WCAG20-TECHS/H63.md) attribute as
  appropriate, for accessibility.

## Responsive tables

Where possible, use table CSS that adapts to different viewport sizes.

## Linking to tables

Where possible, avoid linking to tables; instead, refer to them by table number.

---

<small>Portions of this page are reproduced from work created and
[shared by Google](https://developers.google.com/readme/policies/) and used
according to terms described in the
[Creative Commons 4.0 Attribution License](https://creativecommons.org/licenses/by/4.0/).
For more information, refer to the
[original source page](https://developers.google.com/style/tables).</small>
