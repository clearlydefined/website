# Copyright (c) Microsoft Corporation.
# SPDX-License-Identifier: MIT
FROM node:8-alpine as builder
COPY . /opt/website
WORKDIR /opt/website
ARG REACT_APP_SERVER=http://localhost:4000
RUN npm install
RUN npm run build

FROM nginx:alpine
ADD nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=builder /opt/website/build /usr/share/nginx/html
EXPOSE 80
