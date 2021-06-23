FROM debian:buster-slim as node-base
LABEL author="Max Meinhold <mxmeinhold@gmail.com>"

# Yarn and nvm install deps
RUN rm /bin/sh \
    && ln -s /bin/bash /bin/sh \
    && apt-get update \
    && apt-get install -y curl \
    && apt-get -y autoclean

# NVM and node install
ENV NODE_VERSION 14.17.1

ENV NVM_DIR /usr/local/nvm
RUN mkdir $NVM_DIR \
    && curl --silent -o- https://raw.githubusercontent.com/creationix/nvm/v0.38.0/install.sh | bash

RUN source $NVM_DIR/nvm.sh \
    && nvm install $NODE_VERSION \ 
    && nvm alias default $NODE_VERSION \
    && nvm use default

ENV NODE_PATH $NVM_DIR/v$NODE_VERSION/lib/node_modules
ENV PATH $NVM_DIR/versions/node/v$NODE_VERSION/bin:$PATH

FROM node-base as builder

# Yarn install deps
RUN rm /bin/sh \
    && ln -s /bin/bash /bin/sh \
    && apt-get update \
    && apt-get install -y gnupg \
    && apt-get -y autoclean

WORKDIR /usr/src/plane-graph

# Yarn install
RUN curl -sS https://dl.yarnpkg.com/debian/pubkey.gpg | apt-key add - \
    && echo "deb https://dl.yarnpkg.com/debian/ stable main" | tee /etc/apt/sources.list.d/yarn.list \
    && apt-get update \
    && apt-get install -y yarn \
    && apt-get -y autoclean

# Project dependencies
COPY package.json yarn.lock ./
RUN yarn install

# Build the bundle
COPY . .
RUN yarn run build:production

FROM node-base as backend
WORKDIR /opt/plane-graph

COPY --from=builder /usr/src/plane-graph/dist/bundle.js ./
COPY ./config.example.json ./

EXPOSE 8080
USER 1001

CMD ["node", "bundle.js"]
