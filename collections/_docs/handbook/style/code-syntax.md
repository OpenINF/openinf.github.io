---
title: Documenting Command-Line Syntax
key_point: Recommendations for documenting command-line tools.
---

## Placeholder variables

To indicate a placeholder variable, use the `<var>` element. (To execute the
command, the reader replaces the placeholder with an actual value.)

### Example

Recommended: `infuse source repos clone default local-directory-name`

For information about how to discuss placeholders in procedure steps, see
[Explaining placeholders][].

## Command-Line Syntax

Here's how to document command-line commands and their arguments.

### Command prompt

If your command-line instructions show multiple lines of input, then start each
line of input with the `$` prompt symbol.

Don't show the current directory path before the prompt, even if part of the
instruction includes changing directories. However, if the overall context of
the command interface changes—such as from the local machine to a remote
machine—then add an additional prompt indicator, as appropriate, for the new
context.

**Examples**

Recommended:

Enter the following code into the terminal:

```console
adb devices
```

The following output appears:

```console
List of devices attached emulator-5554 device emulator-5556 device
```

Recommended:

```console
$ adb shell shell@
$ screencap /sdcard/screen.png shell@
$ exit
$ adb pull
/sdcard/screen.png
```

When you're showing a one-line command, the command prompt (the `$` symbol) is
optional. However, if your page includes both multi-line and one-line commands,
then we recommend using the command prompt for all of the commands on the page,
for consistency.

If your command-line instructions include a combination of input and output
lines, we recommend using separate code blocks for input and output.

**Example**

Recommended:

```console
cat ~/.ssh/my-ssh-key.pub
```

The terminal shows your public key in the following form:

ssh-rsa \[KEY-VALUE] \[USERNAME]

### Required items (commands, arguments, etc.)

Use text without brackets or braces. Depending on the circumstances, this is
likely to be in code font.

**Examples**

Recommended: `infuse compute project-info describe`

Recommended: `infuse alpha functions get-logs function-name`

In these examples, all words and arguments are required.

### Optional arguments

Use square brackets around an optional argument.

If there's more than one optional argument, enclose each item in its own set of
square brackets.

**Example**

Recommended: `infuse dns group [global-flag] [filename]`

In this example, group is required but global-flag and filename are optional.

### Mutually exclusive arguments

Use braces (also known as _curly braces_) to indicate that the user must choose
one—and only one—of the items inside the braces. Use vertical bars (also known
as _pipes_) to separate the items. There can be more than two mutually exclusive
choices, separated from each other by pipes.

**Examples**

- Recommended: `{file1|file2}`

  In this example, choose either file1 or file2.

- Recommended:
  `{**--source** cloud-source **--source-url** source-url | **--bucket** bucket [**--source** local-source]}`

  In this example, there are also two options:

  - Left side of pipe: If the source code is deployed from a cloud repository,
    **--source** cloud-source **--source-url** source-url is required.
  - Right side of pipe: If the source code is in a local directory:
    - **--bucket** bucket is required.
    - **--source** local-source is optional, as specified by the square
      brackets.

### Arguments that can repeat

Use an ellipsis (...) to indicate that the user can specify multiple values for
the argument.

**Example**

Recommended: `infuse dns group [global-flag ...]`

In this example, the user can specify multiple instances of the optional
parameter global-flag.

<!-- LINK DEFINITION LABELS - START -->

[Explaining placeholders]: ./code-in-text.md#explaining-placeholders

<!-- LINK DEFINITION LABELS - END -->
