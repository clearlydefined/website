// Copyright (c) Microsoft Corporation and others. Licensed under the MIT license.
// SPDX-License-Identifier: MIT

import { setIfValue } from './utils'
import findIndex from 'lodash/findIndex'

const NAMESPACE = 0x4
const NAME = 0x2
const REVISION = 0x1
const NONE = 0

const toLowerCaseMap = {
  github: NAMESPACE | NAME,
  npmjs: NONE,
  mavencentral: NONE,
  mavencentralsource: NONE
}

const entityMapping = [
  { hostnames: ['npmjs.com', 'npmjs.org'], parser: npmParser },
  { hostnames: ['github.com'], parser: githubParser },
  { hostnames: ['mvnrepository.com'], parser: mavenParser },
  { hostnames: ['nuget.org'], parser: nugetParser },
  { hostnames: ['crates.io'], parser: cratesParser },
  { hostnames: ['pypi.org'], parser: pypiParser },
  { hostnames: ['rubygems.org'], parser: rubygemsParser }
]

function npmParser(path) {
  let namespace, name, version
  const pathSegments = path.split('/')
  // if the first segment is a namespace name, use it
  if (pathSegments[1].startsWith('@')) [, namespace, name, , version] = pathSegments
  else [, name, , version] = pathSegments
  return new EntitySpec('npm', 'npmjs', namespace, name, version)
}

function githubParser(path) {
  const [org, repo, type, one, two] = path.split('/')
  const version = type === 'commit' ? one : type === 'releases' ? two : null
  if (!version) return null
  return new EntitySpec('git', 'github', org, repo, version)
}

function mavenParser(path) {
  const [, group, artifact, version] = path.split('/')
  return new EntitySpec('maven', 'mavencentral', group, artifact, version)
}

function nugetParser(path) {
  const [, name, version] = path.split('/')
  return new EntitySpec('nuget', 'nuget', null, name, version)
}

function pypiParser(path) {
  const [, name, version] = path.split('/')
  return new EntitySpec('pypi', 'pypi', null, name, version)
}

function cratesParser(path) {
  const [, name, version] = path.split('/')
  return new EntitySpec('crate', 'cratesio', null, name, version)
}

function rubygemsParser(path) {
  const [, name, , version] = path.split('/')
  return new EntitySpec('gem', 'rubygems', null, name, version)
}

function normalize(value, provider, property) {
  if (!value) return value
  const mask = toLowerCaseMap[provider] || 0
  return mask & property ? value.toLowerCase() : value
}

export default class EntitySpec {
  static fromPath(path) {
    const [, type, provider, namespace, name, revision, prSpec] = path.match(
      /\/*([^/]+)\/([^/]+)\/([^/]+)\/([^/]+)\/?([^/]+)?(\/pr\/.+)?/
    )
    const [, , pr] = prSpec ? prSpec.split('/') : []
    return new EntitySpec(type, provider, namespace, name, revision, pr)
  }

  static fromUrl(url) {
    const urlObject = new URL(url)
    const path = urlObject.pathname.startsWith('/') ? urlObject.pathname.slice(1) : urlObject.pathname
    const hostname = urlObject.hostname.toLowerCase().replace('www.', '')
    const entry = this._findParser(hostname, path)
    if (!entry) throw new Error(`${hostname} is not currently supported`)
    return entry.parser(path)
  }

  static _findParser(hostname, path) {
    return entityMapping.find(entry => {
      return (
        findIndex(entry.hostnames, pattern => {
          if (typeof pattern === 'string') return pattern === hostname
          if (pattern instanceof RegExp) return pattern.test(hostname + '/' + path)
          return false
        }) >= 0
      )
    })
  }

  static fromCoordinates(o) {
    return new EntitySpec(o.type, o.provider, o.namespace, o.name, o.revision, o.pr, o.changes)
  }

  static asRevisionless(o) {
    return new EntitySpec(o.type, o.provider, o.namespace, o.name)
  }

  static validateAndCreate(o) {
    if (o && typeof o === 'object' && o.name && o.provider && o.revision && o.type) return this.fromCoordinates(o)
  }

  static isEquivalent(one, other) {
    return (
      other &&
      one.type === other.type &&
      one.provider === other.provider &&
      one.namespace === other.namespace &&
      one.name === other.name &&
      one.revision === other.revision
    )
  }

  constructor(type, provider, namespace, name, revision = null, pr = null, changes = null) {
    this.type = type.toLowerCase()
    this.provider = provider.toLowerCase()
    setIfValue(this, 'namespace', namespace === '-' ? null : normalize(namespace, this.provider, NAMESPACE))
    this.name = normalize(name, this.provider, NAME)
    setIfValue(this, 'revision', normalize(revision, this.provider, REVISION))
    setIfValue(this, 'pr', pr)
    setIfValue(this, 'changes', changes)
  }

  get url() {
    if (this.provider === 'github')
      return `https://github.com/${this.namespace}/${this.name}${this.revision ? `/commit/${this.revision}` : ''}`
    return null
  }

  toPath() {
    const revisionPart = this.revision ? `/${this.revision}` : ''
    const prPart = this.pr ? `/pr/${this.pr}` : ''
    return `${this.type}/${this.provider}/${this.namespace || '-'}/${this.name}${revisionPart}${prPart}`
  }

  toString() {
    return this.toPath()
  }
}
