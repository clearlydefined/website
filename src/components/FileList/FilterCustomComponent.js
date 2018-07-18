import React, { Component } from 'react'

export default class FilterCustomComponent extends Component {
  constructor(props) {
    super(props);

    this.state = {
      filterValue: ''
    };
  }

  changeFilterValue = (filterValue) => {
    // Update local state
    this.setState({filterValue: filterValue.target.value}, () => this.props.onChange(this.state));
    // Fire the callback to alert React-Table of the new filter
    //this.props.onChange(newState);
  }

  render() {
    return (
      <input type="text" onChange={this.changeFilterValue} />
    );
  }
}