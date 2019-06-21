// Copyright (c) Microsoft Corporation and others. Licensed under the MIT license.
// SPDX-License-Identifier: MIT

import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { asObject } from '../../../utils/utils'
import trim from 'lodash/trim'
import { ROUTE_CURATIONS } from '../../../utils/routingConstants'
import { getGist } from '../../../api/github'
import { uiInfo, uiWarning } from '../../../actions/ui'
import EntitySpec from '../../../utils/entitySpec'

export class DropComponent extends Component {
  static propTypes = {
    children: PropTypes.node.isRequired,
    onLoad: PropTypes.func,
    onAddComponent: PropTypes.func
  }

  constructor(props) {
    super(props)
    this.onDrop = this.onDrop.bind(this)
    this.handleDropEntityUrl = this.handleDropEntityUrl.bind(this)
  }

  onDragOver = e => e.preventDefault()
  onDragEnter = e => e.preventDefault()

  async onDrop(event) {
    const { dispatch } = this.props
    const { dataTransfer } = event
    event.preventDefault()
    try {
      let result
      if ((result = await this.handleTextDrop(dataTransfer)) !== false) return result
      if ((result = await this.handleDropFiles(dataTransfer)) !== false) return result
      uiWarning(dispatch, 'ClearlyDefined does not understand whatever it is you just dropped')
      return Promise.reject('ClearlyDefined does not understand whatever it is you just dropped')
    } catch (error) {
      uiWarning(dispatch, error.message)
      return Promise.reject(error.message)
    }
  }

  async handleTextDrop(dataTransfer) {
    const text = dataTransfer.getData('Text')
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
    this.props.onAddComponent(spec)
  }

  // dropping an actual definition, an object that has `coordinates`
  handleDropObject(content) {
    const contentObject = asObject(content)
    if (!contentObject) return false
    this.props.onAddComponent(EntitySpec.fromObject(contentObject))
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
    const { dispatch, onLoad } = this.props
    if (!urlString.startsWith('https://gist.github.com')) return false
    uiInfo(dispatch, 'Loading component list from gist')
    const url = new URL(urlString)
    const [, , id] = url.pathname.split('/')
    if (!id) throw new Error(`Gist url ${url} is malformed`)
    const content = await getGist(id)
    if (!content || !Object.keys(content).length) throw new Error(`Gist at ${url} could not be loaded or was empty`)
    for (let name in content) onLoad(content[name], name)
  }

  async handleDropFiles(dataTransfer) {
    const files = Object.values(dataTransfer.files)
    if (!files || !files.length) return false
    const { acceptedFiles, rejectedFiles } = this.sortDroppedFiles(files)
    if (acceptedFiles.length) await this.handleDropAcceptedFiles(acceptedFiles)
    if (rejectedFiles.length) this.handleDropRejectedFiles(rejectedFiles)
    return true
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
    const { dispatch, onLoad } = this.props
    uiInfo(dispatch, 'Loading component list from file(s)')
    files.forEach(file => {
      const reader = new FileReader()
      reader.onload = () => onLoad(reader.result, file.name)
      reader.readAsBinaryString(file)
    })
    return true
  }

  handleDropRejectedFiles = files => {
    const { dispatch } = this.props
    const filenames = files.map(file => file.name).join(', ')
    uiWarning(dispatch, `Could not load: ${filenames}`)
  }

  render() {
    return (
      <div
        className={this.props.className}
        onDragOver={this.onDragOver}
        onDragEnter={this.onDragEnter}
        onDrop={this.onDrop}
        style={{ position: 'relative' }}
      >
        {this.props.children}
      </div>
    )
  }
}

function mapStateToProps(state) {
  return {
    token: state.session.token
  }
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({ dispatch }, dispatch)
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(DropComponent)
