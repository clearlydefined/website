import React, { Component } from 'react'
import { OverlayTrigger, ButtonToolbar } from 'react-bootstrap'
import PopoverRenderer from '../PopoverRenderer'
import './LicensesRenderer.css';
/**
 * Specific renderer for Licenses data
 * It show a string of data, and if clicked opens a Popover containing a list of details
 * 
 */
export default class LicensesRenderer extends Component {
  render() {
    const { item } = this.props;

    return (
      <ButtonToolbar>
        <OverlayTrigger trigger="click" rootClose placement="left" overlay={<PopoverRenderer title="Licenses" values={item.value} />} >
          <div>{item.value}</div>
        </OverlayTrigger>
      </ButtonToolbar>
    )
  }
}
