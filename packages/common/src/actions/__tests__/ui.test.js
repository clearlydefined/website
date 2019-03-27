import * as actions from '../ui'

describe('ui actions', () => {
  it('should create an action to navigate to an item', () => {
    const navItem = 'Definitions'
    const expectedAction = {
      type: actions.UI_NAVIGATION,
      to: navItem
    }
    expect(actions.uiNavigation(navItem)).toEqual(expectedAction)
  })
})
