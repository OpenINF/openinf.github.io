# Cross-references

**Key Point:** Use cross-references to guide readers to related information. For
same-server links, use site-root-relative URLs.

In general, cross-references link to nonessential information that adds to the
reader's understanding.

## References to other documents

- Use meaningful [link text](link-text.md).

  Not recommended: See
  [this blog post](https://www.blog.google/products/pixel/pixel-4/).

  Not recommended: Click [here](https://cloud.google.com/vpc-service-controls/).

  Recommended: To begin coding right away, read
  [Building your first app](https://developer.android.com/training/basics/firstapp/index.md).

- If the link text doesn’t clearly indicate why you're referring the reader to
  this information, then give an explanation. Make the explanation specific, but
  don't repeat the link text.

  Recommended: For more information about authentication and authorization, see
  [Using OAuth 2.0 to access Google APIs](https://developers.google.com/identity/protocols/OAuth2).

- If a link downloads a file, then make that clear in the link text, and mention
  the file type.

  Recommended: For more information,
  [download the security features PDF](https://www.example.com/security.pdf).

## Cross-references within generated reference documents

When linking from one reference topic to another in generated reference
documents, use the reference generator's standard linking syntax rather than
hard-coding links within the reference, so that the links will change
appropriately when the reference docs change.

## Wording cross-references

When a cross-reference includes information that describes what the
cross-reference links to, use _about_ instead of _on_.

Not recommended: For more information on indexes, see
[Managing indexes](https://cloud.google.com/firestore/docs/query-data/indexing).

Recommended: For more information about indexes, see
[Managing indexes](https://cloud.google.com/firestore/docs/query-data/indexing).

## Formatting cross-references

- When a cross-reference is a link, don't put the link text in quotation marks.

  Recommended: For more information, see
  [Meet Android Studio](https://developer.android.com/studio/intro/index.md).

  Recommended: Learn about
  [what's new in Android Wear 2.0](https://android-developers.googleblog.com/2017/02/AndroidWear2.md).

- In the rare case when a cross-reference isn't a link, use italics or quotation
  marks as appropriate.

  - For an unlinked reference to a document section or a short work, use
    quotation marks.

    Recommended: For more information, see "Describing system versions" in the
    following section.

  - For an unlinked reference to a full-length work such as a book or movie, use
    italics.

    Recommended: ...see The Chicago Manual of Style.

### URLs in links to pages on the same server

When you're linking to another page on the same server, use a site-root-relative
URL starting with `/`, even if you're linking to a page in the same directory as
the page you're linking from.

**Note**: There are many valid linking styles; this guideline isn't a general
statement about best practices for linking in all contexts; it's just our house
style.

### Links to sections in the same page

When you're linking to another section in the same page, let the reader know
that the link takes you to a different section of the same page. Use a standard
phrase to clue readers in if you use an in-page link.

Recommended: In this document, see
[URLs in links to pages on the same server](url-links.md#same-server).

### Links to pages on a different server

- Configure the link to open in a new tab or window.
- If the server you're linking to supports HTTPS, start the URL with `https`. If
  the server doesn't support HTTPS, start the URL with `http`.
- Use an icon and configure the icon with CSS to indicate that it opens in a new
  tab or window.

Recommended: For more information, see
[Links and Hypertext](https://webaim.org/techniques/hypertext/hypertext_links#new_window).

---

<small>Portions of this page are reproduced from work created and
[shared by Google](https://developers.google.com/readme/policies/) and used
according to terms described in the
[Creative Commons 4.0 Attribution License](https://creativecommons.org/licenses/by/4.0/).
For more information, refer to the
[original source page](https://developers.google.com/style/cross-references).</small>
