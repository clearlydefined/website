// Copyright (c) Microsoft Corporation and others. Licensed under the MIT license.
// SPDX-License-Identifier: MIT
import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { OverlayTrigger, ButtonToolbar } from 'react-bootstrap'
import PopoverRenderer from './PopoverRenderer'

/**
 * Specific renderer for Copyrights data
 * It show a string of data, and if clicked opens a Popover containing a list of details
 *
 */
class CopyrightsRenderer extends Component {
  static defaultProps = {
    readOnly: false
  }

  render() {
    const { item, onSave, readOnly } = this.props
    return (
      <div>
        <OverlayTrigger
          trigger="click"
          rootClose
          container={document.getElementsByClassName('ReactTable')[0]}
          placement="left"
          overlay={
            <PopoverRenderer
              title={'Copyrights'}
              values={item.value}
              editable={!readOnly}
              canAdditems={!readOnly}
              onSave={onSave}
              editorType={'text'}
              editorPlaceHolder={'Copyright'}
            />
          }
        >
          <div>{item && item.value && item.value[0] ? item.value[0].value : null}</div>
        </OverlayTrigger>
      </div>
    )
  }
}

CopyrightsRenderer.propTypes = {
  /**
   * item to show
   */
  item: PropTypes.shape({
    value: PropTypes.array
  }).isRequired,

  onSave: PropTypes.func.isRequired,
  readOnly: PropTypes.bool
}

export default CopyrightsRenderer
