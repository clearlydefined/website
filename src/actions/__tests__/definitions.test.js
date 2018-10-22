import configureMockStore from 'redux-mock-store'
import thunk from 'redux-thunk'
import fetchMock from 'fetch-mock'
import * as definitionActions from '../definitionActions'
import { DEFINITIONS, url } from '../../api/clearlyDefined'
import { asyncActions } from '..'

const middlewares = [thunk]
const mockStore = configureMockStore(middlewares)
const mockedDefinition = {
  'npm/npmjs/-/async/2.6.0': {
    described: {
      sourceLocation: {
        type: 'git',
        provider: 'github',
        url: 'https://github.com/caolan/async/commit/ba6ed320e350f8b2eae4eb9683302ddac0ddf66f',
        revision: 'ba6ed320e350f8b2eae4eb9683302ddac0ddf66f',
        namespace: 'caolan',
        name: 'async'
      },
      releaseDate: '2017-11-16',
      projectWebsite: 'https://caolan.github.io/async/',
      issueTracker: 'https://github.com/caolan/async/issues',
      tools: ['scancode/2.2.1', 'clearlydefined/1', 'curation/63b2dde4188849a660de4ebe44f301f34c2e7886'],
      toolScore: 2,
      score: 2
    },
    licensed: {
      declared: 'Apache-2.0',
      toolScore: 2,
      facets: {
        core: {
          attribution: { unknown: 2, parties: ['Copyright (c) 2010-2017 Caolan McMahon'] },
          discovered: { unknown: 1, expressions: ['MIT'] },
          files: 3
        }
      },
      score: 2
    },
    files: [
      { path: 'package/bower.json' },
      { path: 'package/LICENSE', license: 'MIT', attributions: ['Copyright (c) 2010-2017 Caolan McMahon'] },
      { path: 'package/package.json', license: 'MIT' }
    ],
    coordinates: { type: 'npm', provider: 'npmjs', name: 'async', revision: '2.6.0' },
    schemaVersion: '1.0.0'
  }
}

describe('definitions actions', () => {
  afterEach(() => {
    fetchMock.reset()
    fetchMock.restore()
  })
  it('creates DEFINITION_BODIES when fetching definitions has completed', async () => {
    await fetchMock.postOnce(url(`${DEFINITIONS}`), {
      body: mockedDefinition,
      headers: { 'content-type': 'application/json' }
    })
    const actions = asyncActions(definitionActions.DEFINITION_BODIES)
    const expectedActions = [
      actions.start(),
      actions.success({
        add: mockedDefinition
      })
    ]
    const store = mockStore({ todos: [] })

    return store.dispatch(definitionActions.getDefinitionsAction()).then(() => {
      // return of async actions
      expect(store.getActions()).toEqual(expectedActions)
    })
  })
})
