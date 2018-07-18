import React, { Component } from 'react'

/**
 * Custom Table Data Component used for render inside TreeTable structure
 * 
 */
export default class TdCustomComponent extends Component {
  render() {
    const { ri, style, defaultProps, ...rest } = this.props
    return <defaultProps.TdComponent {...rest} style={{ ...style, textAlign: 'left', border: '0px' }} />
  }
}