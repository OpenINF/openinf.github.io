## SDK API artifact contract

The [OpenINF SDK](https://github.com/OpenINF/sdk) supplies one directory per
release here. This portal turns its TypeDoc Markdown into pages below
`/docs/sdk/<version>/api/`, in the portal's own documentation layout.

```text
vendor/sdk-api/
  3.0.0/
    manifest.json
    docs/
      README.md
      navigation.json
      @openinf/
        util/
          README.md
          functions/
            isString.md
```

`manifest.json` has this shape:

```json
{
  "schemaVersion": 1,
  "version": "3.0.0",
  "commit": "0123456789abcdef",
  "generatedAt": "2026-10-01T00:00:00.000Z",
  "docsPath": "docs",
  "navigationPath": "docs/navigation.json"
}
```

### Where a directory here comes from

The SDK's **Release** workflow builds one on the run that publishes, from the
versions that shipped and the commit they shipped from, and attaches it to that
run as **sdk-api-docs**.

Bringing it here is the **SDK API sync** workflow, started with the ID of that
run. It downloads the artifact, places it beside the releases already here,
imports it to check this portal can render it, and opens a pull request. The
check on that pull request is what confirms the reference will appear; a
refused artifact fails the workflow instead of becoming one.

This portal fetches rather than the SDK pushing. The SDK's release job holds
the credential that publishes to the registry, and giving it a second one that
could write here would widen what a mistake in that job reaches. Everything
needed to refuse a bad artifact is already here, so the fetching is here too.

Nothing makes that step happen. When it is missed the packages are published
all the same and this portal simply never hears about them, so the **SDK API
drift** workflow asks the SDK weekly what it has released and files an issue
when a release is missing its reference here.

By hand, the same three steps are described under "Publishing the API
reference" in the SDK's `RELEASING.md`.

A release adds a version rather than replacing one. Every release keeps the
reference it was published with, so a link into an older version keeps
describing that version instead of following the latest source.

### What it may contain

The artifact contains generated Markdown only. Do not edit it by hand. The
import task refuses generated maintainer documents; the SDK's API-specific
TypeDoc overview must link to public portal pages rather than to its
repository-local contributor or release instructions.

Manifest paths must resolve inside their version directory, including through
symbolic links. The Markdown root must be a directory with importable pages
and a `README.md` entry point; an empty artifact cannot advertise a release.
Navigation URLs are derived from imported pages, not accepted from the source
JSON. Imported Markdown is rendered without Liquid evaluation, then its HTML
body is sanitized before the portal layout embeds it. Script elements, event
handlers, and unsafe URL schemes are not allowed; escaped code examples,
API anchors, and tables are retained.

The SDK applies these same rules to its own output before it builds an
artifact, so a corpus this portal would refuse fails there first.

### Why the checks skip it

Names here are TypeDoc's, taken from the symbols they document, and the prose
is the SDK's. Neither is this repository's to correct, and a fix applied here
would be overwritten by the next release. So the version directories are
outside the filename, Markdown, spelling, JSON, and EditorConfig checks, along
with `collections/_sdk-api/`, which the import task derives from them. This
file is not generated, and remains checked.
