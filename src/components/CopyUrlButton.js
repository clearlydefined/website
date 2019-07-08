// Copyright (c) 2018, The Linux Foundation and others. Licensed under the MIT license.
// SPDX-License-Identifier: MIT

import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Button } from 'react-bootstrap'
import { CopyToClipboard } from 'react-copy-to-clipboard'
import ButtonWithTooltip from './Navigation/Ui/ButtonWithTooltip'

export default class CopyUrlButton extends Component {
  static propTypes = {
    path: PropTypes.string,
    bsStyle: PropTypes.string,
    className: PropTypes.string,
    route: PropTypes.string
  }

  static defaultProps = {
    path: '',
    bsStyle: 'link',
    className: '',
    route: ''
  }

  constructor(props) {
    super(props)
    this.state = {
      copied: false,
      timeoutId: null
    }
    this.onCopy = this.onCopy.bind(this)
    this.didCopy = this.didCopy.bind(this)
    this.onClick = this.onClick.bind(this)
  }

  onClick(event) {
    event.stopPropagation()
  }

  onCopy() {
    this.state.timeoutId && clearTimeout(this.state.timeoutId)
    const timeoutId = setTimeout(this.didCopy, 2000)
    this.setState({ ...this.state, copied: true, timeoutId })
  }

  didCopy() {
    this.setState({ ...this.state, copied: false, timeoutId: null })
  }

  renderUrl() {
    const { route, path } = this.props
    return `${window.location.origin}${route}${path}`
  }

  renderTooltip() {
    return this.state.copied ? 'Copied!' : 'Copy URL to clipboard'
  }

  render() {
    const { path, bsStyle, className } = this.props
    const isDisabled = !Boolean(path)

    return (
      <ButtonWithTooltip tip={this.renderTooltip()} placement="bottom">
        <CopyToClipboard text={this.renderUrl()} onCopy={this.onCopy}>
          <Button bsStyle={bsStyle} className={className} disabled={isDisabled} onClick={this.onClick}>
            <i className="fas fa-copy" />
          </Button>
        </CopyToClipboard>
      </ButtonWithTooltip>
    )
  }
}
