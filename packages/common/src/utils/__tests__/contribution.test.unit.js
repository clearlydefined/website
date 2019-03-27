import Contribution from '../contribution'

describe('Contribution', () => {
  it('returns a definition without a license', () => {
    const resultDefinition = Contribution.foldFacets(definitionWithoutLicense)
    expect(resultDefinition.licensed.declared).toBe(definitionWithoutLicense.licensed.declared)
  })
})

const definitionWithoutLicense = {
  described: {
    releaseDate: '2014-05-22',
    tools: ['clearlydefined/1'],
    toolScore: { total: 30, date: 30, source: 0 },
    score: { total: 30, date: 30, source: 0 }
  },
  licensed: {
    declared: 'NOASSERTION',
    toolScore: { total: 15, declared: 0, discovered: 0, consistency: 15, spdx: 0, texts: 0 },
    score: { total: 15, declared: 0, discovered: 0, consistency: 15, spdx: 0, texts: 0 }
  },
  coordinates: { type: 'nuget', provider: 'nuget', name: 'NuGet.VisualStudio', revision: '2.8.2' },
  _meta: { schemaVersion: '1.4.0', updated: '2019-01-31T15:52:01.267Z' }
}
