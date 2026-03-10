# Copyright (c) Microsoft Corporation and others. Licensed under the MIT license.
# SPDX-License-Identifier: MIT
FROM node:25-alpine as builder
COPY . /opt/website
WORKDIR /opt/website

# Set environment variables from build arguments
ARG APP_VERSION="UNKNOWN"
ENV APP_VERSION=$APP_VERSION
ARG BUILD_SHA="UNKNOWN"
ENV BUILD_SHA=$BUILD_SHA

ARG REACT_APP_SERVER=http://localhost:4000
ARG REACT_APP_GA_TRACKINGID
RUN apk add --no-cache git
RUN npm install -g npm@9
RUN npm install
RUN npm run build

FROM nginx:1.29.4-alpine

ARG APP_VERSION="UNKNOWN"
ENV APP_VERSION=$APP_VERSION
ARG BUILD_SHA="UNKNOWN"
ENV BUILD_SHA=$BUILD_SHA

RUN mkdir /etc/nginx/templates
COPY default.conf.template /etc/nginx/templates
COPY --from=builder /opt/website/build /usr/share/nginx/html
EXPOSE 80
