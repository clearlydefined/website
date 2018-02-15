// Copyright (c) Microsoft Corporation. All rights reserved.
// SPDX-License-Identifier: MIT

const NAMESPACE = 0x4;
const NAME = 0x2;
const REVISION = 0x1;
const NONE = 0;

const toLowerCaseMap = {
  github: NAMESPACE | NAME,
  npmjs: NONE,
  mavencentral: NONE,
  mavencentralsource: NONE
}

function normalize(value, provider, property) {
  if (!value)
    return value;
  const mask = toLowerCaseMap[provider] || 0;
  return (mask & property) ? value.toLowerCase() : value;
}

export default class EntitySpec {
  static fromPath(path) {
    // eslint-disable-next-line
    const [full, type, provider, namespace, name, revision, prSpec] = path.match(/\/*([^/]+)\/([^/]+)\/([^/]+)\/([^/]+)\/?([^/]+)?(\/pr\/.+)?/)
    // eslint-disable-next-line
    const [blank, delimiter, pr] = prSpec ? prSpec.split('/') : []
    return new EntitySpec(type, provider, namespace, name, revision, pr)
  }

  constructor(type, provider, namespace, name, revision = null, pr = null) {
    this.type = type.toLowerCase()
    this.provider = provider.toLowerCase()
    this.namespace = namespace === '-' ? null : normalize(namespace, this.provider, NAMESPACE);
    this.name = normalize(name, this.provider, NAME);
    this.revision = normalize(revision, this.provider, REVISION);
    this.pr = pr
  }

  toPath() {
    const revisionPart = this.revision ? `/${this.revision}` : ''
    const prPart = this.pr ? `/pr/${this.pr}` : ''
    return `${this.type}/${this.provider}/${this.namespace || '-'}/${this.name}${revisionPart}${prPart}`
  }
}

