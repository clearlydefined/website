// Copyright (c) Microsoft Corporation and others. Licensed under the MIT license.
// SPDX-License-Identifier: MIT

import 'whatwg-fetch'

function getHeaders(token) {
  const result = {
    'Content-Type': 'application/json; charset=utf-8'
  }
  if (token) result.Authorization = 'Bearer ' + token
  return result
}

export function handleResponse(response) {
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

// export function put(url, token, payload) {
//   return fetch(url, {
//     headers: getHeaders(token),
//     method: 'PUT',
//     body: JSON.stringify(payload)
//   })
//     .then(handleResponse)
// }

export function post(url, token, payload) {
  return fetch(url, {
    headers: getHeaders(token),
    method: 'POST',
    body: JSON.stringify(payload)
  }).then(handleResponse)
}

export function patch(url, token, payload) {
  return fetch(url, {
    headers: getHeaders(token),
    method: 'PATCH',
    body: JSON.stringify(payload)
  }).then(handleResponse)
}

// export function del(url, token) {
//   return fetch(url, {
//     headers: getHeaders(token),
//     method: 'DELETE'
//   })
//     .then(handleResponse)
// }

export function get(url, token) {
  return fetch(url, {
    headers: getHeaders(token)
  }).then(handleResponse)
}

export function getList(url, token) {
  return fetch(url, {
    headers: getHeaders(token)
  }).then(handleListResponse)
}
