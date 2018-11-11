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

function asObject(item) {
  if (typeof item !== 'string') return item
  try {
    return JSON.parse(item)
  } catch (e) {
    return undefined
  }
}

const customLicenseIds = ['NONE', 'NOASSERTION']

export { setIfValue, difference, customLicenseIds, asObject }
