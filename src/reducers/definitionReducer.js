// Copyright (c) Microsoft Corporation. All rights reserved.
// SPDX-License-Identifier: MIT

import { combineReducers } from 'redux'
import { DEFINITION_GET, DEFINITION_GET_PROPOSED, DEFINITION_BODIES, DEFINITION_PREVIEW, DEFINITION_LIST } from '../actions/definitionActions'
import itemReducer from './itemReducer'
import listReducer from './listReducer'
import tableReducer from './tableReducer'
import yaml from 'js-yaml'

export default combineReducers({
  current: new itemReducer(DEFINITION_GET, item => yaml.safeDump(item, { sortKeys: true })),
  proposed: new itemReducer(DEFINITION_GET_PROPOSED),
  preview: new itemReducer(DEFINITION_PREVIEW),
  list: new listReducer(DEFINITION_LIST, item => { return { path: item } }),
  bodies: tableReducer(DEFINITION_BODIES)
})
