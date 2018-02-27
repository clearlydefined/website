// Copyright (c) 2018, The Linux Foundation. All rights reserved.
// SPDX-License-Identifier: MIT

import React from 'react'
import PropTypes from 'prop-types'
import Select from 'react-select'

import 'react-select/dist/react-select.css';

const options = [
  { value: 'core', label: 'Core'},
  { value: 'data', label: 'Data'},
  { value: 'dev', label: 'Dev'},
  { value: 'docs', label: 'Docs'},
  { value: 'examples', label: 'Examples'},
  { value: 'tests', label: 'Tests'}
]

export default class FacetSelect extends Select {
  
  static propTypes = {
    changeHandler: PropTypes.func,
    defaultFacets: PropTypes.array
  }

  static defaultProps = {
  }

  constructor (props) {
    super(props);
    this.state = {value: props.defaultFacets}
    this.facetChange = this.facetChange.bind(this)
  }

  facetChange (value) {
    console.log('You\'ve selected:', value)
    this.setState({value})
    console.log('Current state:', JSON.stringify(this.state))
    const { changeHandler } = this.props;
    changeHandler && changeHandler(value)
  }

  render () {
    const { value } = this.state;
    return (
      <div className="section">
        <Select
          name="facets"
          multi={true}
          options={options}
          onChange={this.facetChange}
          getInitialState={this.getInitialState}
          value={value} 
        />
      </div>
    ); 
  }
}

