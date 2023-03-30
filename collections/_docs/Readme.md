# OpenINF Documentation

## Install Dependencies

Install the necessary dependencies for the documentation site by running this
command from the project workspace root (if necessary):

```shell
pnpm install
```

## Run Locally

Run this from the project workspace root:

```shell
pnpm start
```

Once the script finishes building the documentation site, you can visit it at
<http://localhost:4000>.

## Scripts

To update the links data file, run this from the project workspace root:

```shell
pnpm run docs:update-links
```

To lint all files, run this from the project workspace root:

```shell
pnpm run verify:all
```

To autofix all files, run this from the project workspace root:

```shell
pnpm run format:all
```

## License

&copy; The OpenINF Authors. Content licensed under
[Creative Commons Attribution-NonCommercial-ShareAlike 4.0 International License](https://creativecommons.org/licenses/by-nc-sa/4.0/).
