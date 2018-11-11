import React from 'react'
import { mount, shallow } from 'enzyme'
import ComponentButtons from '../ComponentButtons'
import { Button, ButtonGroup } from 'react-bootstrap'
import { Menu, Dropdown } from 'antd'

const mockedDefinition = {
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
const mockedComponent = { type: 'npm', provider: 'npmjs', name: 'async', revision: '2.6.0' }

describe('ComponentButtons', () => {
  it('renders without crashing', () => {
    shallow(
      <ComponentButtons
        definition={mockedDefinition}
        currentComponent={mockedComponent}
        readOnly={false}
        hasChange={() => null}
      />
    )
  })
  it('renders all the buttons', async () => {
    const wrapper = mount(
      <ComponentButtons
        definition={mockedDefinition}
        currentComponent={mockedComponent}
        readOnly={false}
        hasChange={() => null}
      />
    )
    expect(wrapper.find(ButtonGroup))
    expect(wrapper.find(Button).length).toBe(6)
  })
  it('check functionality of each button', async () => {
    const wrapper = mount(
      <ComponentButtons
        definition={mockedDefinition}
        currentComponent={mockedComponent}
        readOnly={false}
        hasChange={() => null}
        getDefinition={() => mockedDefinition}
      />
    )
    const buttons = wrapper.find(Button)
    await buttons.forEach(button => button.simulate('click'))
    const dropdown = wrapper.find(Dropdown)
    await dropdown.simulate('click')
    const menuItems = wrapper.find(Menu)
    await menuItems.forEach(menuItem => menuItem.simulate('select'))
  })
})
