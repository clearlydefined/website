import React, { Component } from 'react'
import { FormControl, FormGroup, Glyphicon } from 'react-bootstrap'
import './FilterCustomComponent.css'

export default class FilterCustomComponent extends Component {
  constructor(props) {
    super(props);

    this.state = {
      filterValue: ''
    };
  }

  changeFilterValue = (filterValue) => {
    // Update local state 
    // then fire the callback to alert React-Table of the new filter
    this.setState({ filterValue: filterValue.target.value }, () => this.props.onChange(this.state));

  }

  render() {
    return (
      <FormGroup className="inputBox">
        <FormControl type="text" onChange={this.changeFilterValue} value={this.props.filter ? this.props.filter.value.filterValue : ''} />
        <FormControl.Feedback>
          <Glyphicon glyph="filter" />
        </FormControl.Feedback>
      </FormGroup>
    );
  }
}