# Lists

**Key Point:** Use numbered lists for sequences, bulleted lists in most other
contexts, and description lists for pairs of related pieces of data.

## List or table?

Tables and lists are both ways to present a set of similarly structured items;
sometimes it's not obvious when to choose one presentation over the other. To
decide which presentation to use, see [List or table?](tables.md#list-or-table)
in the page about tables.

## Types of lists

Here are some common ways to present lists in our documentation:

List type

Used for

HTML elements

Numbered list

Sequence of steps to be performed in order. Nested sequential lists are labeled
with lowercase letters or lowercase Roman numerals.

`ol`, `li`

Lettered list (upper case)

Options to choose among, especially mutually exclusive options.

`ol class="upper-alpha"`, `li`

Bulleted list

Set of items that's neither a sequence nor options.

`ul`, `li`

Description list

Set of terms, each with a description, definition, or explanation.

`dl`, `dt`, `dd`

**Note**: Don't use a list to show only one item; a single item isn't really a
list. If you want to set a single item off from surrounding text, then use some
other formatting.

### Examples of the different kinds of lists

Here's a sequence of steps to follow:

1. Open the box.
2. Remove the bobcat from the box.
3. Feed the bobcat.

Here's a set of options for which programming language to use:

1. Java
2. JavaScript
3. Go
4. Dart

Here's a list of things that can go wrong, in no particular order:

- Your bicycle might explode.
- The sun might go out.
- An ant might break its leg and require a tiny splint.

Here's a list of things to do after breakfast, in order:

1. Go shopping.
   1. Buy groceries.
      - Flour
      - Eggs
      - Sugar
      - Butter
   2. Go to mall.
      1. Buy dress.
      2. Buy shoes.
2. Make cake.
3. Build birthday present out of spare parts.
4. Clean house.

See also [Sub-steps in numbered procedures](procedures.md#sublists).

Here are some descriptions of types of birds:

Emu

The best kind of bird.

Crow

The other best kind of bird.

Peacock

Also the best kind of bird.

Phoenix

An even better kind of bird.

## Multi-paragraph list items

Any list item can contain more than one paragraph.

To create multiple paragraphs, use the `<p>` element rather than using the
`<br>` element. (The HTML specification describes which uses of
`<[br](https://html.spec.whatwg.org/multipage/semantics.md#the-br-element)>` are
legitimate and which aren't.)

### Examples of multiple paragraphs within one item

Example of a list item containing more than one paragraph:

- This list item is a single paragraph.

- This list item contains multiple paragraphs.

  As you can see!

- This is another list item that's only one paragraph long.

## Introductory sentences for lists

In most cases, you should precede a list with an introductory sentence. The
sentence can end with a colon or a period; usually a colon if it immediately
precedes the list, usually a period if there's more material (such as a note
paragraph) between the introduction and the list.

Always introduce a list with a complete sentence, not a partial one that's
completed by the list items.

For information about punctuation and capitalization of lists, see
[Capitalization and end punctuation](lists.md#capitalization).

### Examples of introductory sentences

Not recommended:

Use the **Submit** button to:

- submit the form
- indicate that you're done
- allow the next person to enter their data

Recommended:

Use the **Submit** button for any of the following purposes:

- To submit the form.
- To indicate that you're done.
- To allow the next person to enter their data.

Not recommended:

To get the USB driver:

1. Click **Tools > Android > SDK Manager**.
2. Select **Google USB Driver**, and then click **OK**.

Recommended:

To get the USB driver, follow these steps:

1. Click **Tools > Android > SDK Manager**.
2. Select **Google USB Driver**, and then click **OK**.

## Unusual list numbering

A couple of situations involving nonstandard numbering:

- To present a list in reverse-numerical order, use `<ol reversed>`.
- In most cases, it isn't a good idea to manually number a list item in a
  numbered list, because if the number of items changes later, you'll have to
  manually change the value. But in some cases, setting a value by hand can come
  in handy. To set a value manually, use the `value` attribute.

## Sub-steps in a numbered procedure

For information about sub-steps in a numbered procedure, see the
[Procedures page](procedures.md#sublists).

## Parallel syntax

Use the same syntax/structure for all list items in a given list, if possible.

## Capitalization and end punctuation

Capitalization and end punctuation depend on the type of list and the contents
of the list.

### Numbered, lettered, and bulleted lists

In most contexts, start each list item with a capital letter.

End each list item with a period or other appropriate sentence-ending
punctuation, except in the following cases:

- If the item consists of a single word, don't add end punctuation.
- If the item doesn't include a verb, don't add end punctuation.
- If the item is entirely in code font, don't add end punctuation.

**Note**: These exceptions apply to individual list items, so it's possible to
end up with a list that includes some items that end with periods and some that
don't. However, most lists use [parallel construction](lists.md#parallel) for
the items, so in most lists, either all of the items end with periods or none of
them do.

Recommended:

The following words are adjectives:

- Big
- Small
- Gratuitous

Recommended:

The SDK supports the following UI elements:

- Text box
- Bullet list
- Button

Recommended:

The API supports the following actions:

- Create
- Replace
- Update
- Delete

Recommended:

You can do any of the following using the API:

- Create an item.
- Replace one item with another.
- Update an item.
- Delete an item.

Sometimes it's useful to add an explanatory phrase to a list item, which can
affect the punctuation. In general, don't add an explanatory phrase to only a
single list item; instead, use a description list, and provide explanatory
phrases for all items.

Not recommended:

The following words are adjectives:

- Big
- Small
- Gratuitous
- Purple—this is a color.

Recommended:

The following words are adjectives:

Big

A short word.

Small

Includes a double letter.

Gratuitous

A long word.

Purple

Refers to a color.

**Note**: The guidelines here about list punctuation differ from the
[Material Design guidelines](https://material.io/guidelines/style/writing.md#writing-capitalization-punctuation).
If you're writing UI text rather than prose documentation, then follow the
Material Design guidelines.

### Description lists

In most contexts, start each term (`<dt>` element) with a capital letter.

Don't end the term with a period. Do generally put a period at the end of each
`dd` ("description") element.

## Colons and dashes in lists

Don't use a dash to set off a description from an item in a bulleted or numbered
list. For more information, see
[Colons instead of dashes in lists](dashes#colons-instead-of-dashes-in-lists.md).

---

<small>Portions of this page are reproduced from work created and
[shared by Google](https://developers.google.com/readme/policies/) and used
according to terms described in the
[Creative Commons 4.0 Attribution License](https://creativecommons.org/licenses/by/4.0/).
For more information, refer to the
[original source page](https://developers.google.com/style/lists).</small>
