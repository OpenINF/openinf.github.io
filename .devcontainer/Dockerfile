# Everything else comes from features. This exists only for packages that do
# not need one: Debian trixie ships both fish (the default shell, per
# devcontainer.json) and ripgrep, so installing them is one apt call, and
# doing it here bakes them into a cached image layer.
#
# ripgrep is here for the Todo Tree extension, which shells out to an `rg`
# binary. It used to find one inside VS Code itself, but it only ever probes
# four hardcoded paths under vscode.env.appRoot -- node_modules and
# node_modules.asar.unpacked, each joined with vscode-ripgrep/bin/rg or
# @vscode/ripgrep/bin/rg -- and VS Code now ships
# @vscode/ripgrep-universal/bin/<arch>/rg, which matches none of them. Every
# probe is a bare fs.existsSync, so the extension never consults PATH;
# installing the binary is necessary but not sufficient, and
# devcontainer.json has to point todo-tree.ripgrep at it explicitly.
#
# The alternative considered was ghcr.io/devcontainers-extra/features/fish-apt-get,
# which downloads the 20 MB nanolayer binary and runs it as root to invoke a
# second feature that runs exactly the apt call below -- more than twice the
# size of the package it installs, for a package the distribution already has.
FROM mcr.microsoft.com/devcontainers/typescript-node:5-24-trixie@sha256:b55b444f6658dd2370d430c12d4bc9540c8ed0d3d5b05e4c247161173666954f

# DL3008 wants these pinned, as in `fish=4.0.2-1`. Pinning an apt package is
# not the same bargain as pinning an npm one: Debian drops superseded versions
# from the archive, so the first security update to either package would leave
# this asking for a version that no longer exists and fail the build outright.
# Nothing tracks apt pins to raise a PR the way renovate does for everything
# else here. The previous Dockerfile suppressed this same rule for the same
# reason.
# skipcq: DOK-DL3008
RUN apt-get update \
  && apt-get install -y --no-install-recommends fish ripgrep \
  && apt-get clean \
  && rm -rf /var/lib/apt/lists/*
