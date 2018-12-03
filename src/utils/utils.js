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
  { value: 'apache-2.0', label: 'Apache-2.0' },
  { value: 'bsd-2-clause', label: 'BSD-2-Clause' },
  { value: 'cddl-1.0', label: 'CDDL-1.0' },
  { value: 'epl-1.0', label: 'EPL-1.0' },
  { value: 'gpl', label: 'GPL' },
  { value: 'lgpl', label: 'LGPL' },
  { value: 'mit', label: 'MIT' },
  { value: 'mpl-2.0', label: 'MPL-2.0' },
  { value: 'presence', label: 'Presence Of' },
  { value: 'absence', label: 'Absence Of' }
]

const sources = [{ value: 'presence', label: 'Presence Of' }, { value: 'absence', label: 'Absence Of' }]

const releaseDates = [{ value: 'presence', label: 'Presence Of' }, { value: 'absence', label: 'Absence Of' }]

export { setIfValue, difference, customLicenseIds, asObject, sorts, licenses, sources, releaseDates }
