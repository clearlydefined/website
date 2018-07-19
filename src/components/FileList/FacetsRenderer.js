import React, { Component } from 'react'

export default class FacetsRenderer extends Component {
  render() {
    const { item } = this.props;
    return (
      <div>
        {item.value}
      </div>
    )
  }
}
