// Copyright (c) Microsoft Corporation and others. Licensed under the MIT license.
// SPDX-License-Identifier: MIT

import { combineReducers } from 'redux'
import { STATS_GET } from '../actions/statsActions'
import tableReducer from './tableReducer'

export default combineReducers({
  bodies: tableReducer(STATS_GET)
})
