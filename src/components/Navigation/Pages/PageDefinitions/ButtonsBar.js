// Copyright (c) Microsoft Corporation and others. Licensed under the MIT license.
// SPDX-License-Identifier: MIT
import React, { Component } from 'react'
import PropTypes from 'prop-types'
import Button from 'antd/lib/button'
import ButtonWithTooltip from '../../Ui/ButtonWithTooltip'
import ShareButton from '../../Ui/ShareButton'

export default class ButtonsBar extends Component {
  static propTypes = {
    collapseAll: PropTypes.func,
    components: PropTypes.object,
    doPromptContribute: PropTypes.func,
    doRefreshAll: PropTypes.func,
    hasChanges: PropTypes.bool,
    onRemoveAll: PropTypes.func,
    revertAll: PropTypes.func,
    shareFile: PropTypes.func,
    shareGist: PropTypes.func,
    shareNotice: PropTypes.func,
    shareUrl: PropTypes.func
  }

  onSelect = ({ key }) => {
    switch (key) {
      case 'url':
        return this.props.shareUrl()
      case 'file':
        return this.props.shareFile()
      case 'notice':
        return this.props.shareNotice()
      case 'gist':
        return this.props.shareGist()
      default:
        break
    }
  }

  render() {
    const { components, hasChanges, revertAll, doRefreshAll, collapseAll, onRemoveAll, doPromptContribute } = this.props
    return (
      <div className="pull-right" data-test-id="page-definition-buttons-bar">
        <ButtonWithTooltip tip="Revert all changes of all the definitions">
          <Button type="danger" disabled={hasChanges} onClick={revertAll}>
            <i className="fas fa-undo" />
            <span>&nbsp;Revert Changes</span>
          </Button>
        </ButtonWithTooltip>
        &nbsp;
        <Button disabled={hasChanges} onClick={doRefreshAll}>
          Refresh
        </Button>
        &nbsp;
        <Button disabled={hasChanges} onClick={collapseAll}>
          Collapse All
        </Button>
        &nbsp;
        <Button type="danger" disabled={!components || components.list.length === 0} onClick={onRemoveAll}>
          Clear All
        </Button>
        &nbsp;
        <ShareButton components={components} onSelect={this.onSelect} />
        &nbsp;
        <Button type="primary" data-test-id="contribute-button" disabled={hasChanges} onClick={doPromptContribute}>
          Contribute
        </Button>
      </div>
    )
  }
}
