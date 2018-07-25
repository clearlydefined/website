import React, { Component } from 'react'
import { OverlayTrigger, ButtonToolbar } from 'react-bootstrap'
import PopoverRenderer from '../PopoverRenderer'
import './CopyrightsRenderer.css';

/**
 * Specific renderer for Copyrights data
 * It show a string of data, and if clicked opens a Popover containing a list of details
 * 
 */
export default class CopyrightsRenderer extends Component {
  render() {
    const { item } = this.props;

    return (
      <ButtonToolbar>
        <OverlayTrigger trigger="click" rootClose placement="left" overlay={<PopoverRenderer title="Copyrights" values={item.value} />} >
          <div>{item.value}</div>
        </OverlayTrigger>
      </ButtonToolbar>
    )
  }
}
