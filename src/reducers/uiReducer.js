// Copyright (c) Microsoft Corporation. All rights reserved.
// SPDX-License-Identifier: MIT

import { combineReducers } from 'redux'
import { ROUTE_ROOT, ROUTE_CURATE, ROUTE_COMPONENTS, ROUTE_HARVEST, ROUTE_ABOUT } from '../utils/routingConstants'
import { UI_NAVIGATION, UI_CURATE_UPDATE_FILTER, UI_BROWSE_UPDATE_FILTER, UI_HARVEST_UPDATE_FILTER } from '../actions/ui'

/**
 * protected:
 * -1 - only public
 * 0 - common
 * 1 - only protected
 */
const initialStateNavigation = [
  {
    title: "Home",
    to: ROUTE_ROOT,
    protected: 0,
    isSelected: true,
  },
  {
    title: "Browse",
    to: ROUTE_COMPONENTS,
    protected: 1,
    isSelected: false,
  },
  {
    title: "Curate",
    to: ROUTE_CURATE,
    protected: 1,
    isSelected: false,
  },
  {
    title: "Harvest",
    to: ROUTE_HARVEST,
    protected: 1,
    isSelected: false,
  },
  {
    title: "About",
    to: ROUTE_ABOUT,
    protected: 0,
    isSelected: false,
  }
]

const navigation = (state = initialStateNavigation, action) => {
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

const initialCurate = { filter: null }
const curate = (state = initialCurate, action) => {
  switch (action.type) {
    case UI_CURATE_UPDATE_FILTER:
      return { ...state, filter: action.value }
    default:
      return state
  }
}

const initialBrowse = { filter: null }
const browse = (state = initialBrowse, action) => {
  switch (action.type) {
    case UI_BROWSE_UPDATE_FILTER:
      return { ...state, filter: action.value }
    default:
      return state
  }
}

const initialHarvest = { filter: null }
const harvest = (state = initialHarvest, action) => {
  switch (action.type) {
    case UI_HARVEST_UPDATE_FILTER:
      return { ...state, filter: action.value }
    default:
      return state
  }
}

export default combineReducers({
  navigation,
  browse,
  curate,
  harvest
})
