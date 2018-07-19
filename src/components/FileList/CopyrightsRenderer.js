import React, { Component } from 'react'
import ReactTooltip from 'react-tooltip'

export default class CopyrightsRenderer extends Component {
  render() {
    const { item, showPopup } = this.props;
    return (
      <div onClick={() => showPopup(item.value)}>
        {item.value}
      </div>
    )
  }
}
