import React, { Component } from 'react'
import { Popover, OverlayTrigger, ButtonToolbar } from 'react-bootstrap'
import './CopyrightsRenderer.css';

const PopoverComponent = (props) => {
  return (<Popover id="popover-positioned-left" title="Copyrights" {...props}>
    <div style={{ maxHeight: '200px', overflowY: 'auto', overflowX: 'hidden', width: '100%' }}>
      {props.values && props.values.map(item => <p key={item}>{item}</p>)}</div>
  </Popover>)
}

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
        <OverlayTrigger trigger="click" rootClose placement="left" overlay={<PopoverComponent values={item.value} />} >
          <div>{item.value}</div>
        </OverlayTrigger>
      </ButtonToolbar>
    )
  }
}
