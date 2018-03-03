// Copyright (c) 2018, The Linux Foundation and others. Licensed under the MIT license.
// SPDX-License-Identifier: MIT

import React from "react"
import PropTypes from "prop-types"
import Select from "react-select"

import "react-select/dist/react-select.css"

const options = [
  { value: "core", label: "Core" },
  { value: "data", label: "Data" },
  { value: "dev", label: "Dev" },
  { value: "docs", label: "Docs" },
  { value: "examples", label: "Examples" },
  { value: "tests", label: "Tests" }
]

export default class FacetSelect extends Select {
  static propTypes = {
    onChange: PropTypes.func,
    defaultFacets: PropTypes.array
  }

  static defaultProps = {}

  constructor(props) {
    super(props)
    this.state = { value: props.defaultFacets }
    this.facetChange = this.facetChange.bind(this)
  }

  facetChange(value) {
    this.setState({ value })
    const { onChange } = this.props
    onChange && onChange(value)
  }

  render() {
    const { value } = this.state;
    return (
      <Select
        name="facets"
        multi={true}
        options={options}
        onChange={this.facetChange}
        value={value}
      />
    )
  }
}
