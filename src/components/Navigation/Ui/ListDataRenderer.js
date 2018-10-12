// Copyright (c) Microsoft Corporation and others. Licensed under the MIT license.
// SPDX-License-Identifier: MIT
import React, { Component } from 'react'
import get from 'lodash/get'
import { Popover, OverlayTrigger } from 'react-bootstrap'
import PropTypes from 'prop-types'

export default class ListDataRenderer extends Component {
  static propTypes = {
    licensed: PropTypes.object,
    item: PropTypes.object,
    title: PropTypes.string
  }

  render() {
    const { licensed, item, title } = this.props
    const values = get(licensed, item, [])
    if (!values) return null
    return (
      <OverlayTrigger
        trigger="click"
        placement="left"
        rootClose
        overlay={
          <Popover title={title} id={title}>
            <div className="popoverRenderer popoverRenderer_scrollY">
              {values.map((a, index) => (
                <div key={`${a}_${index}`} className="popoverRenderer__items">
                  <div className="popoverRenderer__items__value">
                    <span>{a}</span>
                  </div>
                </div>
              ))}
            </div>
          </Popover>
        }
      >
        <span className="popoverSpan">{values.join(', ')}</span>
      </OverlayTrigger>
    )
  }
}
