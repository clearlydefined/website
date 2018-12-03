import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Modal, FormGroup, InputGroup, FormControl, Button } from 'react-bootstrap'

export default class SavePopUp extends Component {
  static propTypes = {
    prop: PropTypes
  }

  state = {
    fileName: null
  }

  doSave = () => {
    this.props.onSave(this.state.fileName)
  }

  render() {
    const { show, onHide } = this.props
    return (
      <Modal show={show} onHide={onHide}>
        <Modal.Header closeButton>
          <Modal.Title>Save the file with a name</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <FormGroup>
            <InputGroup>
              <FormControl
                type="text"
                placeholder="Type a name to apply to the file that is going to be saved"
                onChange={e => this.setState({ fileName: e.target.value })}
              />
              <InputGroup.Addon>.json</InputGroup.Addon>
            </InputGroup>
          </FormGroup>
        </Modal.Body>
        <Modal.Footer>
          <div>
            <FormGroup className="pull-right">
              <Button onClick={onHide}>Cancel</Button>
              <Button bsStyle="success" disabled={!this.state.fileName} type="button" onClick={() => this.doSave()}>
                OK
              </Button>
            </FormGroup>
          </div>
        </Modal.Footer>
      </Modal>
    )
  }
}
