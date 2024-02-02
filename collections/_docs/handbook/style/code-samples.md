# Code samples

**Key Point:** Use standard Google code formatting for code samples.

Basic guidelines for formatting code samples:

- **Don't use tabs** to indent code; use spaces only.

- **Indent by 2 spaces** per indentation level.

- **Wrap lines** at 80 characters.

  If you expect readers to have a relatively narrow browser window, or to print
  out your document, consider wrapping at a smaller number of characters for
  readability.

- **Mark code blocks as preformatted text**. In HTML, use a `<pre>` element; in
  Markdown, indent every line of the code block by four spaces.

See also [Coding style guides](code-in-text.md#coding).

For information about inline code in a text paragraph, see
[Code in Text](code-in-text.md).

#### Example of a code sample

Recommended:

<pre class="prettyprint">
function helloWorld() {
  alert('Hello, world! This sentence is so long that it wraps onto a second
    line.');
}
</pre>

This renders a code block with syntax highlighting:

function helloWorld() { alert('Hello, world! This sentence is so long that it
wraps onto a second line.'); }

## Introductions

In most cases, precede a code sample with an introductory sentence or paragraph.
The intro can end with a colon or a period; usually a colon if it immediately
precedes the sample, usually a period if there's more material (such as a note
paragraph) between the introduction and the sample, or if the introduction
paragraph ends in a sentence that isn't directly related to the sample.

#### Examples

Not recommended (ending with a colon): The following code sample shows how to
use the `get` method. For information on other methods, see \[link]: \[sample]

Recommended (ending with a period): The following code sample shows how to use
the `get` method. For information on other methods, see \[link]. \[sample]

Also recommended: The following code sample shows how to use the `get` method:
\[sample] For information on other methods, see \[link].

---

<small>Portions of this page are reproduced from work created and
[shared by Google](https://developers.google.com/readme/policies/) and used
according to terms described in the
[Creative Commons 4.0 Attribution License](https://creativecommons.org/licenses/by/4.0/).
For more information, refer to the
[original source page](https://developers.google.com/style/code-samples).</small>
