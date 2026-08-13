---
title: Commit Messages
key_point: How to describe a change in the message that accompanies it.
---

A commit message is read far more often than it is written, and usually by
someone trying to work out why a line looks the way it does. Write it for them.

The rules below are checked by `nps verify.commits`, which runs on every pull
request. Nothing here is a matter of taste that the checker is unaware of: if it
passes, the message conforms.

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

> [!IMPORTANT]\
> Five of these characters have two renderings, and the one you get by default
> is the wrong one. `🏗` and `🏗️` are the same character, but only the second
> carries U+FE0F to ask for the emoji; the first is drawn as a flat monochrome
> glyph. Copy the emoji from this page rather than typing them, and the selector
> comes along.

The five that need U+FE0F are 🏷️, 🏗️, ⚕️, ❄️ and ♻️. The rest already draw as
emoji, and must **not** carry a selector — a redundant one is a second spelling
of the same symbol.

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
| `PR-URL:`         | the pull request the commit landed through |
| `Fixes:`          | an issue this closes                       |
| `Refs:`           | an issue or pull request worth reading     |
| `Reviewed-By:`    | someone who approved it, as `Name <email>` |

Spell them exactly as above, including the capitals. git and GitHub match
trailer tokens without regard for case, so this is about a history that reads
the same throughout rather than about being understood.

`PR-URL:` and `Reviewed-By:` are added when the commit lands. The others belong
in the commit as you write it.

> [!WARNING]\
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

[pull request template]: https://github.com/OpenINF/openinf.github.io/blob/HEAD/.github/PULL_REQUEST_TEMPLATE.md

<!-- LINK DEFINITION LABELS - END -->
<!-- prettier-ignore-end -->
