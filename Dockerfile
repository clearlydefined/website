# Copyright (c) Microsoft Corporation and others. Licensed under the MIT license.
# SPDX-License-Identifier: MIT
FROM node:10-alpine as builder
COPY . /opt/website
WORKDIR /opt/website
ARG REACT_APP_SERVER=http://localhost:4000
ARG REACT_APP_GA_TRACKINGID
RUN apk add --no-cache git
RUN npm install
RUN npm run build

FROM nginx:alpine
ADD nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=builder /opt/website/build /usr/share/nginx/html
EXPOSE 80
