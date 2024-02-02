# API reference code comments

**Key Point:** Provide a complete API reference, describing all relevant aspects
of the API, and putting code-related terms in code font.

When you're documenting an API, provide a complete API reference, typically
generated from source code using doc comments that describe all public classes,
methods, constants, and other members.

Use the basic guidelines in this document as appropriate for a given programming
language. This document doesn't specify how to mark up doc comments; for more
information, refer to the specific style guide for each programming language.

This page also doesn't cover web APIs. The style suggestions below may be useful
to keep in mind while documenting web APIs, but this page doesn't discuss how to
write about resources or collections.

## Documentation basics

The API reference **must** provide a description for each of the following:

- Every class, interface, struct, and any other similar member of the API (such
  as union types in C++).
- Every constant, field, enum, typedef, etc.
- Every method, with a description for each parameter, the return value, and any
  exceptions thrown.

The following are **extremely strong suggestions**. In some cases, they don't
make sense for a particular API or in a specific language, but in general,
follow these guidelines:

- On each unique page (for a class, interface, etc.), include a code sample
  (~5-20 lines) at the top.
- Put all API names, classes, methods, constants, etc. in code font, and link
  each name to the corresponding reference page. Most document generators do
  this automatically for you.
- Put string literals in code font, and enclose them in double quotation marks.
  For example, XML attribute values might be `"wrap_content"` or `"true"`.
- Put parameter names in italic. For example, when you refer to the parameters
  of a method like `doSomething(Uri data, int count)`, italicize the names
  _data_ and _count_.
- Make sure that the spelling of a class name in documentation matches the
  spelling in code, with capital letters and no spaces (for example,
  `ActionBar`).

  - Don't make class names plural (`Intents`, `Activities`); instead, add a
    plural noun (`Intent` objects, `Activity` instances).
  - However, if a class has a name that's a common term, you can refer to it
    with the corresponding English word, in lowercase and _not_ in code font
    (activities, action bar).

## Classes, interfaces, structs

In the first sentence of a class description, briefly state the intended purpose
or function of the class or interface with information that can't be deduced
from the class name and signature. In additional documentation, elaborate on how
to use the API, including how to invoke or instantiate it, what some of the key
features are, and any best practices or pitfalls.

Many doc tools automatically extract the first sentence of each class
description for use in a list of all classes, so make the first sentence unique
and descriptive, yet short. Additionally:

- Do not repeat the class name in the first sentence.
- Do not say "this class will/does ...."
- Do not use a period before the actual end of the sentence, because some doc
  generators naively terminate the "short description" at the first period. For
  example, some generators terminate the sentence if they see "e.g.", so use
  "for example" instead.

The following example is the first sentence of the description for Android's
[`ActionBar`](http://developer.android.com/reference/android/app/ActionBar.md)
class:

> _A primary toolbar within the activity that may display the activity title,
> application-level navigation affordances, and other interactive items._

## Members

Make descriptions for members (constants and fields) as brief as possible. Be
sure to link to relevant methods that use the constant or field.

For example, here's the description for the `ActionBar` class's
[`DISPLAY_SHOW_HOME`](http://developer.android.com/reference/android/app/ActionBar.md#DISPLAY_SHOW_HOME)
constant:

> _Show 'home' elements in this action bar, leaving more space for other
> navigation elements. This includes logo and icon._

> _See also: `setDisplayOptions(int)`, `setDisplayOptions(int, int)`_

## Methods

In the first sentence for a method description, briefly state what action the
method performs. In subsequent sentences, explain why and how to use the method,
state any prerequisites that must be met before calling it, give details about
exceptions that may occur, and specify any related APIs.

Document any dependencies (such as
[Android permissions](http://developer.android.com/guide/topics/security/permissions.md))
that are needed to call the method, and how the method behaves if such a
dependency is missing (for example, "the method throws a
[SecurityException](http://developer.android.com/reference/java/lang/SecurityException.md)"
or "the method returns null").

For example, here's the description for Android's
[Activity.isChangingConfigurations()](<http://developer.android.com/reference/android/app/Activity.md#isChangingConfigurations()>)
method:

> _Checks whether this activity is in the process of being destroyed in order to
> be recreated with a new configuration. This is often used in `onStop()` to
> determine whether the state needs to be cleaned up or will be passed on to the
> next instance of the activity via `onRetainNonConfigurationInstance()`._

Use present tense for all descriptions. For example:

- _Adds a new bird to the ornithology list._
- _Returns a bird._

### Description

- If a method performs an operation and returns some data, start the description
  with a verb describing the operation. For example:

  - _Adds a new bird to the ornithology list and returns the ID of the new
    entry._

- If it's a "getter" method and it returns a boolean, start with "Checks whether
  ...."

- If it's a "getter" method and it returns something other than a boolean, start
  with "Gets the ...."

- If it has no return value, start with a verb like one of the following:

  - Turning on an ability or setting: "Sets the ...."
  - Updating a property: "Updates the ...."
  - Deleting something: "Deletes the ...."
  - Registering a callback or other element for later reference: "Registers
    ...."
  - For a callback: "Called by ...." (Usually for a method that's named starting
    with "on", such as `onBufferingUpdate`.) For example, "Called by Android
    when ...." Then, later in the description: "Subclasses implement this method
    to ...."

- If it's a convenience method that constructs the class object, start with
  "Creates a ...."

### Parameters

For parameter descriptions, follow these guidelines:

- Capitalize the first word, and end the sentence or phrase with a period.

- Begin descriptions of non-boolean parameters with "The" or "A" if possible:

  - _The ID of the bird you want to get._
  - _A description of the bird._

- For boolean parameters for requesting an action, start sentences with "If true
  ..." and "If false ...." For example:

  - _If true, turn traffic lines on. If false, turn them off._

- For boolean parameters for setting the state of something (not making a
  request), use the format "True if ...; false otherwise." For example:

  - _True if the zoom is set; false otherwise._

- In this context, don't put the words "true" and "false" in code font or
  quotation marks.

### Return values

Be as brief as possible in the return value's description; put any detailed
information in the class description.

- If the return value is anything other than a boolean, start with "The ...."
  For example:

  - _The bird specified by the given ID._

- If the return value is a boolean, use the format "True if ...; false
  otherwise." For example:

  - _True if the bird is in the sanctuary; false otherwise._

### Exceptions

In languages where the reference generator automatically inserts the word
"Throws", begin your description with "If ..." For example:

> _If no key is assigned._

Otherwise, begin with "Thrown when ...":

> _Thrown when no key is assigned._

### Deprecations

When something is deprecated, tell the user what to use as a replacement. (If
you track your API with version numbers, mention which version it was first
deprecated in.)

Only the first sentence of a description appears in the summary section and
index, so put the most important information there. Subsequent sentences can
explain why it was deprecated, along with any other information that's useful
for a developer using your API.

If a method is deprecated, tell the reader what to do to make their code work.

#### Examples

> _Deprecated. Use #CameraPose instead._

> _Deprecated. Access this field using the `getField()` method._

---

<small>Portions of this page are reproduced from work created and
[shared by Google](https://developers.google.com/readme/policies/) and used
according to terms described in the
[Creative Commons 4.0 Attribution License](https://creativecommons.org/licenses/by/4.0/).
For more information, refer to the
[original source page](https://developers.google.com/style/api-reference-comments).</small>
