# Everything else comes from features. This exists only because fish does not
# need a feature: Debian trixie ships fish 4.0.2, so installing it is one apt
# call, and doing it here bakes it into a cached image layer.
#
# The alternative considered was ghcr.io/devcontainers-extra/features/fish-apt-get,
# which downloads the 20 MB nanolayer binary and runs it as root to invoke a
# second feature that runs exactly the apt call below -- more than twice the
# size of the package it installs, for a package the distribution already has.
FROM mcr.microsoft.com/devcontainers/typescript-node:4-24-trixie

RUN apt-get update \
  && apt-get install -y --no-install-recommends fish \
  && apt-get clean \
  && rm -rf /var/lib/apt/lists/*
