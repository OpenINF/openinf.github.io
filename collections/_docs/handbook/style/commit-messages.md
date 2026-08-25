---
title: Commit Messages
key_point: How to describe a change in the message that accompanies it.
---

A commit message is read far more often than it is written, and usually by
someone trying to work out why a line looks the way it does. Write it for them.

The rules below are checked by `nps verify.commits`, which runs on every pull
request. Nothing here is a matter of taste that the checker is unaware of: if it
passes, the message conforms.

What lands is built from these messages rather than typed again at merge time.
Labelling a pull request `🚀 Status: Commit Queue` squashes it into one commit
whose body keeps every message it contained, with the trailers gathered where
git reads them and `PR-URL` added.

## Subject

The first line names a classification and then says what the change does:

```text
🏗️🔧：let the glob see dot files
```

An ideographic colon, `：` (U+FF1A), separates the two. It is not the ASCII
colon; the wide character keeps the emoji from crowding the words after it.

- At most **50 characters**, counting an emoji as the one character it looks
  like.
- No full stop at the end. It is a title, not a sentence.
- No space after the colon.
- No pull request number. `PR-URL:` carries that, and repeating it costs six of
  the fifty characters.

Write it in the imperative, as an instruction to the codebase: _let the glob see
dot files_, not _lets_ or _letting_ or _fixed_.

## Classification

Every subject opens with a category emoji saying what area the change is in. A
second emoji may follow to say what is being done to it; leave it off when no
single action fits.

**Copy the emoji from the tables below rather than typing them.** Several have
more than one spelling that looks identical, and only the one here is
recognized.

Categories:

| Emoji | Area                     |
| :---- | :----------------------- |
| 🏷️    | meta                     |
| 🐋    | dev container            |
| 🧩    | extension ∥ plugin       |
| 🏗️    | infrastructure ∥ tooling |
| ⚕️    | community health files   |
| 🧪    | tests                    |
| ❄️    | flaky tests              |
| 💄    | CSS ∥ styling            |
| ♿    | accessibility            |
| 🌐    | internationalization     |
| 📖    | documentation            |
| 📦    | packages                 |

Actions:

| Emoji | Doing what                  |
| :---- | :-------------------------- |
| ✨    | new feature                 |
| 🔧    | bug fix                     |
| 🔥    | P0 fix                      |
| 🚀    | performance improvement     |
| ⏪    | reverting a previous change |
| ♻️    | refactoring                 |
| 🚮    | deleting code               |
| 🥼    | experimental code           |

The category comes first. `🔧：` on its own is rejected: it says what is
happening without saying where.

If `nps verify.commits` says an emoji is not the right one when it looks right,
that is the lookalike problem — copy it from the table again.

## Body

Leave the second line blank, then explain **why**, wrapped at 72 characters.
What the change does is in the diff; what it is for is not.

A line may run past 72 characters only if it cannot be wrapped, which in
practice means a bare URL.

## Trailers

Metadata goes at the end, as git trailers: one paragraph, every line of the form
`Token: value`, nothing else mixed in. In this order:

| Trailer           | What it records                            |
| :---------------- | :----------------------------------------- |
| `Co-authored-by:` | someone who wrote part of the change       |
| `Signed-off-by:`  | a Developer Certificate of Origin sign-off |
| `Assisted-by:`    | an AI tool that helped write it            |
| `PR-URL:`         | the pull request the commit landed through |
| `Fixes:`          | an issue this closes                       |
| `Refs:`           | an issue or pull request worth reading     |
| `Reviewed-by:`    | someone who approved it, as `Name <email>` |

Spell them exactly as above, including the lowercase `by`. That is what git
generates for `Signed-off-by`, what GitHub documents for `Co-authored-by`, and
what the Linux kernel established for all of them. git and GitHub would match a
token whatever its case, so this is about a history that reads the same
throughout rather than about being understood.

`PR-URL:` and `Reviewed-by:` are added when the commit lands. The others belong
in the commit as you write it.

`Signed-off-by:` is **required**, and has to name the commit's own author —
`git commit -s` writes it for you. It is how you certify the [Developer
Certificate of Origin][]: that you have the right to contribute this change. A
tool cannot do that on your behalf, and neither can a bot, which is why the
check compares the name against the author rather than merely looking for the
line.

### Disclosing an AI assistant

An AI tool that helped write a change is disclosed with `Assisted-by:`, and
takes neither a name nor an address, because it names a tool rather than a
person:

```text
Assisted-by: agent-name:model-version [tool] [tool]
```

The trailing tools are for specialized analysis tools, if any were used;
everyday ones — git, a compiler, an editor — are left out. For example:

```text
Assisted-by: Claude-Code:claude-opus-5
```

`Co-authored-by:` is for people. An assistant does not go there, and does
**not** get a `Signed-off-by:` either: only a human can certify the [Developer
Certificate of Origin][], and saying a tool helped is not a transfer of
responsibility. You are answerable for every line in your pull request, whatever
wrote it.

> [!WARNING]
>
> git only looks for trailers in the **last** paragraph of the message, and only
> if every line in it is a trailer. Three consequences, each of which has
> silently cost this project its metadata:
>
> - A space in a token — `PR URL:` instead of `PR-URL:` — is not a trailer, and
>   one unreadable line disqualifies every trailer beside it.
> - A line of dashes between the message and the metadata splits it in two. git
>   reads only one side, and which side depends on whether the line is exactly
>   `---`.
> - A `Co-authored-by:` above the final paragraph is not read at all, so the
>   co-author goes uncredited.

Check what git makes of a message rather than assuming:

```bash
git log -1 --format=%B | git interpret-trailers --parse
```

Anything that does not come back is not a trailer.

## See Also

For the emoji as they appear when opening a pull request, see the [pull request
template][].

<!-- prettier-ignore-start -->
<!-- LINK DEFINITION LABELS - START -->

[Developer Certificate of Origin]: https://developercertificate.org/
[pull request template]: https://github.com/OpenINF/openinf.github.io/blob/HEAD/.github/PULL_REQUEST_TEMPLATE.md

<!-- LINK DEFINITION LABELS - END -->
<!-- prettier-ignore-end -->
