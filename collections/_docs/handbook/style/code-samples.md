---
title: Code Samples
key_point: How to introduce and present a code sample.
---

A sample is read by someone about to run it. Show what they should type, show
what they should expect back, and leave out everything they would have to undo.

## Intros

Introduce a sample with a complete sentence ending in a colon, saying what the
sample does rather than that it exists:

<p class="example">
  <span class="compare-better">Recommended:</span> Compare the vendored copy
  against what upstream serves:
</p>
<p class="example">
  <span class="compare-worse">Not recommended:</span> Example:
</p>
<p class="example">
  <span class="compare-worse">Not recommended:</span> Run the following command:
</p>

The second says nothing the reader cannot see. The third describes the shape of
the page instead of the work.

Where the sample is the object of the introducing sentence, no colon is needed
and none should be added:

<p class="example">
  <span class="compare-better">Recommended:</span> The queue is triggered by
  applying the <code>🚀 Status: Commit Queue</code> label.
</p>

## Show the command, not the ceremony

Give the shortest sample that actually works. Leave out flags that repeat a
default, directory changes the reader does not need, and output that carries no
information.

<p class="example">
  <span class="compare-better">Recommended:</span>
  <code>pnpm install</code>
</p>
<p class="example">
  <span class="compare-worse">Not recommended:</span>
  <code>cd ~/projects &amp;&amp; pnpm install --silent=false</code>
</p>

Every line the reader has to skip is a line they might instead run.

## Prompts

A shell prompt marks which lines are typed and which are output. Which lines
carry a `$` is settled by [Documenting Command-Line Syntax][], which owns that
rule: every line of a multi-line input, optional on a lone command, and
consistent across a page that mixes the two.

A prompt inside a fenced block is ordinary text, so a reader who copies the
block takes the `$` along with the command and has to strip it. That cost is
what the rule above is weighing when it leaves the prompt off a lone command.

Where the markup allows better, take it. The install line on the front page sets
its prompt in a `<span class="prompt">` styled `user-select: none`, so selecting
the line copies the command and leaves the `$` behind. A fenced code block
cannot do that.

Never show a root prompt (`#`) for something that does not need root.

## Placeholders and long lines

Set a value the reader supplies in a `<var>` element and say what belongs there
— see [Explaining placeholders][].

Keep lines short enough not to wrap. A wrapped command reads as two commands,
and the reader cannot tell where the break was ours and where it was theirs. If
a command genuinely cannot fit, break it at a point the shell accepts and say so
in the sentence above it.

For the notation used to show optional and repeated arguments, see [Documenting
Command-Line Syntax][].

<!-- prettier-ignore-start -->
<!-- LINK DEFINITION LABELS - START -->

[Explaining placeholders]: https://open.inf.is/docs/handbook/style/code-in-text/#explaining-placeholders
[Documenting Command-Line Syntax]: https://open.inf.is/docs/handbook/style/code-syntax/

<!-- LINK DEFINITION LABELS - END -->
<!-- prettier-ignore-end -->
