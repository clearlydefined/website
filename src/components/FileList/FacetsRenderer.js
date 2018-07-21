import React, { Component } from 'react'

/**
 * Specific renderer for Facets
 * 
 */
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
