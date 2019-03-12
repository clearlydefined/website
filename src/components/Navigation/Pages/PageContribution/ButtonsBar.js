import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Button } from 'react-bootstrap'

export default class ButtonsBar extends Component {
  static propTypes = {
    doSave: PropTypes.func,
    hasChanges: PropTypes.bool,
    toggleCollapseExpandAll: PropTypes.func
  }

  render() {
    const { hasChanges, toggleCollapseExpandAll, doSave } = this.props
    return (
      <div className="pull-right">
        <Button bsStyle="default" onClick={toggleCollapseExpandAll}>
          Toggle Collapse
        </Button>
        &nbsp;
        <Button bsStyle="success" disabled={hasChanges} onClick={doSave}>
          Done
        </Button>
      </div>
    )
  }
}
