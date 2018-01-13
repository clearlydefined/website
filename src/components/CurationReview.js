// Copyright (c) Microsoft Corporation. All rights reserved.
// SPDX-License-Identifier: MIT

import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Row, Col, Button } from 'react-bootstrap'
import { MonacoDiffEditor } from 'react-monaco-editor'
import deepDiff from 'deep-diff'
import extend from 'extend'
import yaml from 'js-yaml'

export default class CurationReview extends Component {

  static propTypes = {
    curationOriginal: PropTypes.object,
    curationValue: PropTypes.object,
    packageOriginal: PropTypes.object,
    rawSummary: PropTypes.object,
    actionHandler: PropTypes.func.isRequired,
    actionText: PropTypes.string
  }

  static defaultProps = {
  }

  constructor(props) {
    super(props)
    this.state = {}
    this.editorDidMount = this.editorDidMount.bind(this)
    this.onCurationChange = this.onCurationChange.bind(this)
    this.onSummaryChange = this.onSummaryChange.bind(this)
    this.doAction = this.doAction.bind(this)
  }

  componentDidMount() {
    // setup the initial packagePreview value. Afterwards, changes will be handled by the editor
    if (!this.state.packagePreview)
      this.setState({ ...this.state, packagePreview: this.computeProposedPackage(this.props.rawSummary, this.props.curationValue) })
  }

  editorDidMount(type, editor, monaco) {
    this.setState({ ...this.state, [type]: editor })
    if (type === 'result')
      editor.focus()
  }

  onCurationChange(newCuration, event) {
    // TODO put in some throttling
    const { rawSummary } = this.props
    const newProposal = this.computeProposedPackage(rawSummary, newCuration)
    if (!this.state.result || !newProposal)
      return
    // only set the value if it is different. Optimization plus it stops cycles
    if (newProposal !== this.state.result.getModifiedEditor().getModel().getValue())
      this.state.result.getModifiedEditor().getModel().setValue(newProposal)
  }

  computeProposedPackage(rawSummary, newCurationOrString) {
    // TODO figure out how to represent deletions
    try {
      const newCuration = typeof newCurationOrString === 'string'
        ? yaml.safeLoad(newCurationOrString)
        : newCurationOrString
      if (Array.isArray(newCuration))
        return null
      const newValue = extend(true, {}, rawSummary, newCuration)
      return this.getStringValue(newValue)
    } catch (error) {
      // No proposal if there is an error figuring one out
      return null
    }
  }

  onSummaryChange(newSummary, event) {
    // TODO put in some throttling
    if (!this.state.packagePreview)
      return
    const { rawSummary } = this.props
    const newProposal = this.computeProposedCuration(rawSummary, newSummary)
    if (!this.state.curation || !newProposal)
      return
    // only set the value if it is different. Optimization plus it stops cycles
    if (newProposal !== this.state.curation.getModifiedEditor().getModel().getValue())
      this.state.curation.getModifiedEditor().getModel().setValue(newProposal)
  }

  computeProposedCuration(originalSummary, proposedSummary) {
    try {
      const newSummary = yaml.safeLoad(proposedSummary)
      if (Array.isArray(newSummary))
        return null
      const changes = deepDiff.diff(originalSummary, newSummary)
      if (!changes || changes.length === 0)
        return null
      const newValue = {}
      changes.forEach(change =>
        deepDiff.applyChange(newValue, change, change));
      return this.getStringValue(newValue)
    } catch (error) {
      // No proposal if there is an error figuring one out
      return null
    }
  }

  getStringValue(item) {
    return item ? yaml.safeDump(item, { sortKeys: true }) : ''
  }

  doAction(e) {
    e.preventDefault()
    const patchString = this.state.curation.getModifiedEditor().getModel().getValue();
    const patch = yaml.safeLoad(patchString)
    this.props.actionHandler(patch)
  }

  renderDiffHeader(type, className = '') {
    const { actionText } = this.props
    return (
      <Row className={className}>
        <Col sm={2}>
          <Button type="button">
            Propose upstream
          </Button>
        </Col>
        <Col sm={4}>
          <h4>Current {type}</h4>
        </Col>
        <Col sm={2} smOffset={2}>
          <h4>Proposed {type}</h4>
        </Col>
        <Col sm={2}>
          <Button type="button" bsStyle='success' className='pull-right' onClick={this.doAction}>
            {actionText}
          </Button>
        </Col>
      </Row>)
  }

  render() {
    const { curationOriginal, curationValue, packageOriginal } = this.props
    const { packagePreview } = this.state
    const options = {
      selectOnLineNumbers: true,
      renderSideBySide: true
    }
    const requireConfig = { baseUrl: '/', paths: { vs: 'vs' }, url: '/vs/loader.js' }
    return (
      <div>
        {this.renderDiffHeader('curation', 'top-space')}
        <div className='editor-wrapper'>
          <MonacoDiffEditor
            height='400'
            language='yaml'
            original={this.getStringValue(curationOriginal)}
            value={this.getStringValue(curationValue)}
            options={options}
            // onChange={this.onCurationChange}
            editorDidMount={this.editorDidMount.bind(this, 'curation')}
            requireConfig={requireConfig}
          />
        </div>

        {this.renderDiffHeader('result', 'top-space')}
        {/* for some bizarre reason the diff editor cannot be wrapped in a separate component. Turns into an editor! */}
        <div className='editor-wrapper'>
          <MonacoDiffEditor
            height='400'
            language='yaml'
            original={this.getStringValue(packageOriginal)}
            value={packagePreview}
            options={options}
            onChange={this.onSummaryChange}
            editorDidMount={this.editorDidMount.bind(this, 'result')}
            requireConfig={requireConfig}
          />
        </div>
      </div>
    )
  }
}
