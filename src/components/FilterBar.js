// Copyright (c) Microsoft Corporation and others. Licensed under the MIT license.
// SPDX-License-Identifier: MIT

import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { AsyncTypeahead, Menu, menuItemContainer, Highlighter } from 'react-bootstrap-typeahead'
import { MenuItem } from 'react-bootstrap'
import get from 'lodash/get'
import 'react-bootstrap-typeahead/css/Typeahead.css'
import npm from '../images/n-large.png'
import maven from '../images/maven.png'
import nuget from '../images/nuget.svg'
import pod from '../images/pod.png'
import git from '../images/Git-Logo-2Color.png'
import crate from '../images/cargo.png'
import gem from '../images/gem.png'
import pypi from '../images/pypi.png'

const types = {
  npm: npm,
  gem: gem,
  pypi: pypi,
  maven: maven,
  nuget: nuget,
  git: git,
  crate: crate,
  pod: pod
}

const TypeaheadMenuItem = menuItemContainer(MenuItem)
export default class FilterBar extends Component {
  static propTypes = {
    value: PropTypes.string,
    options: PropTypes.any.isRequired,
    onChange: PropTypes.func,
    clearOnChange: PropTypes.bool,
    defaultValue: PropTypes.string,
    onSearch: PropTypes.func.isRequired,
    onClear: PropTypes.func
  }

  constructor(props) {
    super(props)
    this.onChange = this.onChange.bind(this)
    this.typeahead = React.createRef()
  }

  onChange(values) {
    const { onChange, clearOnChange, onClear } = this.props
    if (values.length) {
      onChange && onChange(values[0])
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

  renderItem = (result, menuProps) => {
    return (
      <>
        <img src={types[result.type]} height={30} />
        <Highlighter search={menuProps.text}>{result.name}</Highlighter>
      </>
    )
  }

  render() {
    const { options, value, onSearch } = this.props
    return (
      <AsyncTypeahead
        id="filter-bar"
        className="filter-bar"
        ref={typeahead => (this.typeahead = typeahead)}
        useCache={false}
        placeholder="Component search..."
        onChange={this.onChange}
        options={options.list}
        isLoading={options.isFetching}
        onSearch={onSearch}
        labelKey={'name'}
        clearButton
        selected={value ? [value.name] : []}
        renderMenu={(results, menuProps) => (
          <Menu {...menuProps}>
            {results.map((result, index) => {
              return (
                <MenuItem option={result} position={index} key={result.name}>
                  <TypeaheadMenuItem
                    key={
                      menuProps.labelKey && get(result, menuProps.labelKey) ? get(result, menuProps.labelKey) : result
                    }
                    option={result}
                    position={index}
                  >
                    {this.renderItem(result, menuProps)}
                  </TypeaheadMenuItem>
                </MenuItem>
              )
            })}
          </Menu>
        )}
      />
    )
  }
}
