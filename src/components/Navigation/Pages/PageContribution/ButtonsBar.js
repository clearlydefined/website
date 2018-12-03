import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Button } from 'react-bootstrap'

export default class ButtonsBar extends Component {
  static propTypes = {
    revertAll: PropTypes.func,
    collapseAll: PropTypes.func,
    doSave: PropTypes.func
  }

  render() {
    const { hasChanges, collapseAll, doSave } = this.props
    return (
      <div className="pull-right">
        <Button bsStyle="default" disabled={hasChanges} onClick={collapseAll}>
          Collapse All
        </Button>
        &nbsp;
        <Button bsStyle="success" disabled={hasChanges} onClick={doSave}>
          Save
        </Button>
      </div>
    )
  }
}
