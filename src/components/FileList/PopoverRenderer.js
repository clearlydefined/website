import React from 'react'
import isArray from 'lodash/isArray'
import { Popover } from 'react-bootstrap'

/**
 * Component that renders a Popover
 * Data could be string or array of strings
 * 
 */
const PopoverComponent = (props) => {
  return (<Popover id="popover-positioned-left" title={props.title} {...props}>
    <div style={{ maxHeight: '200px', overflowY: 'auto', overflowX: 'hidden', width: '100%' }}>
      {props.values && isArray(props.values) ? props.values.map(item => <p key={item}>{item}</p>) : <p>{props.values}</p>}</div>
  </Popover>)
}

export default PopoverComponent;