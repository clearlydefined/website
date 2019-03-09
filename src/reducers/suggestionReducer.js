// Copyright (c) Microsoft Corporation and others. Licensed under the MIT license.
// SPDX-License-Identifier: MIT

import { combineReducers } from 'redux'
import { UI_INSPECT_GET_SUGGESTIONS } from '../actions/ui'
import tableReducer from './tableReducer'

export default combineReducers({
  suggestions: tableReducer(UI_INSPECT_GET_SUGGESTIONS)
})
