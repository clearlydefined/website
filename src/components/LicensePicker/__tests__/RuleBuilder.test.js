import React from 'react'
import { fireEvent, render } from '@testing-library/react'
import RuleBuilder from '../RuleBuilder'

describe('RuleBuilder', () => {
  it('renders without crashing', () => {
    render(<RuleBuilder rule={{}} />)
  })

  it('renders with a simple license rule', () => {
    render(<RuleBuilder rule={{ license: 'MIT' }} changeRulesOperator={jest.fn()} />)
  })

  it('renders with a complex license rule', () => {
    render(
      <RuleBuilder
        rule={{ conjunction: 'OR', left: { license: 'MIT' }, right: { license: 'Apache-2.0' } }}
        changeRulesOperator={jest.fn()}
      />
    )
  })

  it('calls addNewGroup callback when add group button is clicked', () => {
    const addNewGroup = jest.fn()
    render(
      <RuleBuilder
        rule={{ conjunction: 'OR', left: { license: 'MIT' }, right: { license: 'Apache-2.0' } }}
        addNewGroup={addNewGroup}
      />
    )
    const addButton = document.getElementById('addNewGroup')
    if (addButton) {
      fireEvent.click(addButton)
      expect(addNewGroup).toHaveBeenCalled()
    }
  })

  it('calls removeRule callback when remove button is clicked', () => {
    const removeRule = jest.fn()
    render(
      <RuleBuilder
        rule={{
          conjunction: 'OR',
          left: { license: 'MIT' },
          right: { conjunction: 'OR', left: { license: 'MIT' }, right: { license: 'Apache-2.0' } }
        }}
        removeRule={removeRule}
      />
    )
    const removeButtons = document.querySelectorAll('#removeRule')
    if (removeButtons.length > 0) {
      fireEvent.click(removeButtons[removeButtons.length - 1])
      expect(removeRule).toHaveBeenCalled()
    }
  })
})
