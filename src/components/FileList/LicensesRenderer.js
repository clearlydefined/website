import React, { Component } from 'react'

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
