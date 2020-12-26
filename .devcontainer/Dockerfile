FROM debian:buster-slim

# Add directory missing from `buster-slim` needed by `default-jre`.
RUN mkdir /usr/share/man/man1/

ARG USERNAME=vscode
ARG USER_UID=1000
ARG USER_GID=$USER_UID
COPY library-scripts/*.sh /tmp/library-scripts/
RUN apt-get update && export DEBIAN_FRONTEND=noninteractive \
    && /bin/bash /tmp/library-scripts/common-debian.sh "${USERNAME}" "${USER_UID}" "${USER_GID}" \
    #
    && echo 'deb http://download.opensuse.org/repositories/shells:/fish/Debian_10/ /' | sudo tee /etc/apt/sources.list.d/shells:fish.list \
    && curl -fsSL https://download.opensuse.org/repositories/shells:fish/Debian_10/Release.key | gpg --dearmor | sudo tee /etc/apt/trusted.gpg.d/shells_fish.gpg > /dev/null \
    # ****************************************************************************
    # * TODO: Add any additional OS packages you want included in the definition *
    # * here. We want to do this before cleanup to keep the "layer" small.       *
    # ****************************************************************************
    && apt-get -y install --no-install-recommends build-essential bzip2 default-jre zlib1g-dev zlib1g libreadline-dev libssl-dev fish rbenv ruby-dev \
    #
    && apt-get autoremove -y && apt-get clean -y && rm -rf /var/lib/apt/lists/* /tmp/library-scripts

# Install Fisher and plugins.
RUN su vscode -c "fish --command 'curl -s https://raw.githubusercontent.com/jorgebucaran/fisher/main/fisher.fish | source && fisher install jorgebucaran/{fisher,nvm.fish}'"

# Set up default Fish config.
RUN su vscode -c "cp /usr/share/fish/config.fish ~/.config/fish/"

# Add rbenv to Fish user PATH.
RUN su vscode -c "fish --command 'set -Ux fish_user_paths $HOME/.rbenv/bin $fish_user_paths'"

# Install rbenv `install` plugin.
RUN su vscode -c "fish --command 'mkdir -p (rbenv root)/plugins'"
RUN su vscode -c "fish --command 'git clone https://github.com/rbenv/ruby-build.git (rbenv root)/plugins/ruby-build'"

# ENV Variables required by Jekyll.
ENV LANG=en_US.UTF-8 \
    LANGUAGE=en_US:en \
    TZ=Etc/UTC \
    LC_ALL=en_US.UTF-8 \
    LANG=en_US.UTF-8 \
    LANGUAGE=en_US
