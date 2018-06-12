// Copyright (c) Microsoft Corporation and others. Licensed under the MIT license.
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
  data: null,
  sequence: 0
}

const remove = (list, item, comparator = null) => {
  const test = comparator ? element => !comparator(element, item) : element => element !== item
  return list ? _.filter(list, test) : list
}

const add = (list, item, comparator = null) => {
  const test = comparator ? element => comparator(element, item) : element => element === item
  return list && !_.find(list, test) ? [...list, item] : list
}

const addAll = (list, items, comparator = null) => {
  let newList = list
  items.forEach(item => {
    const test = comparator ? element => comparator(element, item) : element => element === item
    newList = newList && !_.find(newList, test) ? [...newList, item] : newList
  })
  return newList
}

const update = (list, item, newValue, comparator = null) => {
  const test = comparator ? element => comparator(element, item) : element => element === item
  const entry = _.findIndex(list, test)
  if (entry < 0) return list
  const result = [...list]
  result[entry] = newValue
  return result
}

function computeTranformed(state, append, list, transformer) {
  if (!transformer) return state.transformedList
  const transformed = list.map(entry => transformer(entry))
  return append ? state.transformedList.concat(transformed) : transformed
}

export default (name = '', transformer = null, comparator = null) => {
  return (state = initialState, action) => {
    // if there is a group on the action then it must match this reducer's name
    // otherwise the action type must match the name
    if ((action.group && action.group !== name) || action.type !== name) return state

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
        sequence: ++state.sequence,
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
        sequence: ++state.sequence,
        list: add(state.list, result.add, comparator),
        transformedList: transformer ? add(state.transformedList, transformer(result.add)) : state.transformedList
      }
    }

    if (result.addAll) {
      return {
        ...state,
        sequence: ++state.sequence,
        list: addAll(state.list, result.addAll, comparator),
        transformedList: transformer ? add(state.transformedList, transformer(result.add)) : state.transformedList
      }
    }

    if (result.remove) {
      return {
        ...state,
        sequence: ++state.sequence,
        list: remove(state.list, result.remove, comparator),
        transformedList: transformer ? remove(state.transformedList, transformer(result.remove)) : state.transformedList
      }
    }

    if (result.update) {
      const newTransformed = transformer ? transformer(result.value) : null
      return {
        ...state,
        sequence: ++state.sequence,
        list: update(state.list, result.update, result.value, comparator),
        transformedList: transformer
          ? update(state.transformedList, transformer(result.update), newTransformed)
          : state.transformedList
      }
    }

    if (result) {
      return {
        ...state,
        sequence: ++state.sequence,
        isFetching: false,
        filter: filter,
        list: append ? state.list.concat(result.list) : result.list,
        transformedList: computeTranformed(state, append, result.list, transformer),
        hasMore: result.hasMore,
        headers: result.headers
      }
    }
  }
}
