import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Button } from 'react-bootstrap'
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
        <ButtonWithTooltip tooltip="Revert all changes of all the definitions">
          <Button bsStyle="danger" disabled={hasChanges} onClick={revertAll}>
            <i className="fas fa-undo" />
            <span>&nbsp;Revert Changes</span>
          </Button>
        </ButtonWithTooltip>
        &nbsp;
        <Button bsStyle="default" disabled={hasChanges} onClick={collapseAll}>
          Collapse All
        </Button>
        &nbsp;
        <Button bsStyle="success" disabled={hasChanges} onClick={doPromptContribute}>
          Contribute
        </Button>
      </div>
    )
  }
}
