import UrlShare from '../urlShare'

describe('UrlShare', () => {
  it('returns an error', () => {
    const urlShare = new UrlShare('invalid (not an object)')
    urlShare.start()
    expect(urlShare.isValid()).toBe('object expected')
  })
  it('returns an error for coordinates field with a wrong type', () => {
    const urlShare = new UrlShare({ ...shareObject, coordinates: 'test' })
    urlShare.start()
    expect(urlShare.isValid()).toBe('coordinates: object expected')
  })
  it('returns an error for filter field with a wrong type', () => {
    const urlShare = new UrlShare({ ...shareObject, filter: true })
    urlShare.start()
    expect(urlShare.isValid()).toBe('filter: string expected')
  })
  it('returns an error for sortBy field with a wrong type', () => {
    const urlShare = new UrlShare({ ...shareObject, sortBy: true })
    urlShare.start()
    expect(urlShare.isValid()).toBe('sortBy: string expected')
  })
})

const shareObject = {
  filter: JSON.stringify({}),
  sortBy: null,
  coordinates: [{ type: 'npm', provider: 'npmjs', name: 'async', revision: '0.2.10' }]
}
