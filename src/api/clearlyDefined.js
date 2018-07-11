// Copyright (c) Microsoft Corporation and others. Licensed under the MIT license.
// SPDX-License-Identifier: MIT

import 'whatwg-fetch'
import { toPairs } from 'lodash'

export const API_LOCAL = 'http://localhost:4000'
export const API_DEVELOP = 'https://dev-api.clearlydefined.io'
export const API_PROD = 'https://api.clearlydefined.io'
export const apiHome = process.env.REACT_APP_SERVER || getServiceDefaultUrl()

function getServiceDefaultUrl() {
  switch (process.env.NODE_ENV) {
    case 'development':
      return API_LOCAL
    case 'test':
      return API_DEVELOP
    case 'production':
      // TODO this needs to be replaced when we do a prod deployment. We want a "production" build deployed in
      // the dev environment but of course it will need to point to the dev server. Don't know how to do that.
      return API_DEVELOP
    default:
      return API_LOCAL
  }
}

const CURATIONS = 'curations'
const HARVEST = 'harvest'
const DEFINITIONS = 'definitions'
const BADGES = 'badges'
const ORIGINS_GITHUB = 'origins/github'
const ORIGINS_NPM = 'origins/npm'
const ORIGINS_MAVEN = 'origins/maven'
const ORIGINS_PYPI = 'origins/pypi'

export function getHarvestResults(token, entity) {
  // TODO ensure that the entity has data all the way down to the revision (and no more)
  return get(url(`${HARVEST}/${entity.toPath()}`, { form: 'raw' }), token)
}

export function harvest(token, spec) {
  return post(url(HARVEST), token, spec)
}

export function getCuration(token, entity) {
  return get(url(`${CURATIONS}/${entity.toPath()}`), token)
}

export function curate(token, spec) {
  return patch(url(`${CURATIONS}`), token, spec)
}

export function getDefinition(token, entity) {
  return get(url(`${DEFINITIONS}/${entity.toPath()}`), token)
}

export function getDefinitions(token, list) {
  return post(url(`${DEFINITIONS}`), token, list)
}

export async function getDefinitionSuggestions(token, prefix, type) {
  return await getList(url(DEFINITIONS, { pattern: prefix, type }), token)
}

export function previewDefinition(token, entity, curation) {
  return post(url(`${DEFINITIONS}/${entity.toPath()}`, { preview: true }), token, curation)
}

export function getBadgeUrl(entity) {
  return url(`${BADGES}/${entity.toPath()}`)
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

export function getMavenSearch(token, path) {
  return get(url(`${ORIGINS_MAVEN}/${path}`), token)
}

export function getMavenRevisions(token, path) {
  return get(url(`${ORIGINS_MAVEN}/${path}/revisions`), token)
}

export function getPyPiSearch(token, path) {
  return get(url(`${ORIGINS_PYPI}/${path}`), token)
}

export function getPyPiRevisions(token, path) {
  return get(url(`${ORIGINS_PYPI}/${path}/revisions`), token)
}

// ========================== utilities ====================

export function url(path, query) {
  path = apiHome + '/' + path
  if (!query) return path

  const queryString = toPairs(query)
    // take only having values ones (0 is allowed)
    .filter(p => p[1] || p[1] === 0)
    // sort() is essential for caching
    .sort()
    // compose key=value&key2=value with encoded keys and values
    .map(p => p.map(encodeURIComponent).join('='))
    .join('&')
  return queryString ? `${path}?${queryString}` : path
}

function getHeaders(token) {
  const result = {
    'Content-Type': 'application/json; charset=utf-8'
  }
  if (token) result.Authorization = 'Bearer ' + token
  return result
}

function handleResponse(response) {
  // reject if code is out of range 200-299
  if (!response || !response.ok) {
    const err = new Error(response ? response.statusText : 'Error')
    if (response) err.status = response.status
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

async function handleListResponse(response) {
  const list = await handleResponse(response)
  return { list, headers: response.headers }
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
    body: JSON.stringify(payload)
  }).then(handleResponse)
}

function patch(url, token, payload) {
  return fetch(url, {
    headers: getHeaders(token),
    method: 'PATCH',
    body: JSON.stringify(payload)
  }).then(handleResponse)
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
    headers: getHeaders(token)
  }).then(handleResponse)
}

function getList(url, token) {
  return fetch(url, {
    headers: getHeaders(token)
  }).then(handleListResponse)
}
