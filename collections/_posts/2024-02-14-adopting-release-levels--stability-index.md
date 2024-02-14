---
title: Adopting Release Levels&#xFF1A;Stability Index
published: false
---

On each package project landing page (i.e., the Readme file, the [**npm**][]
badges indicating the latest published version will identify their intended
release level, which roughly equates to a value in the stability index.

<!-- At the "Preview" release level, one can expect badges to be orange-coloured. Orange for &ldquo;orange
ya glad you're here&rdquo;&mdash;previewing a future _potentially_ LTS-supported package release. -->

## Stability Index

Throughout the documentation are indications of a section's stability. Some APIs
are so proven and relied upon that they will likely stay the same, while others
are brand new and experimental or known to be hazardous.

The stability indices are as follows:

Stability: 0 - Deprecated. This code is considered unstable; the feature may
emit warnings. Backward compatibility is not guaranteed.

Stability: 1 - Experimental. This code is considered unstable; the feature is
not subject to semantic versioning rules and may change at any time, breaking or
non-breaking, including in SemVer minor releases. Non-backward compatible
changes or removal may occur in any future release. Use of the feature is not
recommended in production environments. Use with caution.

Stability: 2 - Stable. Compatibility with the npm ecosystem is a high priority.

Stability: 3 - Legacy. Although this feature is unlikely to be removed and is
still covered by semantic versioning guarantees, it is no longer actively
maintained, and other alternatives are available.

Features are marked as "legacy" rather than being deprecated if their use does
no harm and they are widely relied upon within the npm ecosystem. Bugs found in
legacy features are unlikely to be fixed.

Use caution when making use of Experimental features, particularly within
modules. Users may need to be made aware that experimental features are being
used. Bugs or behavior changes may surprise users when Experimental API
modifications occur. An Experimental feature may require a command-line flag or
environment variable setting to enable it to help avoid surprises. Experimental
features may also emit a warning.

_Portion above cross-posted; derived of model: [Node.js Core Stability
index][]._

<br /><br />

<!-- LINK LABEL DEFINITIONS - START -->

[**npm**]: https://docs.npmjs.com/cli/using-npm/registry
[Node.js Core Stability index]:
  https://nodejs.org/api/documentation.html#stability-index

<!-- LINK LABEL DEFINITIONS - END -->
