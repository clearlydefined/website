import React from 'react'
import { shallow } from 'enzyme'
import FileList from '../FileList'

const files = [
  {
    path: 'AutoMapper.nuspec'
  },
  {
    path: 'lib/net45/AutoMapper.pdb'
  },
  {
    path: 'lib/netcoreapp2.0/AutoMapper.pdb'
  },
  {
    path: 'lib/netstandard1.3/AutoMapper.pdb'
  },
  {
    path: 'lib/netstandard2.0/AutoMapper.pdb'
  },
  {
    path: 'lib/net45/AutoMapper.dll'
  },
  {
    path: 'lib/net45/AutoMapper.xml'
  },
  {
    path: 'lib/netcoreapp2.0/AutoMapper.dll'
  },
  {
    path: 'lib/netcoreapp2.0/AutoMapper.xml'
  },
  {
    path: 'lib/netstandard1.3/AutoMapper.dll'
  },
  {
    path: 'lib/netstandard1.3/AutoMapper.xml'
  },
  {
    path: 'lib/netstandard2.0/AutoMapper.dll'
  },
  {
    path: 'lib/netstandard2.0/AutoMapper.xml'
  }
]

const definition = {
  isFetching: false,
  isFetched: true,
  item: {
    described: {
      sourceLocation: {
        type: 'git',
        provider: 'github',
        url: 'https://github.com/AutoMapper/AutoMapper/commit/75344b28d2152f1570c8261dce7346abfed2b837',
        revision: '75344b28d2152f1570c8261dce7346abfed2b837',
        namespace: 'AutoMapper',
        name: 'AutoMapper'
      },
      releaseDate: '2018-06-18',
      tools: ['clearlydefined/1'],
      toolScore: { total: 100, date: 30, source: 70 },
      score: { total: 100, date: 30, source: 70 }
    },
    files: [
      { path: 'AutoMapper.nuspec' },
      { path: 'lib/net45/AutoMapper.pdb' },
      { path: 'lib/netcoreapp2.0/AutoMapper.pdb' },
      { path: 'lib/netstandard1.3/AutoMapper.pdb' },
      { path: 'lib/netstandard2.0/AutoMapper.pdb' },
      { path: 'lib/net45/AutoMapper.dll' },
      { path: 'lib/net45/AutoMapper.xml' },
      { path: 'lib/netcoreapp2.0/AutoMapper.dll' },
      { path: 'lib/netcoreapp2.0/AutoMapper.xml' },
      { path: 'lib/netstandard1.3/AutoMapper.dll' },
      { path: 'lib/netstandard1.3/AutoMapper.xml' },
      { path: 'lib/netstandard2.0/AutoMapper.dll' },
      { path: 'lib/netstandard2.0/AutoMapper.xml' }
    ],
    coordinates: { type: 'nuget', provider: 'nuget', name: 'AutoMapper', revision: '7.0.1' },
    licensed: {
      toolScore: { total: 0, declared: 0, discovered: 0, consistency: 0, spdx: 0, texts: 0 },
      facets: { core: { attribution: { unknown: 13 }, discovered: { unknown: 13 }, files: 13 } },
      score: { total: 0, declared: 0, discovered: 0, consistency: 0, spdx: 0, texts: 0 }
    },
    schemaVersion: '1.1.0'
  },
  transformed:
    "coordinates:\n  name: AutoMapper\n  provider: nuget\n  revision: 7.0.1\n  type: nuget\ndescribed:\n  releaseDate: '2018-06-18'\n  score:\n    date: 30\n    source: 70\n    total: 100\n  sourceLocation:\n    name: AutoMapper\n    namespace: AutoMapper\n    provider: github\n    revision: 75344b28d2152f1570c8261dce7346abfed2b837\n    type: git\n    url: >-\n      https://github.com/AutoMapper/AutoMapper/commit/75344b28d2152f1570c8261dce7346abfed2b837\n  toolScore:\n    date: 30\n    source: 70\n    total: 100\n  tools:\n    - clearlydefined/1\nfiles:\n  - path: AutoMapper.nuspec\n  - path: lib/net45/AutoMapper.pdb\n  - path: lib/netcoreapp2.0/AutoMapper.pdb\n  - path: lib/netstandard1.3/AutoMapper.pdb\n  - path: lib/netstandard2.0/AutoMapper.pdb\n  - path: lib/net45/AutoMapper.dll\n  - path: lib/net45/AutoMapper.xml\n  - path: lib/netcoreapp2.0/AutoMapper.dll\n  - path: lib/netcoreapp2.0/AutoMapper.xml\n  - path: lib/netstandard1.3/AutoMapper.dll\n  - path: lib/netstandard1.3/AutoMapper.xml\n  - path: lib/netstandard2.0/AutoMapper.dll\n  - path: lib/netstandard2.0/AutoMapper.xml\nlicensed:\n  facets:\n    core:\n      attribution:\n        unknown: 13\n      discovered:\n        unknown: 13\n      files: 13\n  score:\n    consistency: 0\n    declared: 0\n    discovered: 0\n    spdx: 0\n    texts: 0\n    total: 0\n  toolScore:\n    consistency: 0\n    declared: 0\n    discovered: 0\n    spdx: 0\n    texts: 0\n    total: 0\nschemaVersion: 1.1.0\n",
  error: null,
  deleted: false
}

describe('FileList', () => {
  it('renders without crashing', () => {
    shallow(<FileList />)
  })
})
