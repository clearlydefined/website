// Copyright (c) Microsoft Corporation and others. Licensed under the MIT license.
// SPDX-License-Identifier: MIT

import { get, post } from './generic'

export async function saveGist(token, name, fileContent) {
  if (typeof fileContent !== 'string') fileContent = JSON.stringify(fileContent)
  const result = await post('https://api.github.com/gists', token, { files: { [name]: { content: fileContent } } })
  return result.html_url
}

export async function getGist(id) {
  const gist = await get(`https://api.github.com/gists/${id}`)
  for (let file in gist.files) {
    gist.files[file] = JSON.parse(gist.files[file].content)
  }
  return gist.files
}
