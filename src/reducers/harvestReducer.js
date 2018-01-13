// Copyright (c) Microsoft Corporation. All rights reserved.
// SPDX-License-Identifier: MIT

import { combineReducers } from 'redux'
import { HARVEST_GET } from '../actions/harvestActions'
import itemReducer from './itemReducer'

export default combineReducers({
  current: new itemReducer(HARVEST_GET, item => JSON.stringify(item, null, 2)),
})
