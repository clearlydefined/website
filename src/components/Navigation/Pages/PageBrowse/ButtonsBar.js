// Copyright (c) Microsoft Corporation and others. Licensed under the MIT license.
// SPDX-License-Identifier: MIT

import React, { Component } from 'react'
import PropTypes from 'prop-types'
import Button from 'antd/lib/button'
import ButtonWithTooltip from '../../Ui/ButtonWithTooltip'

export default class ButtonsBar extends Component {
  static propTypes = {
    revertAll: PropTypes.func,
    collapseAll: PropTypes.func,
    doSave: PropTypes.func
  }

  onSelect = type => {
    switch (type) {
      case 'url':
        return this.props.shareUrl()
      case 'file':
        return this.props.shareFile()
      case 'gist':
        return this.props.shareGist()
      default:
        break
    }
  }

  render() {
    const { hasChanges, revertAll, collapseAll, doPromptContribute } = this.props
    return (
      <div className="pull-right">
        <ButtonWithTooltip tip="Revert all changes of all the definitions">
          <Button type="danger" disabled={hasChanges} onClick={revertAll} icon="undo">
            Revert Changes
          </Button>
        </ButtonWithTooltip>
        &nbsp;
        <Button type="default" disabled={hasChanges} onClick={collapseAll}>
          Collapse All
        </Button>
        &nbsp;
        <Button type="primary" disabled={hasChanges} onClick={doPromptContribute}>
          Contribute
        </Button>
      </div>
    )
  }
}
