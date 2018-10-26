import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Modal, FormGroup, Button } from 'react-bootstrap'
import { Select } from 'antd'
import { getRevisions } from '../../../api/clearlyDefined'
import EntitySpec from '../../../utils/entitySpec'

const Option = Select.Option
class VersionSelector extends Component {
  static propTypes = {
    multiple: PropTypes.bool,
    show: PropTypes.bool,
    onClose: PropTypes.func,
    onSave: PropTypes.func,
    component: PropTypes.object
  }
  constructor(props) {
    super(props)
    this.state = {
      options: [],
      selected: [],
      label: ''
    }
  }

  async componentWillReceiveProps(nextProps) {
    const { component, token, multiple } = nextProps
    if (!component) return
    try {
      const label = multiple
        ? `Pick one or move versions of ${EntitySpec.getEntityName(component)} to add to the definitions list`
        : `Pick a different version of ${EntitySpec.getEntityName(component)}`

      const options = await getRevisions(
        token,
        EntitySpec.getEntityName(component),
        EntitySpec.getEntityType(component)
      )
      this.setState({ ...this.state, options, label })
    } catch (error) {
      console.log(error)
      this.setState({ ...this.state, options: [] })
    }
  }
  handleChange = value => {
    this.setState({ selected: value })
  }
  doSave = () => {
    const { onSave } = this.props
    const { selected } = this.state
    this.setState(
      {
        options: [],
        selected: [],
        label: ''
      },
      () => onSave(selected)
    )
  }
  onClose = () => {
    const { onClose } = this.props
    this.setState(
      {
        options: [],
        selected: [],
        label: ''
      },
      () => onClose()
    )
  }
  render() {
    const { multiple, show, component } = this.props
    const { options, label } = this.state
    return (
      <Modal show={show} onHide={this.onClose}>
        <Modal.Header closeButton>
          <Modal.Title>{label}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <FormGroup>
            <Select
              mode={multiple && 'multiple'}
              style={{ width: '100%' }}
              placeholder={label}
              onChange={this.handleChange}
            >
              {options.map(option => (
                <Option key={EntitySpec.getRevisionToKey(option, component)}>
                  {EntitySpec.getRevisionToString(option, component)}
                </Option>
              ))}
            </Select>
          </FormGroup>
        </Modal.Body>
        <Modal.Footer>
          <div>
            <FormGroup className="pull-right">
              <Button onClick={this.onClose}>Cancel</Button>
              <Button bsStyle="success" type="button" onClick={() => this.doSave()}>
                OK
              </Button>
            </FormGroup>
          </div>
        </Modal.Footer>
      </Modal>
    )
  }
}

export default VersionSelector
