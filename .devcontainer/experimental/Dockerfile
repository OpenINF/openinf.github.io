FROM openinf/grimesai-salvage-tex:lunar

ARG USERNAME=vscode
ARG NPM_GLOBAL=/usr/local/share/npm-global

# Add NPM global to PATH.
ENV PATH=${NPM_GLOBAL}/bin:${PATH}

ARG USERNAME=vscode
ARG USER_UID=1000
ARG USER_GID=$USER_UID
ARG UPGRADE_PACKAGES="true"

USER 0

# COPY library-scripts/*.sh /tmp/library-scripts/
# skipcq: DOK-DL3008
RUN apt-get update && export DEBIAN_FRONTEND=noninteractive \
# && /bin/bash /tmp/library-scripts/common-debian.sh "${USERNAME}" "${USER_UID}" "${USER_GID}" "${UPGRADE_PACKAGES}" \
# && /bin/bash /tmp/library-scripts/fish-debian.sh "${USERNAME}" \
# && /bin/bash /tmp/library-scripts/sshd-debian.sh "2222" "${USERNAME}" "true" "root" \
#
# ****************************************************************************
# * TODO: Add any additional OS packages you want included in the definition *
# * here. We want to do this before cleanup to keep the "layer" small.       *
# ****************************************************************************
  && apt-get -y install --no-install-recommends build-essential default-jre ruby-dev git-lfs \
  && apt-get clean \
  && rm -rf /var/lib/apt/lists/*

USER vscode

# ENV Variables required by Jekyll.
ENV LANG=en_US.UTF-8 \
    LANGUAGE=en_US:en \
    TZ=Etc/UTC \
    LC_ALL=en_US.UTF-8 \
    LANG=en_US.UTF-8 \
    LANGUAGE=en_US

ENTRYPOINT ["/usr/local/share/ssh-init.sh"]
CMD ["sleep", "infinity"]
