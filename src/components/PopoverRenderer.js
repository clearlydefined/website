// Copyright (c) Microsoft Corporation and others. Licensed under the MIT license.
// SPDX-License-Identifier: MIT
import React from 'react'
import PropTypes from 'prop-types'
import isArray from 'lodash/isArray'
import { Popover } from 'react-bootstrap'

/**
 * Component that renders a Popover
 * Data could be string or array of strings
 *
 */
const PopoverComponent = props => {
  return (
    <Popover id="popover-positioned-left" title={props.title} {...props}>
      <div className="popoverRenderer">
        {props.values && isArray(props.values) ? (
          props.values.map(item => <p key={item}>{item}</p>)
        ) : (
          <p>{props.values}</p>
        )}
      </div>
    </Popover>
  )
}

PopoverComponent.propTypes = {
  /**
   * title to show on the Popover
   */
  title: PropTypes.string.isRequired,
  /**
   * values to show, it can be string o either an array
   */
  values: PropTypes.oneOfType([PropTypes.string, PropTypes.array])
}

export default PopoverComponent
