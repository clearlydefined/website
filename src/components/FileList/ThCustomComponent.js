import React, { Component } from 'react'

/**
 * Custom Table Head Component used for render inside TreeTable structure
 * 
 */
export default class ThCustomComponent extends Component {
  render() {
    const { ri, style, defaultProps, ...rest } = this.props
    return <defaultProps.ThComponent {...rest} style={{ ...style, textAlign: 'left', border: '0px' }} />
  }
}