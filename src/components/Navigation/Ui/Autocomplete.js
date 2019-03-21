// Copyright (c) Microsoft Corporation and others. Licensed under the MIT license.
// SPDX-License-Identifier: MIT

import React, { Component } from 'react'
import ReactDOM from 'react-dom'
import { Typeahead, Menu, menuItemContainer, Highlighter } from 'react-bootstrap-typeahead'
import { MenuItem } from 'react-bootstrap'
import get from 'lodash/get'
import 'react-bootstrap-typeahead/css/Typeahead.css'

const TypeaheadMenuItem = menuItemContainer(MenuItem)

export default class Autocomplete extends Component {
  renderMenu = (results, menuProps) =>
    ReactDOM.createPortal(
      <Menu {...menuProps}>
        {results.map((result, index) => (
          <TypeaheadMenuItem
            key={menuProps.labelKey && get(result, menuProps.labelKey) ? get(result, menuProps.labelKey) : result}
            option={result}
            position={index}
          >
            <Highlighter search={menuProps.text}>
              {menuProps.labelKey && get(result, menuProps.labelKey) ? get(result, menuProps.labelKey) : result}
            </Highlighter>
          </TypeaheadMenuItem>
        ))}
      </Menu>,
      document.body
    )

  render() {
    return <Typeahead {...this.props} renderMenu={this.renderMenu} />
  }
}
