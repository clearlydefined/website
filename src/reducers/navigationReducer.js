// Copyright (c) Microsoft Corporation and others. Licensed under the MIT license.
// SPDX-License-Identifier: MIT

import { ROUTE_WORKSPACE, ROUTE_HARVEST, ROUTE_ABOUT, ROUTE_STATS } from '../utils/routingConstants'
import { UI_NAVIGATION } from '../actions/ui'

/**
 * protected:
 * -1 - only public
 * 0 - common
 * 1 - only protected
 */
const initialState = [
  {
    title: 'Workspace',
    to: ROUTE_WORKSPACE,
    protected: 0,
    isSelected: false
  },
  {
    title: 'Harvest',
    to: ROUTE_HARVEST,
    protected: 0,
    isSelected: false,
  },
  {
    title: 'About',
    to: ROUTE_ABOUT,
    protected: 0,
    isSelected: false
  },
  {
    title: 'Stats',
    to: ROUTE_STATS,
    protected: 0,
    isSelected: false
  }
]

export default (state = initialState, action) => {
  switch (action.type) {
    case UI_NAVIGATION:
      const selected = action.to
      return state.map(nav => {
        return { ...nav, isSelected: selected.to === nav.to }
      })
    default:
      return state
  }
}
