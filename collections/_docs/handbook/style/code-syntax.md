---
title: Documenting Command-Line Syntax
key_point: Recommendations for documenting command-line tools.
google: true
---

## Placeholder variables

A placeholder stands where the reader supplies a value. Mark it with the `<var>`
element and name it in uppercase, with an underscore between words, so it cannot
be read as something to type as written. See [Explaining placeholders][] for
naming one and saying what belongs in it.

### Example

<p class="example">
  <span class="compare-better">Recommended:</span>
  <code
    >infuse source repos clone default
    <var>LOCAL_DIRECTORY_NAME</var></code
  >
</p>

## Command-line syntax

Here's how to document command-line commands and their arguments.

### Command prompt

If your command-line instructions show multiple lines of input, then start each
line of input with the `$` prompt symbol.

Don't show the current directory path before the prompt, even if part of the
instruction includes changing directories. However, if the overall context of
the command interface changes — such as from the local machine to a remote
machine — then add an additional prompt indicator, as appropriate, for the new
context.

**Examples**

Recommended:

Enter the following code into the terminal:

```console
adb devices
```

The following output appears:

```console
List of devices attached
emulator-5554  device
emulator-5556  device
```

Recommended:

```console
$ adb shell
shell@ $ screencap /sdcard/screen.png
shell@ $ exit
$ adb pull /sdcard/screen.png
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

```console
ssh-rsa [KEY-VALUE] [USERNAME]
```

### Required items (commands, arguments, etc.)

Use text without brackets or braces. Depending on the circumstances, this is
likely to be in code font.

**Examples**

<p class="example">
  <span class="compare-better">Recommended:</span>
  <code>infuse compute project-info describe</code>
</p>

<p class="example">
  <span class="compare-better">Recommended:</span>
  <code>infuse alpha functions get-logs <var>FUNCTION_NAME</var></code>
</p>

In these examples, all words and arguments are required.

### Optional arguments

Use square brackets around an optional argument.

If there's more than one optional argument, enclose each item in its own set of
square brackets.

**Example**

<p class="example">
  <span class="compare-better">Recommended:</span>
  <code
    >infuse dns <var>GROUP</var> [<var>GLOBAL_FLAG</var>]
    [<var>FILENAME</var>]</code
  >
</p>

Here <var>GROUP</var> is required, and <var>GLOBAL_FLAG</var> and
<var>FILENAME</var> are not.

### Mutually exclusive arguments

Use braces (also known as _curly braces_) to indicate that the user must choose
one — and only one — of the items inside the braces. Use vertical bars (also
known as _pipes_) to separate the items. There can be more than two mutually
exclusive choices, separated from each other by pipes.

**Examples**

<p class="example">
  <span class="compare-better">Recommended:</span>
  <code>{<var>FILE_1</var>|<var>FILE_2</var>}</code>
</p>

Name one of the two, and not both.

<p class="example">
  <span class="compare-better">Recommended:</span>
  <code
    >infuse functions deploy {--source <var>REPOSITORY</var>|--bucket
    <var>BUCKET</var>}</code
  >
</p>

The braces make the pair required and the pipe admits only one of them, so a
deployment names either a repository or a bucket, never the two together.

### Arguments that can repeat

Use an ellipsis (...) to indicate that the user can specify multiple values for
the argument.

**Example**

<p class="example">
  <span class="compare-better">Recommended:</span>
  <code>infuse dns <var>GROUP</var> [<var>GLOBAL_FLAG</var> ...]</code>
</p>

Here the reader may give <var>GLOBAL_FLAG</var> more than once.

<!-- prettier-ignore-start -->
<!-- LINK DEFINITION LABELS - START -->

[Explaining placeholders]: https://open.inf.is/docs/handbook/style/code-in-text/#explaining-placeholders

<!-- LINK DEFINITION LABELS - END -->
<!-- prettier-ignore-end -->
