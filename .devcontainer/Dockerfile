FROM mcr.microsoft.com/vscode/devcontainers/ruby:2

# ENV Variables required by Jekyll.
ENV LANG=en_US.UTF-8 \
    LANGUAGE=en_US:en \
    TZ=America/New_York \
    LC_ALL=en_US.UTF-8 \
    LANG=en_US.UTF-8 \
    LANGUAGE=en_US

# Install Node.js.
ARG NODE_VERSION="lts/*"
RUN su vscode -c "source /usr/local/share/nvm/nvm.sh && nvm install ${NODE_VERSION} 2>&1"

# Install additional OS packages.
RUN apt-get update && export DEBIAN_FRONTEND=noninteractive \
    && apt-get -y install --no-install-recommends default-jre

# [Optional] Uncomment this line to install global Node packages.
# RUN su vscode -c "source /usr/local/share/nvm/nvm.sh && npm install -g <your-package-here>" 2>&1
