import { Provider } from '../providers'

describe('Provider', () => {
  it('dropping a non-URL, it should return false', async () => {
    const provider = new Provider()
    const result = await provider.setUrl('dfgsfgdfg')
    expect(result).toEqual(false)
  })
  it('returns a npm path without version, returns an error message', async () => {
    const provider = new Provider()
    const providerResult = await provider.setUrl('https://www.npmjs.com/package/deep-diff')
    const result = await provider.getContent()
    expect(result).toEqual({ errors: 'npmjs.com need a version to be imported' })
  })
  it('returns a npm path with a version', async () => {
    const provider = new Provider()
    const providerResult = await provider.setUrl('https://www.npmjs.com/package/async/v/2.6.0')
    const result = await provider.getContent()
    expect(result).toEqual('npm/npmjs/-/async/2.6.0')
  })
  it('returns a github path with a version', async () => {
    const provider = new Provider()
    const providerResult = await provider.setUrl('https://github.com/github/fetch/releases/tag/v3.0.0')
    const result = await provider.getContent()
    expect(result).toEqual('git/github/github/fetch/v3.0.0')
  })
  it('returns a github path with a version', async () => {
    const provider = new Provider()
    const providerResult = await provider.setUrl(
      'https://github.com/github/fetch/commit/d4ed806fdcbdeaef707d27f6c88943f0336a647d'
    )
    const result = await provider.getContent()
    expect(result).toEqual('git/github/github/fetch/d4ed806fdcbdeaef707d27f6c88943f0336a647d')
  })
  it('posting a github path without version, returns an error message', async () => {
    const provider = new Provider()
    const providerResult = await provider.setUrl('https://github.com/github/fetch')
    const result = await provider.getContent()
    expect(result).toEqual({ errors: 'github.com need a version to be imported' })
  })
  it('returns a maven path with a version', async () => {
    const provider = new Provider()
    const providerResult = await provider.setUrl('https://mvnrepository.com/artifact/cc.mallet/mallet/2.0.8')
    const result = await provider.getContent()
    expect(result).toEqual('maven/mavencentral/cc.mallet/mallet/2.0.8')
  })
  it('posting a maven path without a version, returns an error message', async () => {
    const provider = new Provider()
    const providerResult = await provider.setUrl('https://mvnrepository.com/artifact/cc.mallet/mallet')
    const result = await provider.getContent()
    expect(result).toEqual({ errors: 'mvnrepository.com need a version to be imported' })
  })
  it('returns a pypi path with a version', async () => {
    const provider = new Provider()
    const providerResult = await provider.setUrl('https://pypi.org/project/pyaml/17.8.0/')
    const result = await provider.getContent()
    expect(result).toEqual('pypi/pypi/-/pyaml/17.8.0')
  })
  it('posting a pypi path without a version, returns an error message', async () => {
    const provider = new Provider()
    const providerResult = await provider.setUrl('https://pypi.org/project/pyaml/')
    const result = await provider.getContent()
    expect(result).toEqual({ errors: 'pypi.org need a version to be imported' })
  })
  it('returns a nuget path with a version', async () => {
    const provider = new Provider()
    provider.setUrl('https://nuget.org/packages/NuGet.VisualStudio/2.8.2')
    const result = await provider.getContent()
    expect(result).toEqual('nuget/nuget/-/NuGet.VisualStudio/2.8.2')
  })
  it('posting a nuget path without a version, returns an error message', async () => {
    const provider = new Provider()
    const providerResult = await provider.setUrl('https://www.nuget.org/packages/NuGet.VisualStudio/')
    const result = await provider.getContent()
    expect(result).toEqual({ errors: 'nuget.org need a version to be imported' })
  })
  it('returns a rubygem path with a version', async () => {
    const provider = new Provider()
    const providerResult = await provider.setUrl('https://rubygems.org/gems/tzinfo/versions/1.2.5')
    const result = await provider.getContent()
    expect(result).toEqual('gem/rubygems/-/tzinfo/1.2.5')
  })
  it('posting a rubygem path without a version, returns an error message', async () => {
    const provider = new Provider()
    const providerResult = await provider.setUrl('https://rubygems.org/gems/tzinfo')
    const result = await provider.getContent()
    expect(result).toEqual({ errors: 'rubygems.org need a version to be imported' })
  })
  it('posting a gist url without id, returns an error message', async () => {
    const provider = new Provider()
    // TODO: find a strategy to test gist url for the user during the CI process, currently is used a specific gist URL
    const providerResult = await provider.setUrl('https://gist.github.com/storrisi')
    const result = await provider.getContent()
    expect(result).toEqual({ errors: 'gist.github.com need a valid ID to be imported' })
  })
  it('returns a gist content', async () => {
    const provider = new Provider()
    // TODO: find a strategy to test gist url for the user during the CI process, currently is used a specific gist URL
    const providerResult = await provider.setUrl('https://gist.github.com/storrisi/1cf5f1dba25e670d48b1ff1fd0b76528')
    const result = await provider.getContent()
    expect(result).toEqual({
      coordinates: [{ name: 'async', provider: 'npmjs', revision: '2.6.0', type: 'npm' }],
      filter: {},
      sortBy: null
    })
  })
})
