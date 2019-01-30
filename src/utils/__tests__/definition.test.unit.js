import Definition from '../definition'

describe('Definition', () => {
  it('returns a definition path', () => {
    expect(Definition.getPathFromUrl({ path: 'npm/npmjs/-/async/2.6.0' })).toBe('npm/npmjs/-/async/2.6.0')
  })
  it('returns a url location to path', () => {
    expect(
      Definition.getPathFromUrl({
        match: { path: '/definitions', url: '/definitions', isExact: false, params: {} },
        location: { pathname: '/definitions/npm/npmjs/-/async/2.6.0', search: '', hash: '' },
        history: {
          length: 3,
          action: 'POP',
          location: { pathname: '/definitions/npm/npmjs/-/async/2.6.0', search: '', hash: '' }
        }
      })
    ).toBe('npm/npmjs/-/async/2.6.0')
  })
})
