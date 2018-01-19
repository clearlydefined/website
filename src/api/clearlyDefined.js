// Copyright (c) Microsoft Corporation. All rights reserved.
// SPDX-License-Identifier: MIT

import 'whatwg-fetch'
import { toPairs } from 'lodash'

export const API_LOCAL = 'http://localhost:4000'
export const API_DEVELOP = 'https://dev-api.clearlydefined.io'
export const API_PROD = 'https://api.clearlydefined.io'
export const apiHome = process.env.REACT_APP_SERVER || API_DEVELOP

export const BASIC_PAGE_SIZE = 25
const CURATIONS = 'curations'
const HARVEST = 'harvest'
const PACKAGES = 'packages'
const ORIGINS_GITHUB = 'origins/github'
const ORIGINS_NPM = 'origins/npm'

const packageListTTL = 60000
let lastFetchPackageList = null
let packageList = []

export function getHarvestResults(token, entity) {
  // TODO ensure that the entity has data all the way down to the revision (and no more)
  return get(url(`${HARVEST}/${entity.toUrlPath()}`, { form: 'raw' }), token)
}

export function harvest(token, spec) {
  return post(url(HARVEST), token, spec)
}

export function getCuration(token, entity) {
  return get(url(`${CURATIONS}/${entity.toUrlPath()}`), token)
}

export function curate(token, entity, spec) {
  return patch(url(`${CURATIONS}/${entity.toUrlPath()}`), token, spec)
}

export function getPackage(token, entity) {
  return get(url(`${PACKAGES}/${entity.toUrlPath()}`), token)
}

export async function getPackageList(token, prefix, force = false) {
  if (!force && lastFetchPackageList && (Date.now() - lastFetchPackageList < packageListTTL))
    return { list: packageList}
  const list = await get(url(`${PACKAGES}/${prefix || ''}`), token)
  lastFetchPackageList = Date.now()
  packageList = list
  return { list }
}

export function previewPackage(token, entity, curation) {
  return post(url(`${PACKAGES}/${entity.toUrlPath()}`, { preview: true }), token, curation)
}

export function getGitHubSearch(token, path) {
  return get(url(`${ORIGINS_GITHUB}/${path}`), token)
}

export function getGitHubRevisions(token, path) {
  return get(url(`${ORIGINS_GITHUB}/${path}/revisions`), token)
}

export function getNpmSearch(token, path) {
  return get(url(`${ORIGINS_NPM}/${path}`), token)
}

export function getNpmRevisions(token, path) {
  return get(url(`${ORIGINS_NPM}/${path}/revisions`), token)
}

// ========================== utilities ====================

export function url(path, query) {
  path = apiHome + '/' + path
  if (!query)
    return path

  const queryString = toPairs(query)
    // take only having values ones (0 is allowed)
    .filter((p) => p[1] || p[1] === 0)
    // sort() is essential for caching
    .sort()
    // compose key=value&key2=value with encoded keys and values
    .map((p) => p.map(encodeURIComponent).join('=')).join('&')
  return `${path}?${queryString}`
}

function getHeaders(token) {
  return {
    'Authorization': 'Bearer ' + token,
    'Content-Type': 'application/json; charset=utf-8'
  }
}

function handleResponse(response) {
  // reject if code is out of range 200-299
  if (!response || !response.ok) {
    const err = new Error(response ? response.statusText : 'Error')
    if (response)
      err.status = response.status
    throw err
  }
  if (response.status === 204) {
    // handle NO DATA
    const err = new Error(response ? response.statusText : 'No data')
    err.status = 204
    throw err
  }
  return response.json()
}

// function put(url, token, payload) {
//   return fetch(url, {
//     headers: getHeaders(token),
//     method: 'PUT',
//     body: JSON.stringify(payload)
//   })
//     .then(handleResponse)
// }

function post(url, token, payload) {
  return fetch(url, {
    headers: getHeaders(token),
    method: 'POST',
    body: JSON.stringify(payload),
  })
    .then(handleResponse)
}

function patch(url, token, payload) {
  return fetch(url, {
    headers: getHeaders(token),
    method: 'PATCH',
    body: JSON.stringify(payload),
  })
    .then(handleResponse)
}

// function del(url, token) {
//   return fetch(url, {
//     headers: getHeaders(token),
//     method: 'DELETE'
//   })
//     .then(handleResponse)
// }

function get(url, token) {
  return fetch(url, {
    headers: getHeaders(token),
  })
    .then(handleResponse)
}