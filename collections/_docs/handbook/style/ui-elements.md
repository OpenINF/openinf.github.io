# UI elements and interaction

**Key Points:** When you're documenting tasks that involve the user interface
(UI), focus on the task, not how the user interacts with the UI element. If you
do document elements of the UI, put UI element names in bold, and use
appropriate nouns and verbs to describe how to interact with them.

## Focus on the task

When practical, state instructions in terms of what the user should accomplish,
rather than focusing on the widgets and gestures. By avoiding reference to UI
elements, you help the user understand the purpose of an instruction, and it can
help future-proof procedures.

However, know the audience and understand the context. There are many cases
where the point of a procedure is to guide readers through elements on a page.

Not recommended: Click the REFRESH button.

Better: Click the **Refresh** button.

Recommended if practical: Refresh the page.

Not recommended: Click the zippy to expand the **Advanced options** section.

Better: To expand the **Advanced options** section, click the arrow_right
expander arrow.

Recommended if practical: Expand the **Advanced options** section.

The rest of this page focuses on scenarios where you've decided it's useful to
explicitly discuss UI elements.

## Formatting names of UI elements

When referring to any UI element by name, put its name in boldface, using the
`<b>` element in HTML or `**` in Markdown. This includes names for buttons,
menus, dialogs, windows, list items, or any other feature in the page or console
that has a visible name.

**Note:** The reason for using the
`<[b](https://html.spec.whatwg.org/multipage/semantics.md#the-b-element)>`
element is that in modern HTML, `<b>` connotes text to which you want to draw
visual attention, whereas
`<[strong](https://html.spec.whatwg.org/multipage/semantics.md#the-strong-element)>`
indicates strong importance.

Don't make an official feature name or product name bold, except when it
directly refers to an element in the page that uses the name (such as a window
title or button name).

In most cases, follow the capitalization as it appears in the page. However, if
labels are inconsistent or they're all uppercase, use sentence case.

Not recommended: In the New Project window, select "New Activity", and then
click the "Next" button.

Not recommended: Click **REFRESH**.

Recommended: In the **New Project** window, select the **New Activity**
checkbox, and then click **Next**.

Recommended: Click **Refresh**_refresh_.

## Terminology and usage

A user interface can contain a variety of UI elements. In general, focus on the
feature and its functionality, not the UI element. If you think it adds clarity
for the reader, add the name of the UI element. For example, both of the
following sentences are valid:

Recommended: Go to **File** > **Tools**.

Recommended: In the **File** menu, click **Tools**.

Following are some definitions of the terms to use when referring to UI
elements.

### Windows, dialogs, and panes

Most often, a window is the entire application window in a desktop environment.
However, it can also refer to modular application elements that you can open and
close. For example, in Android Studio, several windows are available in the
**View > Tool Windows** menu.

Not recommended: In the **MyApp** page, click **Edit**.

Recommended: In the **MyApp** window, click **Edit**.

A dialog is a smaller window that is usually detached from the main application
window and appears in front of the window.

Not recommended: In the **Welcome** pop-up window, click **OK**.

Recommended: In the **Welcome** dialog, click **OK**.

A pane is similar to a window inside the application—it's a distinct rectangular
region of a window. However, a pane is tightly coupled to the other UI regions
around it and usually cannot be hidden on its own, whereas a window is
distinctly separate and can be hidden. Do not use terms such as panel, section,
area, or column to refer to a pane.

Not recommended: In the **Create service account** panel, click **New**.

Recommended: In the **Create service account** pane, click **New**.

### Menu bar

In a desktop application, the menu bar appears at the top of the window or the
top of the screen; it's a set of menus (such as **File** or **Edit**), each of
which is a set of related commands and/or nested submenus.

To refer to an item in a menu, use the term "command," not "choice," "menu
item," or "option." Exception: if you're documenting how to build an interface,
you may use "menu item."

To refer to a menu, use the form "the **Label** menu."

To tell the reader where to find a command in a menu or submenu, use arrow
notation (`>`). Put a nonbreaking space (`&nbsp;`) before each greater-than
sign.

Recommended: Select **View > Tools > Developer Tools**.

Don't bold each menu name separately; instead, enclose the entire sequence in a
single bold element (`<b>`...`</b>`).

This notation is useful for abbreviating a longer phrase like "In the **File**
menu, select **Open**." However, this notation applies only to menu items. Don't
use it to describe a combination of different UI elements.

