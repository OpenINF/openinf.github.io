# Verb forms in reference documentation

**Key Point:** In reference docs describing a method, use the form "Creates foo"
rather than "Create foo."

When you're writing reference documentation for a method, phrase the main method
description in terms of what it does ("Gets," "Lists," "Creates," "Searches"),
rather than what the developer would use it to do ("Get," "List," "Create,"
"Search").

It's a subtle distinction that manifests mostly in whether the initial verb in
the description has an "-s" at the end or not.

#### Examples

Not recommended: tasks.insert: Create a new task on the specified task list.

Recommended: tasks.insert: Creates a new task on the specified task list.

In a specification that's aimed at _implementors_ of an API, it may make more
sense to use the verb form without the "-s"; in that context, you're telling the
reader what their implementation of the method should do ("create a new task"),
whereas in reference docs aimed at developers you're telling them what the
existing method does ("creates a new task").

---

<small>Portions of this page are reproduced from work created and
[shared by Google](https://developers.google.com/readme/policies/) and used
according to terms described in the
[Creative Commons 4.0 Attribution License](https://creativecommons.org/licenses/by/4.0/).
For more information, refer to the
[original source page](https://developers.google.com/style/reference-verbs).</small>
