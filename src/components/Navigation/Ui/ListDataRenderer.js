// Copyright (c) Microsoft Corporation and others. Licensed under the MIT license.
// SPDX-License-Identifier: MIT
import React, { Component } from 'react'
import get from 'lodash/get'
import { Popover, OverlayTrigger } from 'react-bootstrap'
import PropTypes from 'prop-types'

export default class ListDataRenderer extends Component {
  static propTypes = {
    licensed: PropTypes.object,
    item: PropTypes.string,
    title: PropTypes.string,
    trigger: PropTypes.string,
    values: PropTypes.array
  }

  static defaultProps = {
    trigger: 'hover'
  }

  render() {
    const { licensed, item, values, title, trigger } = this.props
    const data = values || get(licensed, item, [])
    if (!data) return null
    return (
      <OverlayTrigger
        trigger={trigger}
        placement="left"
        rootClose
        overlay={
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
        }
      >
        <span className="popoverSpan">{data.join(', ')}</span>
      </OverlayTrigger>
    )
  }
}
