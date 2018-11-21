// Copyright (c) Microsoft Corporation and others. Licensed under the MIT license.
// SPDX-License-Identifier: MIT
import React, { Component } from 'react'
import { Menu, Dropdown, Icon } from 'antd'
import SuggestionRenderer from './SuggestionRenderer'
class SuggestionsList extends Component {
  render() {
    const { field, items } = this.props
    return (
      <Dropdown
        overlay={
          <Menu>
            {items.map(item => (
              <Menu.Item className="page-definitions__menu-item" key={item.version}>
                <SuggestionRenderer item={item} />
              </Menu.Item>
            ))}
          </Menu>
        }
        trigger={['click']}
      >
        <i className="fas fa-info-circle" />
      </Dropdown>
    )
  }
}

export default SuggestionsList
