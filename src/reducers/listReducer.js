// Copyright (c) Microsoft Corporation and others. Licensed under the MIT license.
// SPDX-License-Identifier: MIT

import _ from 'lodash'

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

const addAll = (list, items) => {
  return _.uniqWith(_.union(list, items), _.isEqual)
}

const update = (list, item, newValue, comparator = null) => {
  const test = comparator ? element => comparator(element, item) : element => element === item
  const entry = _.findIndex(list, test)
  if (entry < 0) return list
  const result = [...list]
  result[entry] = newValue
  return result
}

const transform = (list, transforms) => {
  let newList = list
  for (let transform in transforms) {
    const transformFunction = transforms[transform].func
    if (transform === 'sort') {
      const sortFunction = transforms[transform].sortFunction
      newList = transformFunction(newList, sortFunction)
    } else if (transform === 'filter') {
      const activeFilters = transforms[transform].activeFilters
      newList = transformFunction(newList, activeFilters)
    }
  }
  return newList
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
      const newList = add(state.list, result.add, comparator)
      return {
        ...state,
        sequence: ++state.sequence,
        list: newList,
        transformedList: transformer ? transformer(newList) : newList
      }
    }

    if (result.addAll) {
      const newList = addAll(state.list, result.addAll)
      return {
        ...state,
        sequence: ++state.sequence,
        list: newList,
        transformedList: transformer ? transformer(newList) : newList
      }
    }

    if (result.remove) {
      const newList = remove(state.list, result.remove, comparator)
      return {
        ...state,
        sequence: ++state.sequence,
        list: newList,
        transformedList: transformer ? transform(newList, transformer) : newList
      }
    }

    if (result.removeAll) {
      return {
        ...state,
        sequence: ++state.sequence,
        list: [],
        transformedList: []
      }
    }

    if (result.update) {
      const newList = update(state.list, result.update, result.value, comparator)
      return {
        ...state,
        sequence: ++state.sequence,
        list: newList,
        transformedList: transformer ? transformer(newList) : newList
      }
    }

    if (result.transform) {
      transformer = result.transform
      return {
        ...state,
        sequence: ++state.sequence,
        transformedList: transformer(state.list)
      }
    }

    if (result) {
      return {
        ...state,
        sequence: ++state.sequence,
        isFetching: false,
        filter: filter,
        list: append ? state.list.concat(result.list) : result.list,
        transformedList: transformer ? transform(state.list, transformer) : state.list,
        hasMore: result.hasMore,
        headers: result.headers
      }
    }
  }
}
