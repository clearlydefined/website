// Copyright (c) Microsoft Corporation and others. Licensed under the MIT license.
// SPDX-License-Identifier: MIT
import compact from 'lodash/compact'
import last from 'lodash/last'
import remove from 'lodash/remove'
import { setIfValue } from './utils'

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
  { hostnames: ['repo1.maven.org'], parser: mavenOrgParser },
  { hostnames: ['central.maven.org'], parser: mavenOrgParser },
  { hostnames: ['mvnrepository.com'], parser: mavenParser },
  { hostnames: ['nuget.org'], parser: nugetParser },
  { hostnames: ['crates.io'], parser: cratesParser },
  { hostnames: ['pypi.org'], parser: pypiParser },
  { hostnames: ['rubygems.org'], parser: rubygemsParser },
  { hostnames: ['ftp.debian.org'], parser: debianParser },
  { hostnames: ['packagist.org'], parser: composerParser }
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
  // if there is no version but there is something after repo, it's not for us so return
  if (!version && type) return null
  return new EntitySpec('git', 'github', org, repo, version)
}

function mavenOrgParser(path) {
  const urlParams = compact(path.split('/'))
  remove(urlParams, n => n === 'maven2')
  const version = last(urlParams)
  urlParams.pop()
  const name = last(urlParams)
  urlParams.pop()
  const namespace = urlParams.join('.')
  return new EntitySpec('maven', 'mavencentral', namespace, name, version)
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

function debianParser(path) {
  const extensions = ['.deb', '.tar.gz', '.tar.xz', '.dsc']
  const expStr = extensions.join('|')
  const [, , , , name, packageName] = path.split('/')
  const withoutExtension = packageName.replace(new RegExp('\\b(' + expStr + ')\\b', 'gi'), '').replace(/\s{2,}/g, '')
  const [, version] = withoutExtension.split(`${name}_`)

  return new EntitySpec('deb', 'debian', null, name, version)
}

function composerParser(path, hash) {
  const [, namespace, name] = path.split('/')
  const version = hash.substr(1)
  return new EntitySpec('composer', 'packagist', namespace, name, version)
}

function normalize(value, provider, property) {
  if (!value) return value
  const mask = toLowerCaseMap[provider] || 0
  return mask & property ? value.toLowerCase() : value
}

export default class EntitySpec {
  static isPath(path) {
    return path.match(/\/*([^/]+)\/([^/]+)\/([^/]+)\/([^/]+)\/?([^/]+)?(\/pr\/.+)?/)
  }

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
    const entry = entityMapping.find(entry => entry.hostnames.includes(hostname))
    if (!entry) throw new Error(`${hostname} is not currently supported`)
    return entry.parser(path, urlObject.hash)
  }

  static fromObject(o) {
    return new EntitySpec(o.type, o.provider, o.namespace, o.name, o.revision, o.pr, o.changes)
  }

  static withoutRevision(o) {
    return new EntitySpec(o.type, o.provider, o.namespace, o.name)
  }

  static withoutPR(o) {
    return new EntitySpec(o.type, o.provider, o.namespace, o.name, o.revision)
  }

  static validateAndCreate(o) {
    if (o && typeof o === 'object' && o.name && o.provider && o.revision && o.type) return this.fromObject(o)
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
