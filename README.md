## `open.inf.is`

> The front door to everything OpenINF makes

[![Lint and test][lint-badge-img]][lint-badge-url]
[![Deploy][deploy-badge-img]][deploy-badge-url]

<br />

The source of the OpenINF portal: the community website, the news archive, the
OpenINF SDK reference documentation, and the style handbook. One [Eleventy][]
build serves them all.

The portal is in its infancy, so expect gaps and rough edges. Finding one is a
good reason to open a pull request.

<br /><br />

### Quick start

<br />

Open the repository in the [dev container][] and the toolchain is already
installed. Otherwise, install Node and pnpm at the versions [package.json][]
pins.

```console
pnpm install
pnpm start
```

`pnpm start` prints the address to open, and rebuilds as you edit. `pnpm build`
makes a production build, and `pnpm test` runs the checks a pull request has to
pass.

<br /><br />

### Where things live

<br />

| Path                      | What is there                         |
| :------------------------ | :------------------------------------ |
| `collections/_pages/`     | Home, about, docs, and news pages     |
| `collections/_posts/`     | The news archive, one file per entry  |
| `collections/_docs/`      | Documentation, and the style handbook |
| `_layouts/`, `_includes/` | Liquid templates and partials         |
| `_assets/`                | Sass, browser JavaScript, and images  |
| `build/`                  | The build and verify tasks            |

The code of conduct, contributing guide, security policy, and support document
are not edited here. They come from [OpenINF/.github][] as the site builds.

<br /><br />

### Contributing

<br />

Pull requests are welcome. A typo fix needs no ceremony; anything larger is
worth an issue first, so nobody writes the same change twice.

Two documents are worth reading beforehand: the [contributing guide][], and the
[style handbook][], which covers prose, code samples, and commit messages.

If you spot something to fix but cannot patch it yourself, [open an issue][].

<br /><br />

### License

<br />

| What                           | License                              |
| :----------------------------- | :----------------------------------- |
| Source code                    | `MIT OR Apache-2.0 OR BlueOak-1.0.0` |
| OpenINF SDK reference docs     | CC BY-NC-SA 4.0                      |
| Code samples inside those docs | 0BSD                                 |
| Style handbook                 | CC BY-SA 4.0                         |

Read the license that applies before reusing anything here, because source,
docs, and the handbook do not share one. Source files name theirs in an
`@license` tag, and the docs and the handbook each keep the full text beside
them.

<br /><br />

---

<br />

<div align="center">

[Roadmap][] | [Development][] | [Issue Tracker][] | [Changelog][] | [Credits][]

<br />

!['Project Type: Prototype'][project-type-badge--shields]
!['Prototyping Scheme: Evolutionary'][prototyping-scheme-badge--shields]
!['Status: Under construction'][project-status-badge--shields]

<br /><br />

<a title="The OpenINF website" href="https://open.inf.is" rel="author">
  <img
    alt="The OpenINF logo"
    height="32px"
    width="32px"
    src="https://openinf.github.io/assets/img/logogram-color.svg"
  />
</a>

</div>

<br /><br />

<!-- prettier-ignore-start -->
<!-- LINK LABEL DEFINITIONS - START -->

[Changelog]: https://github.com/OpenINF/openinf.github.io/commits/live 'Changelog'
[Credits]: https://github.com/OpenINF/openinf.github.io/graphs/contributors 'Credits'
[Development]: ./collections/_docs/README.md 'Development'
[Eleventy]: https://www.11ty.dev/
[Issue Tracker]: https://github.com/OpenINF/openinf.github.io/issues 'Issue Tracker'
[OpenINF/.github]: https://github.com/OpenINF/.github
[Roadmap]: https://github.com/OpenINF/openinf.github.io/issues 'Roadmap'
[contributing guide]: https://github.com/OpenINF/.github/blob/HEAD/CONTRIBUTING.md
[dev container]: ./.devcontainer/devcontainer.json
[open an issue]: https://github.com/OpenINF/openinf.github.io/issues
[package.json]: ./package.json
[style handbook]: ./collections/_docs/handbook/style/
[deploy-badge-img]: https://github.com/OpenINF/openinf.github.io/actions/workflows/deploy.yml/badge.svg?branch=live
[deploy-badge-url]: https://github.com/OpenINF/openinf.github.io/actions/workflows/deploy.yml
[lint-badge-img]: https://github.com/OpenINF/openinf.github.io/actions/workflows/lint-and-test.yml/badge.svg
[lint-badge-url]: https://github.com/OpenINF/openinf.github.io/actions/workflows/lint-and-test.yml
[project-status-badge--shields]: https://img.shields.io/badge/status-under%20construction-yellow.svg
[project-type-badge--shields]: https://img.shields.io/badge/type-prototype-blue.svg
[prototyping-scheme-badge--shields]: https://img.shields.io/badge/scheme-evolutionary-blue.svg

<!-- LINK LABEL DEFINITIONS - END -->
<!-- prettier-ignore-end -->
