// Copyright (c) Microsoft Corporation and others. Licensed under the MIT license.
// SPDX-License-Identifier: MIT
import React, { Component } from 'react'
import { Menu, Dropdown } from 'antd'
import SuggestionRenderer from './SuggestionRenderer'
class SuggestionsList extends Component {
  render() {
    const { items, onSelect } = this.props
    return (
      <div className="suggestionsWrapper">
        <Dropdown
          overlay={
            <Menu>
              <Menu.Item disabled>
                <span className="suggestionsWrapper__listHeader">Suggestions</span>
              </Menu.Item>
              {items.map(item => (
                <Menu.Item
                  className="page-definitions__menu-item"
                  key={item.version}
                  onClick={() => onSelect(item.value)}
                >
                  <SuggestionRenderer item={item} />
                </Menu.Item>
              ))}
            </Menu>
          }
          trigger={['click']}
        >
          <i className="fas fa-info-circle" />
        </Dropdown>
      </div>
    )
  }
}

export default SuggestionsList
