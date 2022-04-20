# Common Utility and Non-Root User Install Script

_Installs a set of common command line utilities and sets up a non-root user._

**Script status**: Stable

**OS support**: Debian 11

**Maintainer:** The VS Code and GitHub Codespaces teams

## Syntax

```text
./common-debian.sh [Non-root user] [User UID] [User GID] [Upgrade packages flag]
```

> **Note:** `common-debian.sh` is community supported.

| Argument              | Default     | Description                                                                                                                                                                                                                                                                                                     |
| --------------------- | ----------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Non-root user         | `automatic` | Specifies a user in the container other than root that should be created or modified. A value of `automatic` will cause the script to check for a user called `vscode`, then `node`, `codespace`, and finally a user with a UID of `1000` before falling back to `root`. A value of `none` will skip this step. |
| User UID              | `automatic` | A specific UID (e.g. `1000`) for the user that will be created modified. A value of `automatic` will pick a free one if the user is created.                                                                                                                                                                    |
| User GID              | `automatic` | A specific GID (e.g. `1000`) for the user's group that will be created modified. A value of `automatic` will pick a free one if the group is created.                                                                                                                                                           |
| Upgrade packages flag | `true`      | A `true`/`false` flag that indicates whether packages should be upgraded to the latest for the distro.                                                                                                                                                                                                          |

## Usage

**Ubuntu / Debian:**

1. Add [`common-debian.sh`](../common-debian.sh) to
   `.devcontainer/library-scripts/`

2. Add the following to your `.devcontainer/Dockerfile`:

   ```Dockerfile
   COPY library-scripts/common-debian.sh /tmp/library-scripts/
   RUN apt-get update && bash /tmp/library-scripts/common-debian.sh
   ```

That's it!
