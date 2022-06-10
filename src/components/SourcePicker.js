// Copyright (c) Codescoop Oy and others. Licensed under the MIT license.
// SPDX-License-Identifier: MIT

import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Grid, Button, FormGroup } from 'react-bootstrap'
import SourceLocationPicker from './SourceLocationPicker'
import { PropTypes } from 'prop-types'

class SourcePicker extends Component {
  constructor(props) {
    super(props)
    this.state = {}
    this.onChangeComponent = this.onChangeComponent.bind(this)
  }

  static propTypes = {
    token: PropTypes.string,
    value: PropTypes.string,
    onChange: PropTypes.func.isRequired,
    onClose: PropTypes.func.isRequired
  }

  onChangeComponent(newComponent) {
    this.setState({ selectedComponent: newComponent })
  }

  renderActionButton() {
    const { onChange, onClose } = this.props
    return (
      <FormGroup className="pull-right">
        <Button
          bsStyle="success"
          onClick={() => (this.state.selectedComponent ? onChange(this.state.selectedComponent) : onClose())}
        >
          OK
        </Button>
        <Button onClick={() => onClose()}>Cancel</Button>
      </FormGroup>
    )
  }

  render() {
    const { value, token } = this.props
    return (
      <Grid className="main-container" id="source-picker">
        <SourceLocationPicker token={token} value={value} onChangeComponent={this.onChangeComponent} />
        {this.renderActionButton()}
      </Grid>
    )
  }
}

function mapStateToProps(state, ownProps) {
  return {
    token: state.session.token
  }
}
export default connect(mapStateToProps)(SourcePicker)
