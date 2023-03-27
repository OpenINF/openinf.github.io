# See here for image contents: https://github.com/openinf/docker-fish

FROM dereknongeneric/fish:latest

# Needed by Linguist
# See: https://github.com/github/linguist/blob/HEAD/README.md#dependencies
# TODO(@DerekNonGeneric): add these to shared devcontainer image and remove this
RUN export DEBIAN_FRONTEND=noninteractive \
  && apt-get update \
  && apt-get -y install --no-install-recommends build-essential cmake gnupg2 pkg-config libicu-dev zlib1g-dev libcurl4-openssl-dev libssl-dev \
  && apt-get clean \
  && rm -rf /var/lib/apt/lists/*
