// Copyright (c) Microsoft Corporation. All rights reserved.
// SPDX-License-Identifier: MIT

import 'whatwg-fetch'
import { toPairs } from 'lodash'

export const API_LOCAL = 'http://localhost:5000'
export const API_DEVELOP = 'https://dev-api.clearlydefined.io'
export const API_PROD = 'https://api.clearlydefined.io'
export const apiHome = process.env.REACT_APP_SERVER || API_DEVELOP

export const BASIC_PAGE_SIZE = 25
// const CURATIONS = 'curations'
const HARVEST = 'harvest'
// const PACKAGES = "packages"
const ROOT = ''

function base64(value) {
  return Buffer.from(value).toString('base64')
}

export function checkPassword(user, password) {
  return get(url(ROOT), base64(user + ":" + password))
}

export function harvest(token, spec) {
  return post(url(HARVEST), token, spec)
}

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
    'Authorization': 'Basic ' + token,
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
    //handle NO DATA
    const err = new Error(response ? response.statusText : 'No data')
    err.status = 204
    throw err
  }
  return response.json()
}

function put(url, token, payload) {
  return fetch(url, {
    headers: getHeaders(token),
    method: 'PUT',
    body: JSON.stringify(payload)
  })
    .then(handleResponse)
}

function post(url, token, payload) {
  return fetch(url, {
    headers: getHeaders(token),
    method: 'POST',
    body: JSON.stringify(payload)
  })
    .then(handleResponse)
}

function patch(url, token, payload) {
  return fetch(url, {
    headers: getHeaders(token),
    method: 'PATCH',
    body: JSON.stringify(payload)
  })
    .then(handleResponse)
}

function del(url, token) {
  return fetch(url, {
    headers: getHeaders(token),
    method: 'DELETE'
  })
    .then(handleResponse)
}

function get(url, token, scope) {
  return fetch(url, {
    headers: getHeaders(token),
  })
    .then(handleResponse)
}