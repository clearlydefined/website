// Copyright (c) Microsoft Corporation and others. Licensed under the MIT license.
// SPDX-License-Identifier: MIT

const { setIfValue } = require('./utils')

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

const NPM_WEBSITE = 'npmjs.com'
const GITHUB_WEBSITE = 'github.com'
const MAVEN_WEBSITE = 'mvnrepository.com'
const NUGET_WEBSITE = 'nuget.org'
const PYPI_WEBSITE = 'pypi.org'
const RUBYGEM_WEBSITE = 'rubygems.org'

const providerPath = {
  [NPM_WEBSITE]: 'npm/npmjs/-',
  [GITHUB_WEBSITE]: 'git/github',
  [PYPI_WEBSITE]: 'pypi/pypi/-',
  [MAVEN_WEBSITE]: 'maven/mavencentral',
  [NUGET_WEBSITE]: 'nuget/nuget/-',
  [RUBYGEM_WEBSITE]: 'nuget/nuget/-'
}

const acceptedFilesValues = ['application/json']

function normalize(value, provider, property) {
  if (!value) return value
  const mask = toLowerCaseMap[provider] || 0
  return mask & property ? value.toLowerCase() : value
}

export default class EntitySpec {
  static fromPath(path) {
    // eslint-disable-next-line no-unused-vars
    const [full, type, provider, namespace, name, revision, prSpec] = path.match(
      /\/*([^/]+)\/([^/]+)\/([^/]+)\/([^/]+)\/?([^/]+)?(\/pr\/.+)?/
    )
    // eslint-disable-next-line no-unused-vars
    const [blank, delimiter, pr] = prSpec ? prSpec.split('/') : []
    return new EntitySpec(type, provider, namespace, name, revision, pr)
  }

  static checkDroppedFiles(files) {
    let acceptedFiles = []
    let rejectedFiles = []

    files.forEach(file => {
      const acceptedType = acceptedFilesValues.find(el => el === file.type)

      if (acceptedType) acceptedFiles.push(file)
      else rejectedFiles.push(file)
    })

    return {
      acceptedFiles,
      rejectedFiles
    }
  }

  static providerErrorsFallback(provider) {
    return { errors: `${provider} need a version to be imported` }
  }

  static fromUrl(url) {
    const urlObject = new URL(url)
    const pathname = urlObject.pathname.startsWith('/') ? urlObject.pathname.slice(1) : urlObject.pathname
    const hostname = urlObject.hostname.replace('www.', '')
    let packageName, name, version, revision

    switch (hostname) {
      case NPM_WEBSITE:
        ;[packageName, name, version, revision] = pathname.split('/')
        return revision ? `${providerPath[hostname]}/${name}/${revision}` : this.providerErrorsFallback(hostname)

      case GITHUB_WEBSITE:
        ;[packageName, name, version, revision] = pathname.split('/')
        return revision
          ? `${providerPath[hostname]}/${packageName}/${name}/${revision}`
          : this.providerErrorsFallback(GITHUB_WEBSITE)

      case PYPI_WEBSITE:
        ;[packageName, name, revision] = pathname.split('/')
        return revision
          ? `${providerPath[PYPI_WEBSITE]}/${name}/${revision}`
          : this.providerErrorsFallback(PYPI_WEBSITE)

      case MAVEN_WEBSITE:
        ;[packageName, name, version, revision] = pathname.split('/')
        return revision
          ? `${providerPath[hostname]}/${name}/${version}/${revision}`
          : `${providerPath[hostname]}/${name}/${version}`

      case NUGET_WEBSITE:
        ;[packageName, name, revision] = pathname.split('/')
        return revision ? `${providerPath[hostname]}/${name}/${revision}` : `${providerPath[hostname]}/${packageName}`

      case RUBYGEM_WEBSITE:
        ;[packageName, name, version, revision] = pathname.split('/')
        return revision ? `${providerPath[hostname]}/${name}/${revision}` : `${providerPath[hostname]}/${name}`

      default:
        return { errors: `${hostname} is not available as source provider` }
    }
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

  toPath() {
    const revisionPart = this.revision ? `/${this.revision}` : ''
    const prPart = this.pr ? `/pr/${this.pr}` : ''
    return `${this.type}/${this.provider}/${this.namespace || '-'}/${this.name}${revisionPart}${prPart}`
  }

  toString() {
    return this.toPath()
  }
}
