// Copyright (c) Microsoft Corporation and others. Licensed under the MIT license.
// SPDX-License-Identifier: MIT

import EntitySpec from './entitySpec'
import { asObject } from '../utils/utils'
import trim from 'lodash/trim'
import { ROUTE_CURATIONS } from '../utils/routingConstants'
import { getGist } from '../api/github'
import { uiInfo, uiWarning } from '../actions/ui'

/**
 * Abstract methods for Dropping functionality
 *
 */
export default class Drop {
  constructor(dispatch, loadComponentList) {
    this.dispatch = dispatch
    this.loadComponentList = loadComponentList
  }

  async onDrop(event) {
    event.preventDefault()
    event.persist()
    try {
      let result
      if ((result = await this.handleTextDrop(event)) !== false) return result
      if ((result = await this.handleDropFiles(event)) !== false) return result
      uiWarning(this.dispatch, 'ClearlyDefined does not understand whatever it is you just dropped')
      return Promise.reject('ClearlyDefined does not understand whatever it is you just dropped')
    } catch (error) {
      uiWarning(this.dispatch, error.message)
      return Promise.reject(error.message)
    }
  }

  async handleTextDrop(event) {
    const text = event.dataTransfer.getData('Text')
    if (!text) return false
    if (this.handleDropObject(text) !== false) return
    if ((await this.handleDropGist(text)) !== false) return
    if (this.handleDropEntityUrl(text) !== false) return
    if (this.handleDropPrURL(text) !== false) return
    return false
  }

  // handle dropping a URL to an npm, github repo/release, nuget package, ...
  handleDropEntityUrl(content) {
    const spec = EntitySpec.fromUrl(content)
    if (!spec) return false
    this.onAddComponent(spec)
  }

  // dropping an actual definition, an object that has `coordinates`
  handleDropObject(content) {
    const contentObject = asObject(content)
    if (!contentObject) return false
    this.onAddComponent(EntitySpec.fromCoordinates(contentObject))
  }

  // handle dropping a url pointing to a curation PR
  handleDropPrURL(urlSpec) {
    try {
      const url = new URL(trim(urlSpec, '/'))
      if (url.hostname !== 'github.com') return false
      const [, org, , type, number] = url.pathname.split('/')
      if (org !== 'clearlydefined' || type !== 'pull') return false
      this.props.history.push(`${ROUTE_CURATIONS}/${number}`)
    } catch (exception) {
      return false
    }
  }

  // handle dropping a url to a Gist that contains a ClearlyDefined coordinate list
  async handleDropGist(urlString) {
    if (!urlString.startsWith('https://gist.github.com')) return false
    uiInfo(this.dispatch, 'Loading component list from gist')
    const url = new URL(urlString)
    const [, , id] = url.pathname.split('/')
    if (!id) throw new Error(`Gist url ${url} is malformed`)
    const content = await getGist(id)
    if (!content || !Object.keys(content).length) throw new Error(`Gist at ${url} could not be loaded or was empty`)
    for (let name in content) this.loadComponentList(content[name], name)
  }

  async handleDropFiles(event) {
    const files = Object.values(event.dataTransfer.files)
    if (!files || !files.length) return false
    const { acceptedFiles, rejectedFiles } = this.sortDroppedFiles(files)
    if (acceptedFiles.length) await this.handleDropAcceptedFiles(acceptedFiles)
    if (rejectedFiles.length) this.handleDropRejectedFiles(rejectedFiles)
  }

  sortDroppedFiles(files) {
    const acceptedFilesValues = ['application/json']
    return files.reduce(
      (result, file) => {
        if (acceptedFilesValues.includes(file.type)) result.acceptedFiles.push(file)
        else result.rejectedFiles.push(file)
        return result
      },
      { acceptedFiles: [], rejectedFiles: [] }
    )
  }

  handleDropAcceptedFiles(files) {
    uiInfo(this.dispatch, 'Loading component list from file(s)')
    files.forEach(file => {
      const reader = new FileReader()
      reader.onload = () => this.loadComponentList(reader.result, file.name)
      reader.readAsBinaryString(file)
    })
  }

  handleDropRejectedFiles = files => {
    const fileNames = files.map(file => file.name).join(', ')
    uiWarning(this.dispatch, `Could not load: ${fileNames}`)
  }
}
