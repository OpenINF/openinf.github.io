# Everything else comes from features. This exists only because fish does not
# need a feature: Debian trixie ships fish 4.0.2, so installing it is one apt
# call, and doing it here bakes it into a cached image layer.
#
# The alternative considered was ghcr.io/devcontainers-extra/features/fish-apt-get,
# which downloads the 20 MB nanolayer binary and runs it as root to invoke a
# second feature that runs exactly the apt call below -- more than twice the
# size of the package it installs, for a package the distribution already has.
FROM mcr.microsoft.com/devcontainers/typescript-node:4-24-trixie

# DL3008 wants `fish=4.0.2-1`. Pinning an apt package is not the same bargain
# as pinning an npm one: Debian drops superseded versions from the archive, so
# the first security update to fish would leave this asking for a version that
# no longer exists and fail the build outright. Nothing tracks apt pins to
# raise a PR the way renovate does for everything else here. The previous
# Dockerfile suppressed this same rule for the same reason.
# skipcq: DOK-DL3008
RUN apt-get update \
  && apt-get install -y --no-install-recommends fish \
  && apt-get clean \
  && rm -rf /var/lib/apt/lists/*
