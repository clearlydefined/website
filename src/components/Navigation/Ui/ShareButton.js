import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { DropdownButton, MenuItem } from 'react-bootstrap'

export default class ShareButton extends Component {
  static propTypes = {
    components: PropTypes.object,
    onSelect: PropTypes.func
  }

  render() {
    const { components, onSelect } = this.props
    const disabled = !components || components.list.length === 0
    return (
      <DropdownButton disabled={disabled} id={'sharedropdown'} title="Share" bsStyle="success">
        <MenuItem eventKey="1" onSelect={() => onSelect('url')}>
          URL
        </MenuItem>
        <MenuItem eventKey="2" onSelect={() => onSelect('file')}>
          Coordinate list (JSON)
        </MenuItem>
        <MenuItem eventKey="2" onSelect={() => onSelect('notice')}>
          Notice file
        </MenuItem>
        <MenuItem divider />
        <MenuItem disabled>Definitions (Not implemented)</MenuItem>
        <MenuItem disabled>SPDX (Not implemented)</MenuItem>
      </DropdownButton>
    )
  }
}
