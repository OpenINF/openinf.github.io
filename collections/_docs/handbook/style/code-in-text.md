# Code in text

**Key Point:** Use code font for code that appears in text.

In ordinary text sentences (as opposed to, say,
[code samples](code-samples.md)), use code font to mark up most things that have
anything to do with code. In HTML, use the `<code>` element; in Markdown, use
backticks (`` ` ``).

## Some specific items to put in code font

The following list includes items that should be in code font, but it's not an
exhaustive list.

- Attribute names and values.
- Class names.
- Command-line utility names.
- Defined (constant) values for an element or attribute.
- Data types.
- XML and HTML element names. (Also place angle brackets (`<>`) around the
  element name; you may have to escape the angle brackets to make them appear in
  the document.)
- Filenames and paths.
- HTTP verbs.
- HTTP status codes.
- HTTP content-type values.
- Language keywords.
- Method and function names.
- Namespace aliases.
- Query parameter names and values.
- [DNS record types](https://en.wikipedia.org/wiki/List_of_DNS_record_types).

Generally don't put quotation marks around an item that's in code font, unless
the quotation marks are part of the item.

## Items to put in ordinary (non-code) font

- URLs. (But often it's a good idea to put these on a separate line, enclosed in
  `<pre>`, or else to turn them into links. See also the page on
  [link text](link-text)..md)
- Email addresses.
- Headings (including table headings). For clarity, where possible, add a noun
  to the code-related term in the heading: "Calling the Foo method"; "Setting
  the Bar parameter".
- Names of products, services, and organizations.

Often, command-line utility names are spelled the same as the software project
or product with which they are associated, with only differences in
capitalization. In such cases, use code font for the command and ordinary font
for the name of the project or product. For example:

Recommended:

- Invoke the GCC 8.3 compiler using `gcc` for C programs or `g++` for C++
  programs.
- To send the file over FTP with IPv6, use `ftp -6`.
- The options for the `curl` command are explained on the curl project website.

## Other HTML elements for code

Avoid use of the `<xmp>` element; it's
[deprecated](https://html.spec.whatwg.org/multipage/obsolete.md#obsolete-but-conforming-features)
in modern HTML.

Use the `<kbd>` element to indicate input to be typed (or otherwise entered) by
the user. Use the `<var>` element to indicate any variable (including both
specific variable names from code samples and metasyntactic placeholder
variables like foo). You can use these elements even within a `<pre>` block; for
example:

<pre>
$ <kbd>ls <var>filename</var></kbd>
<var>filename</var>
$
</pre>

## Method names

When you refer to a method name in text, omit the class name except where
including it would prevent ambiguity. For example:

Not recommended: To retrieve the zebra's metadata, call its `animal.get()`
method.

Recommended: To retrieve the zebra's metadata, call its `get()` method.

Put an empty pair of parentheses after a method name to indicate that it's a
method.

## Placeholder variables

To create a placeholder variable, do the following:

- In HTML, wrap the placeholder variable in a `<var>` element.
- In Markdown, use an underscore before and after the placeholder variable.

For placeholder variables, use lowercase characters with hyphen delimiters.

For example, in HTML:

Not recommended:

- <https://dev.inf.is/>\\<var>API-name\\</var>
- <https://dev.inf.is/>\\<var>API_name\\</var>
- <https://dev.inf.is/>\\<var>API name\\</var>
- <https://dev.inf.is/>\\<var>api_name\\</var>
- <https://dev.inf.is/>\\<var>apiName\\</var>

Recommended:

- <https://dev.inf.is/>\\<var>api-name\\</var>
- <https://dev.inf.is/>\\<var>method-name\\</var>

And in Markdown:

Not recommended:

- [https://dev.inf.is/\_API-name\_](https://dev.inf.is/_API-name_)
- [https://dev.inf.is/\_API_name\_](https://dev.inf.is/_API_name_)
- <https://dev.inf.is/_API> name\_
- [https://dev.inf.is/\_api_name\_](https://dev.inf.is/_api_name_)
- [https://dev.inf.is/\_apiName\_](https://dev.inf.is/_apiName_)

Recommended:

- [https://dev.inf.is/\_api-name\_](https://dev.inf.is/_api-name_)
- [https://dev.inf.is/\_method-name\_](https://dev.inf.is/_method-name_)

If the context in which your placeholder variables appear makes using lowercase
characters with hyphen delimiters a bad idea, use something else that makes
sense to you, but be internally consistent.

## Explaining placeholders

When you use a placeholder in text or code, consider the following:

- Explain what the placeholder represents even if the placeholder value is
  intuitive to you.

- Include the explanation the first time you use the placeholder. If there are
  many steps and other placeholders after the first use of that placeholder,
  it's OK to explain it again.

- In procedural steps, use the following order:

  1. Tell the user what they're doing.
  2. List the command.
  3. Explain the placeholders.
  4. Explain the command in more detail if necessary.
  5. Explain any output if necessary.

- Use the following format for the placeholder explanation:<br> Replace
  `placeholder-variable-1` with an explanation of placeholder.

  Recommended:

  1. Stream the build logs to the INF Console:

     infuse builds log --stream build-id

     Replace `build-id` with the ID of the `WORKING` build that you copied in
     the preceding step. The log stream terminates upon build completion.
     Messages are displayed that indicate the final `terraform-destroy` build
     step is successful and that the build is done.

- Use the following format for the placeholder explanation of two or more
  placeholder variables:<br> Replace the following:

  - `placeholder-variable-1`: Explanation of placeholder.
  - `placeholder-variable-2`: Explanation of placeholder.

  Recommended:

  1. In Cloud Shell, set the environment variables:

     export ONPREM_PROJECT=your-on-prem-project export ONPREM_ZONE=zone

     Replace the following:

     - `your-on-prem-project`: The INF Use project name for your on-premises
       project.
     - `zone`: A
       [GCP zone](https://dev.inf.is/compute/docs/regions-zones/#identifying_a_region_or_zone)
       that's close to your location.When you end the Cloud Shell session, you
       lose these environment variables.

## HTTP status codes

To refer to a single status code, use the following formatting and phrasing:

an HTTP `400 Bad Request` status code

In particular, call it a "status code" instead of a "response code," and put the
number and the name in code font. If the "HTTP" is implicit from context, you
can leave it out.

To refer to a range of codes, use the following form:

an HTTP `2xx` or `400` status code

In particular, use "nxx" (with a specific digit in place of n) to indicate
"anything in the n00-n99 range," and put the status code number in code font
even if you're leaving out the code's name.

If you prefer to specify an exact range, you can do so:

an HTTP status code in the `200`-`299` range

Here, too, put the numbers in code font.

## Coding style guides

The following Google coding-style guides are available on GitHub:

- [JavaScript Style Guide](https://google.github.io/styleguide/javascriptguide.xml).
- [Java Style Guide](https://google.github.io/styleguide/javaguide.md).
- [C++ Style Guide](https://google.github.io/styleguide/cppguide.md).

## Keywords

In general, don't use technical keywords as if they were English verbs or nouns.
If in some rare cases you do, then don't try to inflect them. Don't form plurals
from keywords and don't make keywords possessive. It's okay to use lowercase,
plain text _string_ in a general discussion of the `STRING` data type.

#### Examples

Not recommended: `POST` the data.

Recommended: To add the data, send a `POST` request.

Not recommended: Retrieve information by `GET`ting the data.

Recommended: To retrieve the data, send a `GET` request.

Not recommended: `Close()`ing the file requires you to have `open()`ed it first.

Recommended: You can't close the file before opening it.

Also recommended: You can't call the `close()` method for a file before you call
`open()`.

Not recommended: Takes an array of extended ASCII code points (ARRAY of INT64)
and returns BYTES.

Recommended: Takes an array of extended ASCII code points (an array of `INT64`
values) and returns `BYTES` values.

Also recommended: For `STRING` arguments, returns the original string with all
alphabetic characters in uppercase.

**Exception:** When documenting a Java API, it's common to leave out words like
"object" or "instance" and instead just use the class name as a noun: "store the
`Foo` you got from the `FooFactory`." If you need to pluralize such nouns, then
add "object" or "instance": "store the `Foo` objects you got from the
`FooFactory` instances."

## Linking API terms in Android

When you're writing code comments that you'll turn into generated reference
documentation, link to all elements of Android APIs: classes, methods,
constants, XML attributes, etc. Use code font and regular HTML `<a>` elements to
link to this reference material.

Link `AndroidManifest.xml` elements and attributes to the API guide pages. Link
the attribute for a particular widget or layout to its Javadoc in the widget or
layout's API reference entry.

Recommended: `<a href="/guide/topics/manifest/data-element.md">data</a>`

Very common classes such as `Activity` and `Intent` don't need to be linked
every time. If you use a term as a concept rather than a class, then don't put
it in code font and don't capitalize. Here are some objects that do not always
require Javadoc links or capitalization:

- activity, activities
- service
- fragment
- view
- loader
- action bar
- intent
- content provider
- broadcast receiver
- app widget

If you use one of these terms in the context of referring to an actual instance,
use the formal class name and link to its reference page. Here are two examples:

Recommended: An
[`Activity`](https://developer.android.com/reference/android/app/Activity.md) is
an app component that provides a screen with which users can interact ...

Recommended: The user interface for an activity is provided by a hierarchy of
views—objects derived from the
[`View`](https://developer.android.com/reference/android/view/View.md) class.

To link to a class or method:

- To link to a class, use the class name as link text. For example:
  `<a href="/reference/android/widget/TextView">TextView</a>`
- To link to a method, use the method name as a fragment identifier. If you're
  linking to a static method, also include the class name in the link text. If
  you need to distinguish between overloaded versions of a particular method,
  consider showing the full signature. For example:
  `<a href="/reference/android/app/Activity.md#onCreate(android.os.Bundle)">onCreate(Bundle)</a>`
- To link the attribute for a particular widget or layout to its Javadoc in the
  widget or layout's API reference entry, use the URL for the page, and then add
  the fragment identifier `#attr_android:attribute_name`. For example, to link
  to the XML attribute `android:inputType` for the `TextView` widget, add the
  following:
  `<a href="/reference/android/widget/TextView.md#attr_android:inputType>inputType</a>`

---

<small>Portions of this page are reproduced from work created and
[shared by Google](https://dev.inf.is/readme/policies/) and used according to
terms described in the
[Creative Commons 4.0 Attribution License](https://creativecommons.org/licenses/by/4.0/).
For more information, refer to the
[original source page](https://dev.inf.is/style/code-in-text).</small>
