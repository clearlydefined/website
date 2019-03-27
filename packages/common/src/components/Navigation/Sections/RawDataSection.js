// Copyright (c) Microsoft Corporation and others. Licensed under the MIT license.
// SPDX-License-Identifier: MIT
import React, { Component } from 'react'
import PropTypes from 'prop-types'
import Tabs from 'antd/lib/tabs'
import RawDataRenderer from '../Ui/RawDataRenderer'

export default class RawDataSection extends Component {
  static propTypes = {
    definition: PropTypes.object,
    curations: PropTypes.object,
    item: PropTypes.object,
    getCurationData: PropTypes.func,
    inspectedCuration: PropTypes.object,
    harvest: PropTypes.object
  }

  render() {
    const { curations, definition, harvest } = this.props
    return (
      <Tabs>
        <Tabs.TabPane tab="Current definition" key="1">
          <RawDataRenderer value={definition} name={'Current definition'} type={'yaml'} />
        </Tabs.TabPane>
        <Tabs.TabPane tab="Curations" key="2">
          <RawDataRenderer value={curations} name={'Curation'} type={'yaml'} />
        </Tabs.TabPane>
        <Tabs.TabPane tab="Harvested data" key="3">
          <RawDataRenderer value={harvest} name={'Harvested data'} type={'json'} />
        </Tabs.TabPane>
      </Tabs>
    )
  }
}
