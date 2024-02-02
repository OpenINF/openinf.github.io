# Procedures

**Key Point:** A procedure is a sequence of numbered steps for accomplishing a
task.

## Introductory sentences

In most cases, introduce a procedure with an introductory sentence. Don't simply
repeat the heading. This introductory sentence should provide additional context
to the reader. If no context is needed, you can skip the introductory sentence.

The sentence can end with a colon or a period. Use a colon if it immediately
precedes the procedure. Use a period if there's more material (such as a note
paragraph) between the introduction and the procedure.

Don't introduce a procedure with a partial sentence that's completed by the
numbered steps.

Not recommended: To customize the buttons:

Recommended: To customize the buttons, follow these steps:

## Single-step procedures

When a procedure consists of just one step, fold the step into the introductory
sentence.

Not recommended:

To clear (flush) the entire log, follow this step:

1. Click **Clear logcat**.

Also not recommended:

To clear (flush) the entire log, follow this step:

- Click **Clear logcat**.

Recommended:

To clear (flush) the entire log, click **Clear logcat**.

## Sub-steps in numbered procedures

In a numbered procedure, sub-steps are labeled with lowercase letters, and
sub-sub-steps get lowercase Roman numerals.

When a step has sub-steps, treat the step like an
[introductory sentence](procedures.md#introductory-sentences): put a colon or a
period at the end of the step, as appropriate.

Recommended:

1. First, do foo, as follows:
   1. Do the first part of foo.
   2. Do the second part of foo. There is no third part.
      1. Do the first sub-part of foo part two.
      2. Do the second sub-part of foo part two.
2. Next, do bar.

## Multi-action procedures

In general, use one step per action. However, you can combine small actions into
one step, using arrows (`>`) for sequential menu selections.

Recommended:

1. Click **Next** > **Finish**.

Also recommended:

1. Click **File** > **New** > **Document**.

Don't make the steps too long. If they feel too long, consider splitting them
into multiple steps.

## Multiple procedures for the same task

In general, if there is more than one way to complete a task, pick one procedure
to document. If all of the procedures need to be documented, use separate
headings or pages or tabs to separate the procedures to make it clear to the
reader that this is an alternative way to complete the same task.

The following guidelines can help you choose which procedure to document:

- Choose a procedure that lets readers do all the steps using only a keyboard.
- Choose the shortest procedure.
- Choose a procedure that uses a programming language that the majority of your
  audience is familiar with.

## Repetitive procedures

Use concise procedures to avoid repetitiveness and overwhelming the user with
too much bolding of UI elements.

Not recommended:

1. Click **Enter**. The **New File** dialog appears.
2. In the **New File** dialog, click **Next**.

Recommended:

1. Click **Enter**.
2. In the **New File** dialog that appears, click **Next**.

Avoid repeating procedures. Instead, reference those procedures and link to
them.

Recommended:

1. Create a user as you did in the previous step.

Also recommended:

1. [Create a user as you did in the previous step.](procedures.md#)

## More guidelines for writing procedures

- If the user must press **Enter** after a step, then include that instruction
  as part of the step.

  Not recommended:

  1. Click the search box in the top-right corner and type custom function.
  2. Press **Enter**.

  Recommended:

  1. Click the search box in the top-right corner, then type custom function and
     press **Enter**.

- State the purpose of the action before stating the action.

  Not recommended:

  1. Click **File** > **New** > **Document** to start a new document.

  Recommended:

  1. To start a new document, click **File** > **New** > **Document**.

- State the location of the action before stating the action. If there are
  multiple headings associated with a set of procedures, restate the location of
  the action in the first step of each procedure, even if the location is the
  same as in the previous procedure.

  Not recommended:

  1. Click **File** > **New** > **Document** in Google Docs.

  Recommended:

  1. In Google Docs, click **File** > **New** > **Document**.

- Don't use "please."

  Not recommended:

  1. To open a document, please click **File** > **Open**.

  Recommended:

  1. To open a document, click **File** > **Open**.

- For an optional step, type "Optional:" as the first word of the step.

  Recommended:

  1. Optional: Type an arbitrary string, to be delivered to the target address
     with each notification delivered over this channel.

- Use complete sentences.

- Use parallel structure.

- When there's more than one way to do something, give only the best way. Giving
  alternate ways can confuse users.

- Don't use directional language to orient the reader, such as _above_, _below_,
  or _right-hand side_. This type of language doesn't work well for
  accessibility or for localization. If a UI element is hard to find, provide a
  screenshot.

  Not recommended: In the left-side panel, click the button with three lines.

  Recommended: Click **Menu** _menu_.

---

<small>Portions of this page are reproduced from work created and
[shared by Google](https://developers.google.com/readme/policies/) and used
according to terms described in the
[Creative Commons 4.0 Attribution License](https://creativecommons.org/licenses/by/4.0/).
For more information, refer to the
[original source page](https://developers.google.com/style/procedures).</small>
