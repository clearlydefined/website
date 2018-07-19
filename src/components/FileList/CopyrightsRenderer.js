import React, { Component } from 'react'
import ReactTooltip from 'react-tooltip'

export default class CopyrightsRenderer extends Component {
  render() {
    const { item } = this.props;
    return (
      <div data-tip={item.value && item.value.join('<br />')}>
        {item.value}
        <ReactTooltip multiline place="left" type="dark" effect="float" />
      </div>
    )
  }
}
