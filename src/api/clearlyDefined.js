// Copyright (c) Microsoft Corporation and others. Licensed under the MIT license.
// SPDX-License-Identifier: MIT

import { get, getList, patch, post } from './generic'
import { toPairs } from 'lodash'
import _ from 'lodash'
import EntitySpec from '../utils/entitySpec'

const apiHome = process.env.REACT_APP_SERVER

export const CURATIONS = 'curations'
export const HARVEST = 'harvest'
export const DEFINITIONS = 'definitions'
export const NOTICES = 'notices'
export const SUGGESTIONS = 'suggestions'
export const BROWSE = 'browse'
export const ORIGINS_GITHUB = 'origins/github'
export const ORIGINS_NPM = 'origins/npm'
export const ORIGINS_NUGET = 'origins/nuget'
export const ORIGINS_CRATE = 'origins/crate'
export const ORIGINS_MAVEN = 'origins/maven'
export const ORIGINS_PYPI = 'origins/pypi'
export const ORIGINS_RUBYGEMS = 'origins/rubygems'
export const ORIGINS = {
  github: { git: ORIGINS_GITHUB },
  npmjs: { npm: ORIGINS_NPM },
  nuget: { nuget: ORIGINS_NUGET },
  cratesio: { crate: ORIGINS_CRATE },
  mavencentral: { maven: ORIGINS_MAVEN, sourcearchive: ORIGINS_MAVEN },
  pypi: { pypi: ORIGINS_PYPI },
  rubygems: { gem: ORIGINS_RUBYGEMS }
}

export function getHarvestResults(token, entity) {
  // TODO ensure that the entity has data all the way down to the revision (and no more)
  return get(url(`${HARVEST}/${entity.toPath()}`, { form: 'raw' }), token)
}

export function harvest(token, spec) {
  return post(url(HARVEST), token, spec)
}

/**
 * Get details about a specific curation
 * @param {*} token
 * @param {*} entity
 * @param {object} params additional params added to the query string
 * @param {array} params.expand contains informations about the detail to be returned (e.g. ['prs','foo','bars']);
 * @param {string} params.state if === 'pending' return also curations not already merged
 */
export function getCuration(token, entity, params = {}) {
  const { expand, state } = params
  return get(
    url(`${CURATIONS}/${entity.toPath()}`, {
      expand,
      state
    }),
    token
  )
}

/**
 * List all of the curations (if any) using the given coordinates as a pattern to match, despite the revision
 * @param  {} token
 * @param  {} entity
 * @param {object} params additional params added to the query string
 * @param {string} params.state if === 'pending' return also curations not already merged
 */
export function getCurationList(token, entity, params = {}) {
  const { state } = params
  const entityWithoutRevision = EntitySpec.asRevisionless(entity)
  return get(
    url(`${CURATIONS}/${entityWithoutRevision.toPath()}`, {
      state
    }),
    token
  )
}

// Get the curation in the given PR relative to the specified coordinates
export function getCurationData(token, entity, prNumber) {
  return get(url(`${CURATIONS}/${entity.toPath()}/pr/${prNumber}`), token)
}

export function curate(token, spec) {
  return patch(url(`${CURATIONS}`), token, spec)
}

/**
 * Get details about a specific definition
 * @param {*} token
 * @param {*} entity
 * @param {object} params can contain properties: expandPrs, if true include deeper information for each PR like the title, message
 */
export function getDefinition(token, entity, params = {}) {
  const { expandPrs } = params
  return get(
    url(`${DEFINITIONS}/${entity.toPath()}`, {
      expand: expandPrs ? 'prs' : null
    }),
    token
  )
}

export function getContributionData(token, entity) {
  return get(url(`${CURATIONS}/pr/${entity}`), token)
}

export function browseDefinitions(token, query) {
  return get(url(DEFINITIONS, query), token)
}

export function getDefinitions(token, list) {
  return post(url(`${DEFINITIONS}`), token, list)
}

export function getDefinitionSuggestions(token, prefix) {
  return getList(url(DEFINITIONS, { pattern: prefix }), token)
}

export function getSuggestedData(token, entity) {
  return get(url(`${SUGGESTIONS}/${entity.toPath()}`), token)
}

export function previewDefinition(token, entity, curation) {
  return post(url(`${DEFINITIONS}/${entity.toPath()}`, { preview: true }), token, curation)
}

export async function getNotices(token, coordinates, renderer, options) {
  const result = await post(url(`${NOTICES}`), token, { coordinates, renderer, options })
  if (typeof result.content === 'string') return result
  result.content = JSON.stringify(result.content)
  return result
}

export function getBadgeUrl(score1, score2) {
  score1 = score1 || 0
  score2 = score2 || 0
  const topScore = 100
  const colors = ['red', 'yellow', 'brightgreen']
  const percentScore = (score1 + score2) / (2 * topScore)
  const bucketSize = 1 / colors.length
  const color = colors[Math.floor(percentScore / bucketSize)]
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

export function getCrateSearch(token, path) {
  return get(url(`${ORIGINS_CRATE}/${path}`), token)
}

export function getCrateRevisions(token, path) {
  return get(url(`${ORIGINS_CRATE}/${path}/revisions`), token)
}

export function getNugetSearch(token, path) {
  return get(url(`${ORIGINS_NUGET}/${path}`), token)
}

export function getNugetRevisions(token, path) {
  return get(url(`${ORIGINS_NUGET}/${path}/revisions`), token)
}

export function getRevisions(token, path, type, provider) {
  const origin = _.get(ORIGINS, `${provider}.${type}`)
  return get(url(`${origin}/${path}/revisions`), token)
}

export function getStats(key) {
  return get(url(`stats/${key}`))
}

export function getStatus(key) {
  return get(url(`status/${key}`))
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
