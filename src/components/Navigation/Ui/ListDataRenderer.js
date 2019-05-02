// Copyright (c) Microsoft Corporation and others. Licensed under the MIT license.
// SPDX-License-Identifier: MIT
import React, { Component } from 'react'
import get from 'lodash/get'
import { Popover, Overlay } from 'react-bootstrap'
import PropTypes from 'prop-types'

export default class ListDataRenderer extends Component {
  constructor(...args) {
    super(...args)

    this.attachRef = target => this.setState({ target })
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

  render() {
    const { licensed, item, values, title, trigger } = this.props
    const { show, target } = this.state
    const data = values || get(licensed, item, [])
    if (!data) return null
    return (
      <>
        <span ref={this.attachRef} className="popoverSpan" onMouseOver={() => this.setState({ showTooltip: true })}>
          {data.join(', ')}
        </span>
        <Overlay
          target={target}
          show={this.state.showTooltip}
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
