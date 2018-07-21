import React, { Component } from 'react'

/**
 * Specific renderer for Licenses
 * 
 */
export default class LicensesRenderer extends Component {
  render() {
    const { item } = this.props;
    return (
      <div data-tip={item.value}>
        {item.value}
      </div>
    )
  }
}
