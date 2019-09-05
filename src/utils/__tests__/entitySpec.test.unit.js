// Copyright (c) Microsoft Corporation and others. Licensed under the MIT license.
// SPDX-License-Identifier: MIT

import EntitySpec from '../../utils/entitySpec'

describe('EntitySpec', () => {
  it('non-URL throws', () => {
    try {
      EntitySpec.fromUrl('dfgsfgdfg')
      expect(true).toEqual(false)
    } catch (error) {
      expect(!!error).toEqual(true)
    }
  })

  it('non-supported URL throws', async () => {
    try {
      EntitySpec.fromUrl('http"//foo.com')
      expect(true).toEqual(false)
    } catch (error) {
      expect(!!error).toEqual(true)
    }
  })

  it('returns a npm path with a version', async () => {
    const result = EntitySpec.fromUrl('https://www.npmjs.com/package/async/v/2.6.0')
    expect(result.toString()).toEqual('npm/npmjs/-/async/2.6.0')
  })

  it('returns a npm path without a version', async () => {
    const result = EntitySpec.fromUrl('https://www.npmjs.com/package/async')
    expect(result.toString()).toEqual('npm/npmjs/-/async')
  })

  it('returns a namespaced npm path with a version', async () => {
    const result = EntitySpec.fromUrl('https://www.npmjs.com/package/@test/async/v/2.6.0')
    expect(result.toString()).toEqual('npm/npmjs/@test/async/2.6.0')
  })

  it('returns a namespaced npm path without a version', async () => {
    const result = EntitySpec.fromUrl('https://www.npmjs.com/package/@test/async')
    expect(result.toString()).toEqual('npm/npmjs/@test/async')
  })

  it('returns a github tag path with a version', async () => {
    const result = EntitySpec.fromUrl('https://github.com/github/fetch/releases/tag/v3.0.0')
    expect(result.toString()).toEqual('git/github/github/fetch/v3.0.0')
  })

  it('returns a github tag path without a version', async () => {
    const result = EntitySpec.fromUrl('https://github.com/github/fetch')
    expect(result.toString()).toEqual('git/github/github/fetch')
  })

  it('returns a github commit path with a version', async () => {
    const result = EntitySpec.fromUrl('https://github.com/github/fetch/commit/d4ed806fdcbdeaef707d27f6c88943f0336a647d')
    expect(result.toString()).toEqual('git/github/github/fetch/d4ed806fdcbdeaef707d27f6c88943f0336a647d')
  })

  it('returns a maven path with a version', async () => {
    const result = EntitySpec.fromUrl('https://mvnrepository.com/artifact/cc.mallet/mallet/2.0.8')
    expect(result.toString()).toEqual('maven/mavencentral/cc.mallet/mallet/2.0.8')
  })

  it('returns a maven path without a version', async () => {
    const result = EntitySpec.fromUrl('https://mvnrepository.com/artifact/cc.mallet/mallet')
    expect(result.toString()).toEqual('maven/mavencentral/cc.mallet/mallet')
  })

  it('returns a pypi path with a version', async () => {
    const result = EntitySpec.fromUrl('https://pypi.org/project/pyaml/17.8.0/')
    expect(result.toString()).toEqual('pypi/pypi/-/pyaml/17.8.0')
  })

  it('returns a pypi path without a version', async () => {
    const result = EntitySpec.fromUrl('https://pypi.org/project/pyaml')
    expect(result.toString()).toEqual('pypi/pypi/-/pyaml')
  })

  it('returns a nuget path with a version', async () => {
    const result = EntitySpec.fromUrl('https://nuget.org/packages/NuGet.VisualStudio/2.8.2')
    expect(result.toString()).toEqual('nuget/nuget/-/NuGet.VisualStudio/2.8.2')
  })

  it('returns a rubygem path with a version', async () => {
    const result = EntitySpec.fromUrl('https://rubygems.org/gems/tzinfo/versions/1.2.5')
    expect(result.toString()).toEqual('gem/rubygems/-/tzinfo/1.2.5')
  })

  it('returns a debian path with a version', async () => {
    const result = EntitySpec.fromUrl(
      'http://ftp.debian.org/debian/pool/main/m/m2m-aligner/m2m-aligner_1.2-2_amd64.deb'
    )
    expect(result.toString()).toEqual('deb/debian/-/m2m-aligner/1.2-2_amd64')
  })
})
