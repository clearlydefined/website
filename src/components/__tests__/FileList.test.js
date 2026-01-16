import React from 'react'
import { render } from '@testing-library/react'
import { Provider } from 'react-redux'
import configureMockStore from 'redux-mock-store'
import thunk from 'redux-thunk'
import FileList from '../FileList'

const middlewares = [thunk]
const mockStore = configureMockStore(middlewares)

const store = mockStore({
  session: { token: '' },
  suggestion: { suggestions: {} }
})

const files = [
  { path: 'AutoMapper.nuspec' },
  { path: 'lib/net45/AutoMapper.pdb' },
  { path: 'lib/netcoreapp2.0/AutoMapper.pdb' }
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
    files: files,
    coordinates: { type: 'nuget', provider: 'nuget', name: 'AutoMapper', revision: '7.0.1' },
    licensed: {
      toolScore: { total: 0, declared: 0, discovered: 0, consistency: 0, spdx: 0, texts: 0 },
      facets: { core: { attribution: { unknown: 13 }, discovered: { unknown: 13 }, files: 13 } },
      score: { total: 0, declared: 0, discovered: 0, consistency: 0, spdx: 0, texts: 0 }
    },
    schemaVersion: '1.1.0'
  }
}

describe('FileList', () => {
  it('renders without crashing', () => {
    render(
      <Provider store={store}>
        <FileList component={definition} files={files} />
      </Provider>
    )
  })
})
