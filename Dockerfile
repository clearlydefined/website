# Copyright (c) Microsoft Corporation. All rights reserved.
# SPDX-License-Identifier: MIT
FROM node:8-alpine as builder
COPY . /opt/website
WORKDIR /opt/website
RUN npm install
RUN npm run build

FROM nginx:alpine
COPY --from=builder /opt/website/build /usr/share/nginx/html
EXPOSE 80
