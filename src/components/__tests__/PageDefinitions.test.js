import React from 'react'
import { shallow } from 'enzyme'
import configureMockStore from 'redux-mock-store'
import thunk from 'redux-thunk'
import ConnectedPageDefinitions, { PageDefinitions } from '../Navigation/Pages/PageDefinitions'
const middlewares = [thunk]
const mockStore = configureMockStore(middlewares)

const props = {
  match: { path: '/definitions', url: '/definitions', isExact: true, params: {} },
  location: { pathname: '/definitions', search: '', hash: '', key: 'ip23w9' },
  components: { list: [], transformedList: [] },
  path: [],
  dispatch: () => {
    return {}
  },
  session: {}
}

describe('PageDefinitions', () => {
  it('renders without crashing', () => {
    const store = mockStore({
      session: { token: '' },
      ui: {
        definitions: {
          filter: {},
          filterList: {},
          componentList: {}
        },
        curate: {
          bodies: {}
        }
      },
      definition: {
        bodies: {}
      }
    })

    shallow(<ConnectedPageDefinitions store={store} {...props} />)
  })
  describe('drop files', () => {
    it('drop fossa input', async () => {
      const wrapper = shallow(<PageDefinitions {...props} />)
      const instance = wrapper.instance()
      const isFossaInput = jest.spyOn(instance, 'isFossaInput')
      const getListFromFossaPackage = jest.spyOn(instance, 'getListFromFossaPackage')
      const res = instance.getList(fossaInput)
      expect(isFossaInput).toHaveBeenCalled()
      expect(getListFromFossaPackage).toHaveBeenCalled()
      expect(res).toEqual(expectedFossaCoordinates)
    })
  })
})

const fossaInput = {
  Name: 'package',
  Type: 'commonjspackage',
  Manifest: 'package',
  Build: {
    Artifact: 'default',
    Context: null,
    Succeeded: true,
    Imports: [
      'npm+path-is-absolute$',
      'npm+fs.realpath$',
      'npm+inflight$',
      'npm+inherits$',
      'npm+minimatch$',
      'npm+once$'
    ],
    Dependencies: [
      { locator: 'npm+test/setprototypeof$1.1.0' },
      {
        locator: 'npm+handlebars$4.1.0',
        imports: ['npm+async$2.6.2', 'npm+source-map$0.6.1', 'npm+optimist$0.6.1', 'npm+uglify-js$3.4.9']
      },
      { locator: 'npm+no-case$2.3.2', imports: ['npm+lower-case$1.1.4'] },
      { locator: 'npm+clean-css$4.2.1', imports: ['npm+source-map$0.6.1'] },
      { locator: 'npm+component-emitter$1.2.1' },
      {
        locator: 'npm+readdirp$2.1.0',
        imports: [
          'npm+set-immediate-shim$1.0.1',
          'npm+graceful-fs$4.1.11',
          'npm+minimatch$3.0.4',
          'npm+readable-stream$2.0.6'
        ]
      }
    ]
  }
}

const expectedFossaCoordinates = {
  coordinates: [
    { name: 'setprototypeof', namespace: 'test', provider: 'npmjs', revision: '1.1.0', type: 'npm' },
    { name: 'handlebars', namespace: '-', provider: 'npmjs', revision: '4.1.0', type: 'npm' },
    { name: 'no-case', namespace: '-', provider: 'npmjs', revision: '2.3.2', type: 'npm' },
    { name: 'clean-css', namespace: '-', provider: 'npmjs', revision: '4.2.1', type: 'npm' },
    { name: 'component-emitter', namespace: '-', provider: 'npmjs', revision: '1.2.1', type: 'npm' },
    { name: 'readdirp', namespace: '-', provider: 'npmjs', revision: '2.1.0', type: 'npm' }
  ]
}
