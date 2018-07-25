import React, { Component } from 'react'

/**
 * Custom Pivot Value Component used for render inside TreeTable structure
 * 
 */
export default class PivotValueCustomComponent extends Component {
  render() {
    const { defaultProps, ...cellInfo } = this.props;

    return <span>
      {cellInfo.value}
    </span>
  }
}