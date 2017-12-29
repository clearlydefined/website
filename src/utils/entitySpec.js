// Copyright (c) Microsoft Corporation. All rights reserved.
// SPDX-License-Identifier: MIT

export default class EntitySpec {
  static fromUrl(url) {
    const [full, type, provider, namespace, name, revision, prSpec] = url.match(/.*:\/*([^/]+)\/([^/]+)\/([^/]+)\/([^/]+)\/?([^/]+)?(\/pr\/.+)?/)
    const [blank, delimiter, pr] = prSpec ? prSpec.split('/') : []
    return new EntitySpec(type, provider, namespace, name, revision, pr)
  }

  constructor(type, provider, namespace, name, revision = null, pr = null) {
    this.type = type
    this.provider = provider
    this.namespace = namespace === '-' ? null : namespace
    this.name = name
    this.revision = revision
    this.pr = pr
  }

  toUrl() {
    return `cd:/${this.toUrlPath()}`
  }  
  
  toUrlPath() {
    const revisionPart = this.revision ? `/${this.revision}` : ''
    const prPart = this.pr ? `/pr/${this.pr}` : ''
    return `${this.type}/${this.provider}/${this.namespace || '-'}/${this.name}${revisionPart}${prPart}`
  }
}

