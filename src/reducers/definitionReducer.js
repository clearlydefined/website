// Copyright (c) Microsoft Corporation.
// SPDX-License-Identifier: MIT

import { combineReducers } from 'redux'
import { DEFINITION_BODIES, DEFINITION_LIST } from '../actions/definitionActions'
import listReducer from './listReducer'
import tableReducer from './tableReducer'

export default combineReducers({
  list: new listReducer(DEFINITION_LIST, item => { return { path: item } }),
  bodies: tableReducer(DEFINITION_BODIES)
})