Not recommended: Select **MyApp** > **Preferences** > **Languages** > **+** >
**CSS**.

Recommended: Select **MyApp** > **Preferences** and then select the
**Languages** preference pane. Below the **Custom Language Preferences** table,
click **Add** ![](images/icon-add.png) and select **CSS**.

### Toolbar

A toolbar is a set of buttons for common user actions. A toolbar button that
includes a menu is called a menu button. Refer to the toolbar by name if you
think the user needs help finding a button.

Recommended: In the **Dashboard** toolbar, click **Edit**.

Recommended: Click **Edit**.

### Buttons and icons

A button initiates an action when clicked (or tapped, in the case of a
touchscreen). To refer to a button, use the button's label.

Not recommended: Click the "OK" button.

Recommended: Click **OK**.

An icon is a symbol or image that represents an object or a function. An icon
can be a button as well. If the button includes an icon, write the name of the
button as shown in the tooltip, and add the button icon immediately after the
name. If you are unsure of the name of the icon, inspect the element to use the
`aria-label`. For more information, see
[Using an aria-label](https://www.w3.org/TR/WCAG20-TECHS/ARIA14.md).

If a button with an icon doesn't include a tooltip, submit a bug report
requesting that a tooltip be added. Tooltips are crucial for accessibility, and
for documentation and discoverability in general.

Not recommended: Click the ![hammer icon](images/icon-add.png) icon.

Recommended: Click **Add** ![](images/icon-add.png).

If a UI element name ends with an ellipsis (...), leave out the ellipsis.

Not recommended: Click **Browse ...**.

Recommended: Click **Browse**.

Don't use directional language to orient the reader, such as _above_, _below_,
or _right-hand side_. Phrases like those don't work well for accessibility or
for localization. If a UI element is hard to find, provide a screenshot.

Not recommended: In the left-side panel, click the button with three lines.

Recommended: Click **Menu** _menu_.

### Tab

A tab is a navigation element that looks like a file tab. To refer to a tab, use
the form "the **Label** tab."

Recommended: Select **Tools > Options**, and then click the **Edit** tab.

### Text box

A text box is a box that the user can type in. Use _box_ and the form "the
**Label** box." Format the text that the user types using the `<kbd>` element in
HTML, or using code formatting (monospace) in other markup.

In INF Use documentation, use _field_ instead of _box_.

Recommended: In the <b>Owner</b> box, enter your name.

Recommended: In the <b>Name</b> box, enter <kbd>wsfc-1</kbd>.

Recommended: In the \*\*Name\*\* box, enter \`wsfc-1\`.

Recommended: In the \*\*Instance\*\* field, specify a value less than 64
characters long.

### List box, combo box, and spin box

A list box is a box that offers the user a list of items. To refer to a list
box, use the form "the **Label** drop-down list" or "the **Label** box,"
whichever is clearer.

Recommended: In the **Item** drop-down list, select **Desktop**.

A combo box is a combination of a text box and a list box. To refer to a list
box, use the form "the **Label** box." To refer to entering a value into a combo
box, use the verbs "type or select" or "enter."

Recommended: In the **Font** box, type or select the font you want to use.

A spin box is a box that lets the user choose a value by clicking arrows or by
typing. To refer to a spin box, use the form "the **Label** box." To refer to
entering a value into a spin box, use the verb "enter."

Recommended: In the **Font Size** box, enter a font size.

### Checkbox

A checkbox is a small box that indicates whether an option is on or off. To
refer to a checkbox, use the form "the **Label** checkbox." Be wary of using the
verb "check," which can be ambiguous; it's often best to use "select" instead.

Recommended: Select the **Automatically check for updates** checkbox.

Recommended: Clear the **Bookmarks** checkbox.

### Radio button

A radio button is a small button used to choose one item from a group of
mutually exclusive options. To refer to a radio button, use the radio button's
label, or refer to the group of buttons by its label.

Recommended: Click **Do not remember passwords**.

Recommended: Click your preferred **Startup mode**.

### Expander arrow

An expander arrow is the UI element used to expand or collapse a section of
navigation or content. Avoid referring to these explicitly in documentation, but
when you do, use the terms _expander arrow_ and _expandable section_ rather than
terms like expando or zippy.

Not recommended: Click the zippy to expand the **Advanced options** section.

Recommended: To expand the **Advanced options** section, click the arrow_right
expander arrow.

## Pressing and typing keyboard keys

To indicate that the user should press or type a given keyboard key or
combination, use the `<kbd>` element. If you're working with non-HTML markup,
use monospace formatting, which is how `<kbd>` renders. If you're working in
Markdown, enclose the key name in backticks (`` ` ``).

