// Copyright (c) Microsoft Corporation and others. Licensed under the MIT license.
// SPDX-License-Identifier: MIT

import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { AsyncTypeahead, Highlighter } from 'react-bootstrap-typeahead'
import 'react-bootstrap-typeahead/css/Typeahead.css'
import npm from '../images/n-large.png'
import maven from '../images/maven.png'
import nuget from '../images/nuget.png'
import pod from '../images/pod.png'
import git from '../images/Git-Logo-2Color.png'
import crate from '../images/cargo.png'
import gem from '../images/gem.png'
import pypi from '../images/pypi.png'
import debian from '../images/debian.png'
import composer from '../images/packagist.png'

const types = {
  npm: npm,
  gem: gem,
  pypi: pypi,
  maven: maven,
  nuget: nuget,
  git: git,
  crate: crate,
  pod: pod,
  deb: debian,
  composer: composer
}

export default class FilterBar extends Component {
  static propTypes = {
    value: PropTypes.string,
    options: PropTypes.any.isRequired,
    onChange: PropTypes.func,
    clearOnChange: PropTypes.bool,
    defaultValue: PropTypes.string,
    onSearch: PropTypes.func.isRequired,
    onClear: PropTypes.func,
    onFocusChange: PropTypes.func
  }

  constructor(props) {
    super(props)
    this.onChange = this.onChange.bind(this)
    this.typeahead = React.createRef()
  }

  onChange(values) {
    const { onChange, clearOnChange, onClear } = this.props
    if (values.length) {
      onChange && onChange(values[0].name)
      // timing hack to work around https://github.com/ericgio/react-bootstrap-typeahead/issues/211
      clearOnChange && setTimeout(() => this.refs.typeahead && this.refs.typeahead.getInstance().clear(), 0)
    } else {
      onClear && onClear()
    }
  }

  filter(option, text) {
    return option.toLowerCase().includes(text.toLowerCase())
  }

  clear() {
    this.typeahead && this.typeahead.getInstance().clear()
  }

  render() {
    const { options, value, onSearch } = this.props
    return (
      <AsyncTypeahead
        inputProps={{
          name: 'filter-search'
        }}
        id="filter-bar"
        className="filter-bar"
        ref={typeahead => (this.typeahead = typeahead)}
        useCache={false}
        placeholder="Search for descriptors like “composer”, or “gem”"
        onChange={this.onChange}
        options={options.list}
        isLoading={options.isFetching}
        onSearch={onSearch}
        onFocus={e => this.props.onFocusChange(true)}
        onBlur={e => this.props.onFocusChange(false)}
        labelKey={option => {
          return option.namespace ? `${option.namespace}/${option.name}` : option.name
        }}
        clearButton
        selected={value ? [value.name] : []}
        renderMenuItemChildren={(option, props) => {
          return (
            <span className="filterBar-itemRenderer">
              <img src={types[option.type]} alt={option[props.labelKey]} />
              <Highlighter search={props.text}>{props.labelKey(option)}</Highlighter>
            </span>
          )
        }}
      />
    )
  }
}
