// Copyright (c) Microsoft Corporation. All rights reserved.
// SPDX-License-Identifier: MIT

import { combineReducers } from 'redux'
import sessionReducer from './sessionReducer'
import uiReducer from './uiReducer'
import curationReducer from './curationReducer'
import definitionReducer from './definitionReducer'
import harvestReducer from './harvestReducer'

const rootReducer = combineReducers({
  session: sessionReducer,
  ui: uiReducer,
  definition: definitionReducer,
  curation: curationReducer,
  harvest: harvestReducer
})

export default rootReducer
export { default as listReducer } from './listReducer'
export { default as itemReducer } from './itemReducer'
export { default as tableReducer } from './tableReducer'
