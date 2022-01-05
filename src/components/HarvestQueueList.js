// Copyright (c) Microsoft Corporation and others. Licensed under the MIT license.
// SPDX-License-Identifier: MIT

import React from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import {
  RowEntityList,
  TwoLineEntry,
  GitHubCommitPicker,
  NpmVersionPicker,
  MavenVersionPicker,
  PyPiVersionPicker,
  CrateVersionPicker,
  DebianVersionPicker,
  NuGetVersionPicker,
  RubyGemsVersionPicker,
  ComposerVersionPicker
} from './'
import { getGitHubRevisions } from '../api/clearlyDefined'
import { clone } from 'lodash'
import github from '../images/GitHub-Mark-120px-plus.png'
import npm from '../images/n-large.png'
import pypi from '../images/pypi.png'
import debian from '../images/debian.png'
import gem from '../images/gem.png'
import cargo from '../images/cargo.png'
import maven from '../images/maven.png'
import nuget from '../images/nuget.png'
import composer from '../images/packagist.png'

class HarvestQueueList extends React.Component {
  static propTypes = {
    list: PropTypes.array.isRequired,
    loadMoreRows: PropTypes.func,
    onRemove: PropTypes.func,
    onChange: PropTypes.func,
    noRowsRenderer: PropTypes.func
  }

  static defaultProps = {
    loadMoreRows: () => {}
  }

  constructor(props) {
    super(props)
    this.state = { contentSeq: 0, sortOrder: null }
    this.renderRow = this.renderRow.bind(this)
    this.renderButtons = props.renderButtons || this.renderButtons.bind(this)
    this.commitChanged = this.commitChanged.bind(this)
  }

  removeRequest(request, event) {
    event.stopPropagation()
    const { onRemove } = this.props
    onRemove && onRemove(request)
  }

  commitChanged(request, value) {
    const newRequest = clone(request)
    newRequest.revision = value ? value.sha : null
    newRequest.commit = value
    this.setState({ ...this.state, contentSeq: this.state.contentSeq + 1 })
    this.props.onChange(request, newRequest)
  }

  versionChanged(request, value) {
    const newRequest = clone(request)
    newRequest.revision = value
    this.setState({ contentSeq: this.state.contentSeq + 1 })
    this.props.onChange(request, newRequest)
  }

  renderButtons(request) {
    return (
      <div className="list-activity-area">
        {request.provider === 'github' && (
          <GitHubCommitPicker
            request={request}
            allowNew={true}
            getGitHubRevisions={path => getGitHubRevisions(this.props.token, path)}
            onChange={this.commitChanged.bind(this, request)}
          />
        )}
        {request.provider === 'npmjs' && (
          <NpmVersionPicker request={request} onChange={this.versionChanged.bind(this, request)} />
        )}
        {request.provider === 'mavencentral' && (
          <MavenVersionPicker request={request} onChange={this.versionChanged.bind(this, request)} />
        )}
        {request.provider === 'pypi' && (
          <PyPiVersionPicker request={request} onChange={this.versionChanged.bind(this, request)} />
        )}
        {request.provider === 'rubygems' && (
          <RubyGemsVersionPicker request={request} onChange={this.versionChanged.bind(this, request)} />
        )}
        {request.provider === 'cratesio' && (
          <CrateVersionPicker request={request} onChange={this.versionChanged.bind(this, request)} />
        )}
        {request.provider === 'nuget' && (
          <NuGetVersionPicker request={request} onChange={this.versionChanged.bind(this, request)} />
        )}
        {request.provider === 'debian' && (
          <DebianVersionPicker request={request} onChange={this.versionChanged.bind(this, request)} />
        )}
        {request.provider === 'packagist' && (
          <ComposerVersionPicker request={request} onChange={this.versionChanged.bind(this, request)} />
        )}
        <i className="fas fa-times list-trash" onClick={this.removeRequest.bind(this, request)} />
      </div>
    )
  }

  renderHeadline(request) {
    const { namespace, name } = request
    const namespaceText = namespace ? namespace + '/' : ''
    return (
      <span>
        {namespaceText}
        {name}
      </span>
    )
  }

  renderMessage(request) {
    const { type, policy } = request
    const nameText = type ? (
      <span>
        {type}
        &nbsp;
      </span>
    ) : (
      ''
    )
    const policyText = 'Policy: ' + policy ? policy : 'default'
    return (
      <span>
        {nameText} &nbsp; {policyText}
      </span>
    )
  }

  getImage(request) {
    if (request.provider === 'github') return github
    if (request.provider === 'npmjs') return npm
    if (request.provider === 'pypi') return pypi
    if (request.provider === 'rubygems') return gem
    if (request.provider === 'cratesio') return cargo
    if (request.provider === 'mavencentral') return maven
    if (request.provider === 'nuget') return nuget
    if (request.provider === 'debian') return debian
    if (request.provider === 'packagist') return composer
    return null
  }

  getLetter(request) {
    if (request.provider === 'mavencentral') return 'M'
    return null
  }

  renderRow({ index, key, style }) {
    const { list } = this.props
    const request = list[index]
    const clickHandler = () => {}
    return (
      <div key={key} style={style} className="component-row">
        <TwoLineEntry
          item={request}
          image={this.getImage(request)}
          letter={this.getLetter(request)}
          headline={this.renderHeadline(request)}
          message={this.renderMessage(request)}
          buttons={this.renderButtons(request)}
          onClick={clickHandler}
        />
      </div>
    )
  }

  render() {
    const { loadMoreRows, noRowsRenderer, list } = this.props
    const { sortOrder, contentSeq } = this.state
    return (
      <RowEntityList
        list={list}
        loadMoreRows={loadMoreRows}
        rowRenderer={this.renderRow}
        rowHeight={50}
        noRowsRenderer={noRowsRenderer}
        sortOrder={sortOrder}
        contentSeq={contentSeq}
      />
    )
  }
}

function mapStateToProps(state) {
  return {
    token: state.session.token
  }
}
export default connect(mapStateToProps)(HarvestQueueList)
