FROM debian:buster-slim

# Add directory missing from `buster-slim` needed by `default-jre`.
RUN mkdir /usr/share/man/man1/

ARG USERNAME=vscode
ARG USER_UID=1000
ARG USER_GID=$USER_UID
ARG UPGRADE_PACKAGES="false"

COPY library-scripts/*.sh /tmp/library-scripts/
RUN apt-get update && export DEBIAN_FRONTEND=noninteractive \
    && /bin/bash /tmp/library-scripts/common-debian.sh "${USERNAME}" "${USER_UID}" "${USER_GID}" "${UPGRADE_PACKAGES}" \
    && /bin/bash /tmp/library-scripts/fish-debian.sh "${USERNAME}" \
    #
    # ****************************************************************************
    # * TODO: Add any additional OS packages you want included in the definition *
    # * here. We want to do this before cleanup to keep the "layer" small.       *
    # ****************************************************************************
    && apt-get -y install --no-install-recommends build-essential bzip2 default-jre zlib1g-dev zlib1g libreadline-dev libssl-dev fish vim \
    #
    && apt-get autoremove -y && apt-get clean -y && rm -rf /var/lib/apt/lists/* /tmp/library-scripts

# Set up default Fish config.
RUN su vscode -c "fish --command 'cp /usr/share/fish/config.fish ~/.config/fish/'"

# Install rbenv.
RUN su vscode -c "git clone --depth=1 \
    -c core.eol=lf \
    -c core.autocrlf=false \
    -c fsck.zeroPaddedFilemode=ignore \
    -c fetch.fsck.zeroPaddedFilemode=ignore \
    -c receive.fsck.zeroPaddedFilemode=ignore \
    https://github.com/rbenv/rbenv.git ~/.rbenv"

# Add rbenv to Fish user PATH.
RUN su vscode -c "echo 'set -Ux fish_user_paths ~/.rbenv/bin $fish_user_paths' >> ~/.config/fish/config.fish"
RUN su vscode -c "echo 'status --is-interactive; and rbenv init - | source' >> ~/.config/fish/config.fish"

# Install rbenv ruby-build plugin.
RUN su vscode -c "mkdir -p ~/.rbenv/bin/plugins"
RUN su vscode -c "git clone --depth=1 \
    -c core.eol=lf \
    -c core.autocrlf=false \
    -c fsck.zeroPaddedFilemode=ignore \
    -c fetch.fsck.zeroPaddedFilemode=ignore \
    -c receive.fsck.zeroPaddedFilemode=ignore \
    https://github.com/rbenv/ruby-build.git ~/.rbenv/bin/plugins/ruby-build"
RUN su vscode -c "sudo ~/.rbenv/bin/plugins/ruby-build/install.sh"

# Install Fisher and plugins.
RUN su vscode -c "fish --command 'curl -s https://raw.githubusercontent.com/jorgebucaran/fisher/main/fisher.fish | source && fisher install jorgebucaran/{fisher,nvm.fish@2.0.1}'"

# Configure Git.
RUN su vscode -c "echo 'set -Ux GIT_EDITOR vim' >> ~/.config/fish/config.fish"
RUN su vscode -c "echo 'git config --global rebase.autosquash true' >> ~/.config/fish/config.fish"

# ENV Variables required by Jekyll.
ENV LANG=en_US.UTF-8 \
    LANGUAGE=en_US:en \
    TZ=Etc/UTC \
    LC_ALL=en_US.UTF-8 \
    LANG=en_US.UTF-8 \
    LANGUAGE=en_US
