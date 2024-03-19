## `open.inf.is` Documentation

<br />

> [!WARNING]<br /> This documentation is still in **draft** stage.
>
> All information may be incomplete, inaccurate, outdated, or even **completely
> wrong**.

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

You can preview your contributions before opening a pull request.

<br />

Run this from within the project workspace root directory:

```console
nps start
```

Once the script finishes building the documentation site, you can visit it at
<http://localhost:4000>.

<br /><br />

### Scripts

<br />

To update the links data file, run this from the project workspace root:

```console
nps docs.update-links
```

To lint all files, run this from the project workspace root:

```console
nps verify.all
```

To autofix all files, run this from the project workspace root:

```console
nps format.all
```

<br /><br />

### License

<br />

&copy; The OpenINF Authors. Content licensed under
[Creative Commons Attribution-NonCommercial-ShareAlike 4.0 International License](https://creativecommons.org/licenses/by-nc-sa/4.0/).
