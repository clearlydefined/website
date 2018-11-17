import React, { Component } from 'react'

class SuggestionsList extends Component {
  render() {
    return (
      <div>
        {this.props.items.map(item => (
          <p key={item.version}>{item.value}</p>
        ))}
      </div>
    )
  }
}

export default SuggestionsList
