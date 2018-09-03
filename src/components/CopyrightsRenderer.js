// Copyright (c) Microsoft Corporation and others. Licensed under the MIT license.
// SPDX-License-Identifier: MIT
import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { OverlayTrigger } from 'react-bootstrap'
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

  state = {
    hasChanges: false
  }

  setHasChanges = hasChanges => {
    this.setState({ hasChanges })
  }

  render() {
    const { item, onSave, readOnly } = this.props
    const { hasChanges } = this.state
    return (
      <div>
        <OverlayTrigger
          trigger="click"
          rootClose={readOnly || !hasChanges} // hide overlay when the user clicks outside the overlay
          container={document.getElementsByClassName('ReactTable')[0]}
          placement="left"
          overlay={
            <PopoverRenderer
              title={'Copyrights'}
              values={item.value}
              editable={!readOnly}
              canAddItems={!readOnly}
              onSave={onSave}
              hasChanges={hasChanges}
              setHasChanges={this.setHasChanges}
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
