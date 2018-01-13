// Copyright (c) Microsoft Corporation. All rights reserved.
// SPDX-License-Identifier: MIT

import { combineReducers } from 'redux'
import { CURATION_GET, CURATION_GET_PROPOSED } from '../actions/curationActions'
import itemReducer from './itemReducer'
import yaml from 'js-yaml'

export default combineReducers({
  current: new itemReducer(CURATION_GET, item => yaml.saveDump(item)),
  proposed: new itemReducer(CURATION_GET_PROPOSED)
})
