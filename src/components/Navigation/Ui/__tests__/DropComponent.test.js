import React from 'react'
import { shallow, mount } from 'enzyme'
import ConnectedDropComponent, { DropComponent } from '../DropComponent'
import configureMockStore from 'redux-mock-store'
import thunk from 'redux-thunk'
import ComponentList from '../../../ComponentList'
const middlewares = [thunk]
const mockStore = configureMockStore(middlewares)

const store = mockStore({ session: { token: '' } })
const props = {
  children: <ComponentList renderFilterBar={() => null} />,
  dispatch: () => {
    return {}
  }
}

describe('DropComponent', () => {
  it('renders connected component without crashing', () => {
    shallow(<ConnectedDropComponent store={store} {...props} />)
  })
  it('renders component without crashing', () => {
    shallow(<DropComponent {...props} />)
  })
  describe('drops json file', () => {
    it('configure data transfer', async () => {
      const onLoad = jest.fn()
      const wrapper = shallow(<DropComponent {...props} onLoad={onLoad} />)
      const instance = wrapper.instance()

      const st = JSON.stringify(fossaInput)
      const blob = new Blob([st])
      const file = new File([blob], 'fossaInput.json', { type: 'application/json' })
      const mockDataTransfer = [file]
      const event = createCustomEvent(EVENT_TYPES.DRAG_START, {}, mockDataTransfer)
      const dropEvent = createCustomEvent(EVENT_TYPES.DROP)
      dropEvent.dataTransfer = event.dataTransfer

      const handleDropFiles = jest.spyOn(instance, 'handleDropFiles')
      const handleTextDrop = jest.spyOn(instance, 'handleTextDrop')
      const handleDropAcceptedFiles = jest.spyOn(instance, 'handleDropAcceptedFiles')
      try {
        const res = await instance.onDrop(dropEvent)
        expect(handleDropFiles).toHaveBeenCalled()
        expect(handleTextDrop).toHaveBeenCalled()
        expect(handleDropAcceptedFiles).toHaveBeenCalled()
      } catch (error) {
        expect(error).toBe('ClearlyDefined does not understand whatever it is you just dropped')
      }
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
      { locator: 'npm+setprototypeof$1.1.0' },
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

function createCustomEvent(type, data, files) {
  var event = new CustomEvent('CustomEvent')
  event.initCustomEvent(type, true, true, null)
  event.dataTransfer = {
    data,
    files,
    setData: function(type, val) {
      this.data[type] = val
    },
    getData: function(type) {
      return this.data[type]
    },
    persist: jest.fn()
  }
  return event
}

const EVENT_TYPES = {
  DRAG_END: 'dragend',
  DRAG_START: 'dragstart',
  DROP: 'drop'
}
