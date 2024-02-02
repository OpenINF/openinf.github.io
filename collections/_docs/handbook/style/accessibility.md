# Accessible content

**Key Point:** Write documentation that is accessible to people with
disabilities.

We write our developer documentation with accessibility in mind. This page is
not an exhaustive reference, but describes some general guidelines and examples
that illustrate best practices to follow. The
[World Health Organization](https://www.who.int/en/news-room/fact-sheets/detail/disability-and-health)
estimates that 15% of the world’s population (more than 1 billion people) have
an accessibility need. When documentation is written with accessibility in mind,
it improves the overall experience for all readers.

## General dos and don'ts

- Don't use ableist language. Avoid bias and harm when discussing disability and
  accessibility. For more information, read
  [Writing inclusive documentation](inclusive-documentation.md).
- Ensure that readers can reach all parts of the document (including tabs,
  form-submission buttons, and interactive elements) using only a keyboard,
  without a mouse or trackpad.
- In HTML, use [semantic tagging](semantic-tagging.md). For example, use the
  `<em>` element only to indicate emphasis, not to indicate italics.
- In HTML, prefer
  [native elements](https://developer.mozilla.org/en-US/docs/Web/HTML/Element)
  over custom styles.
- Avoid unnecessary font formatting. (Screen readers explicitly describe text
  modifications.)
- If you're documenting a product that includes specialized accessibility
  features, then explicitly document those features. For example, the `infuse`
  command-line tool includes togglable accessibility features such as percentage
  progress bars and ASCII box rendering.
- Don’t force line breaks (hard returns) within sentences and paragraphs. Line
  breaks might not work well in resized windows or with enlarged text.
- Avoid when possible [camel case](https://wikipedia.org/wiki/Camel_case) and
  [all caps](https://wikipedia.org/wiki/All_caps). Some screen readers read
  capitalized letters individually, and some languages are
  [unicase](https://wikipedia.org/wiki/Unicase). Follow
  [capitalization](capitalization.md) guidelines.
- Depending on the screen reader (or personal settings), not all punctuation
  marks are read. Make sure the same meaning is conveyed to the reader without
  punctuation marks. For that reason, avoid when possible the use of exclamation
  marks, question marks, and semicolons.
- Don't use _&_ instead of _and_ in headings, text, navigation, or tables of
  contents; however, it's OK to use _&_ when referencing UI elements that use
  _&_, or in table headings and diagram labels where space constraints require
  abbreviation. And of course it's fine to use `&` for technical purposes in
  code.

## Reading ease

- Break up walls of text to aid in scannability. For example, separate
  paragraphs, create headings, and use lists.
- Use shorter sentences. Try to use fewer than 26 words per sentence.
- Define acronyms and abbreviations on first usage and if they're used
  infrequently.
- Use parallel writing structures for similar things. For example, start each
  list in the same format.
- Place distinguishing and important information of a paragraph in the first
  sentence to aid in scannability.

## Headings and titles

Use descriptive headings and titles because they help a user navigate their
browser and the page. It's easier to jump between pages and sections of a page
if the headings and titles are unique.

- Use a heading hierarchy.
- Don't skip levels of the heading hierarchy. For example, put an `<h3>` only
  under an `<h2>`.
- To change the visual formatting of a heading, use CSS rather than using a
  heading level that doesn't fit the hierarchy.
- Don't have empty headings or headings with no associated content.
- Tag headings using heading elements. In HTML: `<h1>`, `<h2>`, and so on. In
  Markdown: `#`, `##`, and so on.
- Use a level-1 heading for the page title or main content heading.

For more information and examples, read [Headings and titles](headings.md).

## Links

- Use [meaningful link text](link-text.md). Links should make sense when read
  out of context.
- Don't use _click here_ or _read this document_. Some people who use screen
  readers jump from link to link to scan a page and need to understand what a
  link contains.
- Use an [external link icon](url-links.md#out-page) to indicate that the link
  opens in a new window or tab.
- Use a standard phrase to clue readers in if you use an in-page link, so they
  know where the link is sending them. For more information, see
  [Links to sections in the same page](url-links.md#same-page).
- Avoid when possible adjacent links. Instead, put a character in between to
  separate them.
- If a link downloads a file, the link text needs to indicate this action as
  well as the file type.

## Images

- For every image, provide [alt text](images#alt-text.md) that adequately
  summarizes the intent of each image.
- Don't present new information in images; always provide an equivalent text
  explanation with the image.
- Don't repeat images unless absolutely necessary.
- Don't use images of text, code samples, or terminal output. Use actual text.
- Use SVG instead of PNG if available. SVGs stay sharp when you zoom in on the
  image.

For more about images, see
[Text associated with images](images#text-associated-with-images.md).

## Videos, recordings, and GIFs

- Provide captions, transcripts, or descriptions of audio and video content. For
  example, you can use the
  [autocaption feature](https://support.google.com/youtube/answer/6373554) in
  YouTube.
- Ensure that captions can be translated into major languages.
- Don't use flickering or flashing elements. They can cause anything from motion
  sickness to a seizure.

## Buttons and icons

- For form-submission buttons, use the native HTML `<button>` element.
- If you are unsure of the name of the icon, inspect the element to use the
  `aria-label`. For more information, see
  [Using an aria-label](https://www.w3.org/TR/WCAG20-TECHS/ARIA14.md).

For more information, read the [Buttons and icons](ui-elements.md#buttons)
section of the UI elements and interaction page.

## Tables

- Use table headings for the first column and the first row only. Use the
  [`th` element](https://www.w3.org/TR/html4/struct/tables.md#edef-TH).
- If your tables include both row and column headings, then mark heading cells
  with the [`scope`](https://www.w3.org/WAI/tutorials/tables/two-headers/)
  attribute.
- If your tables have more than one row containing column headings, then use the
  [`headers`](https://www.w3.org/WAI/tutorials/tables/multi-level/) attribute
  and make sure the headings have unique IDs.
- Avoid when possible tables in the middle of a numbered procedure.
- Don't merge cells. Don't use `colspan` or `rowsspan` attributes.

For more information, read [Tables](tables.md).

- Don't use tables unless it's the best method to present your information.
  Tables are challenging for screen readers. For more information, see
  [List or table](tables.md#list-or-table).

## Forms

- Label every input field, using a `<label>` element.
- Place labels outside of fields.
- When you're creating an error message for form validation, clearly state what
  went wrong and how to fix it. For example: "Name is a required field."

## Custom CSS and JavaScript

Try to use your site's standard styles and standard JavaScript code as much as
possible. However, if you do use custom styles or code, then follow these
guidelines:

- Pick colors that respect
  [accessible color contrast ratios](https://webaim.org/resources/contrastchecker/)
  (4.5:1 for text).
- Don't use `visibility:hidden` or `display:none`. Both styles hide information
  from screen readers.
- Avoid when possible using mouseover events. But if you do use them, then add
  alternate focus and blur events for keyboard users.
- Ensure that any ordering and positioning defined in styles reflects the DOM
  and the reading order (such as left to right and top to bottom) of your page.

## Document rendering

Make sure that your document conveys all the information you intended when you
view it in the following contexts:

- Without sound
- Using only sound
- [Without color](https://colororacle.org/)
- Using a keyboard
- With screen magnification
- Without punctuation

Don't use color, size, location, or other visual cues as the primary way of
communicating information.

- If you're using color, icon, or outline thickness to convey state, then also
  provide a secondary cue, such as a change in the text label.

- Refer to buttons and other elements by their label (or
  `[aria-label](https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/ARIA_Techniques/Using_the_aria-label_attribute)`,
  if they’re visual elements). For example:

  Not recommended: Click the round button.

  Recommended: Click **Save**.

- Don't use directional language to orient the reader, such as above, below, or
  right-hand side. This type of language doesn't work well for accessibility or
  for localization reasons. If a UI element is hard to find, provide a
  screenshot.

  Not recommended: In the left-side panel, click the button with three lines.

  Recommended: Click **Menu** _menu_.

## More resources

- [Google's main accessibility page](https://www.google.com/accessibility/)
- [Web Content Accessibility Guidelines (WCAG) 2.0](https://www.w3.org/WAI/WCAG20/glance/)
- [Web Accessibility Initiative (WAI)](https://www.w3.org/WAI/)
- [Using ARIA](https://www.w3.org/TR/using-aria/)
- [Web Accessibility Tutorials](https://www.w3.org/WAI/tutorials/)

---

<small>Portions of this page are reproduced from work created and
[shared by Google](https://developers.google.com/readme/policies/) and used
according to terms described in the
[Creative Commons 4.0 Attribution License](https://creativecommons.org/licenses/by/4.0/).
For more information, refer to the
[original source page](https://developers.google.com/style/key-terms).</small>
