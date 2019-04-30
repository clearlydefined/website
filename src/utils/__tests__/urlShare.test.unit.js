import UrlShare from '../urlShare'

describe('UrlShare', () => {
  it('returns an error for coordinates field with a wrong type', () => {
    const urlShare = new UrlShare({ ...shareObject, coordinates: {} })
    urlShare.start()
    expect(urlShare.isValid()).toBe('coordinates: string expected')
  })
  it('returns an error', () => {
    const urlShare = new UrlShare('invalid (not an object)')
    //expect(urlShare.isValid()).toBe('object expected')
  })
})

const shareObject = {
  filter: JSON.stringify({}),
  sortBy: null,
  coordinates: [{ type: 'npm', provider: 'npmjs', name: 'async', revision: '0.2.10' }]
}
