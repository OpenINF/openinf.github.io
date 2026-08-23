## `open.inf.is` Documentation

> [!WARNING]
>
> This documentation is still in **draft** stage. All information may be
> incomplete, inaccurate, outdated, or even **completely wrong**.

<br />

> [!NOTE]
>
> If one is using VS Code, it is recommended to use the provided devcontainer
> available via the official [Remote Development extension][].
>
> One may skip dependency installation in this case.

<br /><br />

### Install Dependencies

<br />

Install the necessary dependencies for the documentation site by running this
command from the project workspace root (if necessary):

```console
pnpm install
```

<br /><br />

### Running Locally

One can preview contributions before opening a pull request.

<br />

Run this from within the project workspace root directory:

```console
nps start
```

Once the script finishes building the documentation site, one may visit it at
<http://localhost:3000>.

<br /><br />

### Scripts

<br />

To lint all files, run this from the project workspace root:

```console
nps verify.all
```

To autofix all files, run this from the project workspace root:

```console
nps format.all
```

To build for production (or preview), run this from the project workspace root:

```console
nps build
```

<br /><br />

### Handbook pages adapted from Google

<br />

Much of the style handbook is adapted from the [Google developer documentation
style guide][], which is offered under [CC BY 4.0][]. That license asks for
credit, so a page carrying any of it says where it came from:

```yaml
---
title: Colons
key_point: A colon indicates that closely-related information follows.
google: true
---
```

`google: true` reads the source page off the filename, so `colons.md` credits
`developers.google.com/style/colons`. Where the two do not line up, name
Google's own slug instead, and the credit follows it:

```yaml
google: inclusive-documentation
```

Leave the key off a page that is ours, and no credit is shown. The footer builds
itself either way.

<br /><br />

### License

<br />

&copy; The OpenINF Authors &amp; Friends. Content licensed under [Creative
Commons Attribution-NonCommercial-ShareAlike 4.0 International License][].

<!-- prettier-ignore-start -->
<!-- LINK DEFINITION LABELS - START -->

[CC BY 4.0]: https://creativecommons.org/licenses/by/4.0/
[Creative Commons Attribution-NonCommercial-ShareAlike 4.0 International License]: https://creativecommons.org/licenses/by-nc-sa/4.0/
[Google developer documentation style guide]: https://developers.google.com/style
[Remote Development extension]: https://marketplace.visualstudio.com/items?itemName=ms-vscode-remote.vscode-remote-extensionpack

<!-- LINK DEFINITION LABELS - END -->
<!-- prettier-ignore-end -->
