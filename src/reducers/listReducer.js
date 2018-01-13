// Copyright (c) Microsoft Corporation. All rights reserved.
// SPDX-License-Identifier: MIT

import * as _ from 'lodash'

export const initialState = {
  isFetching: false,
  list: [],
  transformedList: [],
  filter: null,
  error: null,
  hasMore: false,
  headers: null,
  data: null
}

const remove = (list, item) => {
  return list ? _.filter(list, (element) => {return element.id !== item.id } ) : list
}

const add = (list, item) => {
  return list ? [...list, item] : list
}

function computeTranformed(state, append, list, transformer) {
  if (!transformer)
    return state.transformedList 
  const transformed = list.map(entry => transformer(entry))
  return append ? state.transformedList.concat(transformed) : transformed
}

export default (name = '', transformer = null) => {
  return (state = initialState, action) => {
    // if there is a group on the action then it must match this reducer's name
    // otherwise the action type must match the name
    if ((action.group && action.group !== name) || (action.type !== name))
      return state

    if (action.context && action.context.clear) {
      return {
        ...initialState
      }
    }

    const filter = action.context ? action.context.filter : null
    const append = action.context ? action.context.append : false
    const { result, error } = action

    if (!(result || error)) {
      return {
        ...state,
        filter: filter,
        isFetching: true
      }
    }

    if (error) {
      return {
        ...state,
        isFetching: false,
        hasMore: false,
        error: error,
        filter: filter,
        list: [],
        transformedList: []
      }
    }

    if (result.add) {
      return {
        ...state,
        list: add(state.list, result.add),
        transformedList: transformer ? add(state.transformedList, transformer(result.add)) : state.transformedList
      }
    }

    if (result.remove) {
      return {
        ...state,
        list: remove(state.list, result.remove),
        transformedList: transformer ? remove(state.transformedList, transformer(result.add)) : state.transformedList
      }
    }

    if (result) {
      return {
        ...state,
        isFetching: false,
        filter: filter,
        list: (append ? state.list.concat(result.list) : result.list),
        transformedList: computeTranformed(state, append, result.list, transformer),
        hasMore: result.hasMore,
        headers: result.headers
      }
    }
  }
}