// Copyright (c) 2018, The Linux Foundation. All rights reserved.
// SPDX-License-Identifier: MIT

import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Button, Tooltip, OverlayTrigger } from 'react-bootstrap'
import { CopyToClipboard } from 'react-copy-to-clipboard'
import FontAwesome from 'react-fontawesome'

export default class CopyUrlButton extends Component {

  static propTypes = {
    path: PropTypes.string
  }

  constructor(props) {
    super(props)
    const {route = '', path = ''} = props
    this.state = {
      route,
      path,
      copied: false,
      timeoutId: null
    }
    this.onCopy = this.onCopy.bind(this)
    this.didCopy = this.didCopy.bind(this)
  }

  onCopy() {
    this.state.timeoutId && clearTimeout(this.state.timeoutId)
    const timeoutId = setTimeout(this.didCopy, 2000)
    this.setState({...this.state, copied: true, timeoutId})
  }

  didCopy() {
    this.setState({...this.state, copied: false, timeoutId: null})
  }

  renderUrl() {
    const {route, path} = this.props
    return `${window.location.origin}${route}/${path}`
  }

  renderTooltip() {
    return (
      <Tooltip id="tooltip">{this.state.copied ? "Copied!" : "Copy URL to clipboard"}</Tooltip>
    )
  }

  render() {
    const {path} = this.props
    const isDisabled = !Boolean(path)

    return (
      <CopyToClipboard text={this.renderUrl()} onCopy={this.onCopy}>
        <OverlayTrigger placement="bottom" overlay={this.renderTooltip()} shouldUpdatePosition={true}>
          <Button bsStyle="link" className="pull-right" disabled={isDisabled}>
            <FontAwesome name={'copy'}/>
          </Button>
        </OverlayTrigger>
      </CopyToClipboard>
    )
  }
}
