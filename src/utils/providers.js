// Copyright (c) Microsoft Corporation and others. Licensed under the MIT license.
// SPDX-License-Identifier: MIT
import map from 'lodash/map'
import { createGist, getGist } from '../api/clearlyDefined'

// Provider class is intended to exposing methods that could be used on each single specific provider
export class Provider {
  constructor() {
    // List of all accepted providers
    this.providers = [
      new NpmProvider(),
      new GitHubProvider(),
      new MavenProvider(),
      new PyPiProvider(),
      new NugetProvider(),
      new RubyGemProvider(),
      new GistProvider()
    ]
  }

  // Accept a URL, and passes to each single provider the properties to analyze it
  async setUrl(url) {
    try {
      const urlObject = new URL(url)
      this.pathname = urlObject.pathname.startsWith('/') ? urlObject.pathname.slice(1) : urlObject.pathname
      this.hostname = urlObject.hostname.replace('www.', '')
      this.urlPath = this.pathname.split('/')
      this.providers.map(provider => provider.setUrl(this.urlPath, this.hostname))
    } catch (errors) {
      return false
    }
  }

  // Given a URL, returns the content of the specific provider
  async getContent() {
    try {
      const content = await this.providers.reduce(async (result, provider) => {
        const isValid = await this.isValid(this.hostname, provider.hostnames)
        if (!isValid) return result
        const returnedContent = await provider.get()
        return returnedContent
      }, false)
      return content
    } catch (errors) {
      console.log(errors)
      return false
    }
  }

  isValid(hostname, hostnames) {
    return this.checkValidHostname(hostnames, hostname)
  }

  checkValidHostname(providerHostnames, hostname) {
    return providerHostnames.indexOf(hostname) >= 0 && true
  }
}

// Implements all the generic methods for the Providers
export class GenericProvider {
  setUrl(urlPath, hostname) {
    this.hostname = hostname
    this.urlPath = urlPath
  }

  providerErrorsFallback(message) {
    return { errors: message }
  }
}

/**
 * Specific provider class that extends the basic functionality of the GenericProvider
 * Each provider could implement specific values and methods, used by the Provider class
 */
export class NpmProvider extends GenericProvider {
  constructor(urlPath, hostname) {
    super(urlPath, hostname)
    this.hostnames = ['npmjs.org', 'npmjs.com'] // Hostnames accepted for this provider
    this.path = 'npm/npmjs' // Basic path structure for this provider
  }

  // Function to parse the URL structure and convert it to specific data of the provider
  get() {
    let nameSpace, name, revision
    if (this.urlPath.length === 5) {
      ;[, nameSpace, name, , revision] = this.urlPath
    } else {
      nameSpace = '-'
      ;[, name, , revision] = this.urlPath
    }
    return revision
      ? `${this.path}/${nameSpace}/${name}/${revision}`
      : this.providerErrorsFallback(`${this.hostname} need a version to be imported`)
  }
}

export class GitHubProvider extends GenericProvider {
  constructor(urlPath, hostname) {
    super(urlPath, hostname)
    this.hostnames = ['github.com']
    this.path = 'git/github'
  }

  get() {
    let packageName, name, revision
    if (this.urlPath.length === 5) {
      ;[packageName, name, , , revision] = this.urlPath
    } else {
      ;[packageName, name, , revision] = this.urlPath
    }
    return revision
      ? `${this.path}/${packageName}/${name}/${revision}`
      : this.providerErrorsFallback(`${this.hostname} need a version to be imported`)
  }
}

export class MavenProvider extends GenericProvider {
  constructor(urlPath, hostname) {
    super(urlPath, hostname)
    this.hostnames = ['mvnrepository.com']
    this.path = 'maven/mavencentral'
  }

  get() {
    const [, name, version, revision] = this.urlPath
    return revision
      ? `${this.path}/${name}/${version}/${revision}`
      : this.providerErrorsFallback(`${this.hostname} need a version to be imported`)
  }
}

export class PyPiProvider extends GenericProvider {
  constructor(urlPath, hostname) {
    super(urlPath, hostname)
    this.hostnames = ['pypi.org']
    this.path = 'pypi/pypi/-'
  }

  get() {
    const [, name, revision] = this.urlPath
    return revision
      ? `${this.path}/${name}/${revision}`
      : this.providerErrorsFallback(`${this.hostname} need a version to be imported`)
  }
}

export class NugetProvider extends GenericProvider {
  constructor(urlPath, hostname) {
    super(urlPath, hostname)
    this.hostnames = ['nuget.org']
    this.path = 'nuget/nuget/-'
  }

  get() {
    const [, name, revision] = this.urlPath
    return revision
      ? `${this.path}/${name}/${revision}`
      : this.providerErrorsFallback(`${this.hostname} need a version to be imported`)
  }
}
export class RubyGemProvider extends GenericProvider {
  constructor(urlPath, hostname) {
    super(urlPath, hostname)
    this.hostnames = ['rubygems.org']
    this.path = 'gem/rubygems/-'
  }

  get() {
    const [, name, , revision] = this.urlPath
    return revision
      ? `${this.path}/${name}/${revision}`
      : this.providerErrorsFallback(`${this.hostname} need a version to be imported`)
  }
}

export class GistProvider extends GenericProvider {
  constructor(urlPath, hostname) {
    super(urlPath, hostname)
    this.hostnames = ['gist.github.com']
  }

  static async save(token, fileName, fileContent) {
    try {
      const res = await createGist(token, {
        files: {
          [fileName]: {
            content: fileContent
          }
        }
      })
      return res.html_url
    } catch (errors) {
      console.log(errors)
    }
  }

  // Gist provider needs to retrieve data from the API
  get() {
    const [user, gistId] = this.urlPath
    if (!gistId) return this.providerErrorsFallback(`${this.hostname} need a valid ID to be imported`)
    return getGist(gistId)
      .then(res => {
        return map(res.files, file => JSON.parse(file.content))[0]
      })
      .catch(errors => console.log(errors))
  }
}
