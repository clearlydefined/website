import React, { Component } from 'react'

export default class FilterCustomComponent extends Component {
  constructor(props) {
    super(props);

    this.state = {
      filterValue: ''
    };
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevProps.filter && prevProps.filter.value.filterValue !== this.state.filterValue) {
      this.textInput.focus();
    }
  }

  changeFilterValue = (filterValue) => {
    // Update local state
    this.setState({ filterValue: filterValue.target.value }, () => this.props.onChange(this.state));
    // Fire the callback to alert React-Table of the new filter
    //this.props.onChange(newState);
  }

  render() {
    return (
      <input type="text" onChange={this.changeFilterValue} value={this.props.filter ? this.props.filter.value.filterValue : ''} ref={(input) => { this.textInput = input; }} />
    );
  }
}