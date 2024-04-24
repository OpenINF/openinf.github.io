## `open.inf.is` Documentation

> [!WARNING]\
> This documentation is still in **draft** stage. All information may be incomplete,
> inaccurate, outdated, or even **completely wrong**.

<br />

> [!NOTE]\
> If one is using VS Code, it is recommended to use the provided devcontainer available
> via the official [Remote Development extension][].
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

```console
# Configure Bundler setting local gem install path to avoid permission errors.
bundle config set --local path vendor/bundle
# Install the dependencies specified in the Gemfile.
bundle install
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
<http://localhost:4000>.

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

### License

<br />

&copy; The OpenINF Authors &amp; Friends. Content licensed under [Creative
Commons Attribution-NonCommercial-ShareAlike 4.0 International License][].

<!-- LINK DEFINITION LABELS - START -->

[Creative Commons Attribution-NonCommercial-ShareAlike 4.0 International License]: https://creativecommons.org/licenses/by-nc-sa/4.0/
[Remote Development extension]: https://marketplace.visualstudio.com/items?itemName=ms-vscode-remote.vscode-remote-extensionpack

<!-- LINK DEFINITION LABELS - END -->
