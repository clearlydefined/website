import React from 'react'
import { shallow } from 'enzyme'
import { Button, ToggleButton, ToggleButtonGroup } from 'react-bootstrap'
import RuleBuilder from '../RuleBuilder'

describe('RuleBuilder', () => {
  it('renders without crashing', () => {
    shallow(<RuleBuilder rule={{}} />)
  })
  it('checks if ToggleButtonGroup exists', async () => {
    const changeRulesOperator = jest.fn()
    const wrapper = shallow(<RuleBuilder rule={{ license: 'MIT' }} changeRulesOperator={changeRulesOperator} />)
    const wrapperToggleButtonGroup = wrapper.find(ToggleButtonGroup)
    expect(wrapper.find(ToggleButtonGroup).exists()).toBeTruthy()
    expect(wrapperToggleButtonGroup.find(ToggleButton).exists()).toBeTruthy()
    expect(wrapper.find(Button).exists()).toBeTruthy()
  })
  it('checks if changeRulesOperator callback is called', async () => {
    const changeRulesOperator = jest.fn()
    const wrapper = shallow(<RuleBuilder rule={{ license: 'MIT' }} changeRulesOperator={changeRulesOperator} />)
    const wrapperToggleButtonGroup = wrapper.find(ToggleButtonGroup)
    wrapperToggleButtonGroup.simulate('change')
    expect(changeRulesOperator).toHaveBeenCalled()
  })
  it('checks if changeRulesOperator callback is called', async () => {
    const changeRulesOperator = jest.fn()
    const wrapper = shallow(
      <RuleBuilder
        rule={{ conjunction: 'OR', left: { license: 'MIT' }, right: { license: 'Apache-2.0' } }}
        changeRulesOperator={changeRulesOperator}
      />
    )
    const wrapperToggleButtonGroup = wrapper.find(ToggleButtonGroup)
    wrapperToggleButtonGroup.simulate('change')
    expect(changeRulesOperator).toHaveBeenCalled()
  })
  it('checks if addNewGroup callback is called', async () => {
    const addNewGroup = jest.fn()
    const wrapper = shallow(
      <RuleBuilder
        rule={{ conjunction: 'OR', left: { license: 'MIT' }, right: { license: 'Apache-2.0' } }}
        addNewGroup={addNewGroup}
      />
    )
    const addNewGroupButton = wrapper.find('#addNewGroup')
    addNewGroupButton.simulate('click')
    expect(addNewGroup).toHaveBeenCalled()
  })
  it('checks if addNewGroup callback is called', async () => {
    const removeRule = jest.fn()
    const wrapper = shallow(
      <RuleBuilder
        rule={{
          conjunction: 'OR',
          left: { license: 'MIT' },
          right: { conjunction: 'OR', left: { license: 'MIT' }, right: { license: 'Apache-2.0' } }
        }}
        removeRule={removeRule}
      />
    )
    const removeRuleButton = wrapper.find('#removeRule')
    removeRuleButton.simulate('click')
    expect(removeRule).toHaveBeenCalled()
  })
})
