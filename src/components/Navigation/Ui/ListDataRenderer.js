// Copyright (c) Microsoft Corporation and others. Licensed under the MIT license.
// SPDX-License-Identifier: MIT
import React, { Component } from 'react'
import get from 'lodash/get'
import { Popover, Overlay } from 'react-bootstrap'
import PropTypes from 'prop-types'

export default class ListDataRenderer extends Component {
  constructor(props) {
    super(props)

    this.state = {
      showTooltip: false
    }
  }

  static propTypes = {
    licensed: PropTypes.object,
    item: PropTypes.string,
    title: PropTypes.string,
    trigger: PropTypes.array,
    values: PropTypes.array
  }

  static defaultProps = {
    trigger: ['click']
  }

  componentDidMount() {
    document.body.addEventListener('showTooltip', this.handleShowTooltip)
  }

  componentWillMount() {
    document.body.removeEventListener('showTooltip', this.handleShowTooltip)
  }

  handleShowTooltip = e => {
    if (e.detail !== this.props.title) this.setState({ showTooltip: false })
  }

  dispatchShowTooltip = () => {
    var event = new CustomEvent('showTooltip', { detail: this.props.title })
    document.body.dispatchEvent(event)
    this.setState({ showTooltip: true })
  }

  render() {
    const { licensed, item, values, title } = this.props
    const { showTooltip } = this.state
    const data = values || get(licensed, item, [])
    if (!data) return null
    return (
      <>
        <span
          ref={elem => (this.attachRef = elem)}
          className="popoverSpan"
          onMouseOver={() => this.dispatchShowTooltip()}
        >
          {data.join(', ')}
        </span>
        <Overlay
          target={this.attachRef}
          show={showTooltip}
          placement="left"
          rootClose
          rootCloseEvent={'click'}
          onHide={() => this.setState({ showTooltip: false })}
        >
          <Popover title={title} id={title}>
            <div className="popoverRenderer popoverRenderer_scrollY">
              {data.map((a, index) => (
                <div key={`${a}_${index}`} className="popoverRenderer__items">
                  <div className="popoverRenderer__items__value">
                    <span>{a}</span>
                  </div>
                </div>
              ))}
            </div>
          </Popover>
        </Overlay>
      </>
    )
  }
}