To refer to a keyboard key, use the key's name. If that's ambiguous, use the
form "the Key key."

Recommended: Press Esc.

Recommended: Press the Esc key.

Spell out the names of modifier keys such as Command, Control, Option, and
Shift. Don't use symbols for those keys. To refer to a key combination, use the
form "Modifier+Key."

Recommended: Press Control+V.

When the user may be on either Windows or Mac, put the Mac shortcut in
parentheses after the Windows shortcut.

Not recommended: To copy, press Ctrl+C (⌘+C).

Recommended: To copy, press Control+C (or Command+C on Mac).

To refer to a key or combination that uses the Shift key, use the form
"Modifier+Shift+Key."

Recommended: Press Control+Shift+?.

Spell out the names of characters that could be confusing in a keyboard
shortcut, such as comma, hyphen, period, and plus.

To refer to a keyboard shortcut, use either "keyboard shortcut" or "key
combination."

To refer to pressing a key or combination to cause an action to occur, use the
verb "press." To refer to typing a key or combination as part of text, use the
verbs "enter" or "type."

## Verbs glossary

To describe an action in the page, generally use the following verbs:

Click

When the environment is probably a desktop with a mouse, use "click" for most
targets, such as buttons, links, list items, and radio buttons.

Not recommended: Click on **OK**.

Recommended: Click **OK**.

Hyphenate "right-click," "left-click," and "double-click."

When a click or tap action reveals a collapsed list, you can write "click to
expand" or simply "expand."

It's okay to write "click in" when referring to a region that needs focus
("click in the window"), but not when referring to a control or a link.

Drag

Use "drag," not "click and drag" and not "drag and drop," though you may use
"drag-and-drop" as an adjective.

Recommended: Drag the user to the **Authorized** box.

Enter, type

Use either of these verbs when referring to the user entering text.

Recommended: In the **Owner** box, enter your name.

Recommended: In the **Size** box, type or select a font size.

Hold the pointer over

Use this verb phrase when referring to the user holding the pointer over a UI
element, but not clicking the UI element. (In common parlance this is sometimes
called _hovering_, but we don't use that word.) This action involves waiting for
the UI element to react. For example, waiting for a toolip to open or waiting
for a submenu to open.

Not recommended: In the **Admin** menu, hover over **File**, and then click
**New**.

Recommended: In the **Admin** menu, hold the pointer over **File**, and then
click **New**.

To refer to the action of pointing the mouse pointer (focus), use "point to."
This action doesn't imply a length of time waiting for the UI element to react
to user action. This is similar to the action "hold the pointer over" (hover).
In most cases, it's better to use the verb phrase "hold the pointer over"
because we want the user to wait for the UI element to react.

Press

Use when referring to pressing a key or combination to cause an action to occur.

Recommended: Press Control+C (or Command+C on Mac).

Select

Use when referring to a menu command. You can use it instead of "click" in some
cases, such as when choosing a list item or when the action highlights an item
that is followed by another action. You can also use it instead of "check" for
checkboxes.

Recommended: Select **File > New**.

Recommended: In the **Font** drop-down list, select **Roboto**.

Recommended: In the **Available qualifiers** list, select **Locale** and then
click **Add**.

Tap

Use instead of "click" when the environment is definitely a touch device.

Recommended: Tap **OK**.

Turn on, turn off

When the sentence is not a procedural instruction, use phrases like "turn on"
and "turn off" instead of "enable" and "disable." It's also okay to use "toggle"
for a control that switches back and forth between on and off states.

Recommended: To turn on Magic Mode, follow these steps.

Recommended: You can toggle Magic Mode in the **Settings** window.

See also the [word list](word-list.md).

---

<small>Portions of this page are reproduced from work created and
[shared by Google](https://developers.google.com/readme/policies/) and used
according to terms described in the
[Creative Commons 4.0 Attribution License](https://creativecommons.org/licenses/by/4.0/).
For more information, refer to the
[original source page](https://developers.google.com/style/ui-elements).</small>
