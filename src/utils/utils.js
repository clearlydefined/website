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

const customLicenseIds = ['NONE']

const sorts = [
  { value: 'license', label: 'License' },
  { value: 'name', label: 'Name' },
  { value: 'namespace', label: 'Namespace' },
  { value: 'provider', label: 'Provider' },
  { value: 'releaseDate', label: 'Release Date' },
  { value: 'score', label: 'Score' },
  { value: 'type', label: 'Type' }
]

const licenses = [
  { value: 'Apache-2.0', label: 'Apache-2.0' },
  { value: 'Artistic-2.0', label: 'Artistic-2.0' },
  { value: 'BSD-2-Clause', label: 'BSD-2-Clause' },
  { value: 'BSD-3-Clause', label: 'BSD-3-Clause' },
  { value: 'CC-BY-4.0', label: 'CC-BY-4.0' },
  { value: 'CC0-1.0', label: 'CC0-1.0' },
  { value: 'EPL-1.0', label: 'EPL-1.0' },
  { value: 'GPL-2.0', label: 'GPL-2.0' },
  { value: 'GPL-3.0', label: 'GPL-3.0' },
  { value: 'ISC', label: 'ISC' },
  { value: 'LGPL-2.1', label: 'LGPL-2.1' },
  { value: 'LGPL-3.0', label: 'LGPL-3.0' },
  { value: 'MIT', label: 'MIT' },
  { value: 'MPL-2.0', label: 'MPL-2.0' },
  { value: 'MS-PL', label: 'MS-PL' },
  { value: 'Zlib', label: 'Zlib' },
  { value: 'presence', label: 'Presence Of' },
  { value: 'absence', label: 'Absence Of' }
]

const sources = [{ value: 'presence', label: 'Presence Of' }, { value: 'absence', label: 'Absence Of' }]

const releaseDates = [{ value: 'presence', label: 'Presence Of' }, { value: 'absence', label: 'Absence Of' }]

const curateFilters = [{ value: 'licensed', label: 'Licensed' }, { value: 'described', label: 'Described' }]

export { setIfValue, difference, customLicenseIds, asObject, sorts, licenses, sources, releaseDates, curateFilters }
