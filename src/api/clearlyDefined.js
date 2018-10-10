// Copyright (c) Microsoft Corporation and others. Licensed under the MIT license.
// SPDX-License-Identifier: MIT
// DON'T COMMIT THIS FILE
import 'whatwg-fetch'
import { toPairs } from 'lodash'

export const apiHome = process.env.REACT_APP_SERVER

const CURATIONS = 'curations'
const HARVEST = 'harvest'
const DEFINITIONS = 'definitions'
const ORIGINS_GITHUB = 'origins/github'
const ORIGINS_NPM = 'origins/npm'
const ORIGINS_NUGET = 'origins/nuget'
const ORIGINS_MAVEN = 'origins/maven'
const ORIGINS_PYPI = 'origins/pypi'
const ORIGINS_RUBYGEMS = 'origins/rubygems'

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

export function getContributionData(token, entity) {
  return get(url(`${CURATIONS}/pr/${entity}`), token)
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

export function getBadgeUrl(score1, score2) {
  const topScore = 2
  const colors = ['red', 'yellow', 'brightgreen']
  const percentScore = (score1 + score2) / (2 * topScore)
  const bucketSize = 1 / (colors.length - 1)
  const color = colors[Math.ceil(percentScore / bucketSize)]
  return `https://img.shields.io/badge/ClearlyDefined-${score1}%20%7C%20${score2}-${color}.svg`
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

export function getRubyGemsSearch(token, path) {
  return get(url(`${ORIGINS_RUBYGEMS}/${path}`), token)
}

export function getRubyGemsRevisions(token, path) {
  return get(url(`${ORIGINS_RUBYGEMS}/${path}/revisions`), token)
}

export function getNugetSearch(token, path) {
  return get(url(`${ORIGINS_NUGET}/${path}`), token)
}

export function getNugetRevisions(token, path) {
  return get(url(`${ORIGINS_NUGET}/${path}/revisions`), token)
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
    if (response) {
      err.status = response.status
      return response
        .json()
        .then(body => {
          err.body = body
          throw err
        })
        .catch(() => {
          throw err
        })
    }
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
