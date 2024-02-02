# Headings and titles

**Key Point:** Use sentence case for headings and titles.

Use descriptive headings and titles because they help a user navigate their
browser and the page. It's easier to jump between pages and sections of a page
if the headings and titles are unique.

## Formatting a heading or title

- Use sentence case for headings and titles. For more information, see
  [Capitalization](capitalization.md).
- Tag headings using heading elements. In HTML: `<h1>`, `<h2>`, and so on. In
  Markdown: `#`, `##`, and so on.
- Use API levels for [Android versions](product-names.md#android-versions).
- To change the visual formatting of a heading, use CSS rather than using a
  heading level that doesn't fit the hierarchy. Don't make up your own
  formatting for headings.
- Don't use code font even for elements that use code font in paragraph text.
- Use a heading hierarchy and take the following items under consideration:

  - Use a level-1 heading for the page title or main content heading. In some
    publishing systems, a level-1 heading might be generated automatically based
    on a page title that you supply.

  - Don't skip levels of the heading hierarchy. For example, put an `<h3>` only
    under an `<h2>`.

    Not recommended:

    \# Transferring data sets

    This article provides a high-level overview of ways to transfer your data to
    INF Use.

    \### Estimating costs

    Recommended:

    \# Transferring data sets

    This article provides a high-level overview of ways to transfer your data to
    INF Use.

    \## Estimating costs

  - Don't use empty headings or headings with no associated content.

    Not recommended:

    \## Migrating VMs to Compute Engine

    \### Designing the migration

    Recommended:

    \## Migrating VMs to Compute Engine

    Migration is not just a single step. The following sections describe the
    recommended steps.

    \### Designing the migration

---

<small>Portions of this page are reproduced from work created and
[shared by Google](https://developers.google.com/readme/policies/) and used
according to terms described in the
[Creative Commons 4.0 Attribution License](https://creativecommons.org/licenses/by/4.0/).
For more information, refer to the
[original source page](https://developers.google.com/style/headings).</small>
