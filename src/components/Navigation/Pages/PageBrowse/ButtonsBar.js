import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Button } from 'react-bootstrap'
import ButtonWithTooltip from '../../Ui/ButtonWithTooltip'

export default class ButtonsBar extends Component {
  static propTypes = {
    doPromptContribute: PropTypes.func,
    toggleCollapseExpandAll: PropTypes.func,
    hasChanges: PropTypes.bool,
    revertAll: PropTypes.func
  }

  render() {
    const { hasChanges, revertAll, toggleCollapseExpandAll, doPromptContribute } = this.props
    return (
      <div className="text-right" data-test-id="page-browse-buttons-bar">
        <ButtonWithTooltip tip="Revert all changes of all the definitions">
          <Button bsStyle="danger" disabled={hasChanges} onClick={revertAll} data-test-id="revert-button">
            <i className="fas fa-undo" />
            <span>&nbsp;Revert Changes</span>
          </Button>
        </ButtonWithTooltip>
        <Button bsStyle="default" onClick={toggleCollapseExpandAll}>
          Toggle Collapse
        </Button>
        <Button bsStyle="success" disabled={hasChanges} onClick={doPromptContribute} data-test-id="contribute-button">
          Contribute
        </Button>
      </div>
    )
  }
}
