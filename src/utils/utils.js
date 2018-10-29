// Copyright (c) Microsoft Corporation and others. Licensed under the MIT license.
// SPDX-License-Identifier: MIT
import deepDiff from 'deep-diff'

const { set } = require('lodash')

function setIfValue(target, path, value) {
  if (!value) return
  if (Array.isArray(value) && value.length === 0) return
  set(target, path, value)
}

function difference(object, base) {
  const changes = deepDiff.diff(base, object)
  if (!changes || changes.length === 0) return {}
  const newValue = {}
  changes.forEach(change => deepDiff.applyChange(newValue, change, change))
  return newValue
}

function isJson(item) {
  item = typeof item !== 'string' ? JSON.stringify(item) : item

  try {
    item = JSON.parse(item)
  } catch (e) {
    return false
  }

  if (typeof item === 'object' && item !== null) {
    return true
  }

  return false
}

export { setIfValue, difference, isJson }
