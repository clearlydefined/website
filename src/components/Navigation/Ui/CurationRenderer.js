// Copyright (c) Microsoft Corporation and others. Licensed under the MIT license.
// SPDX-License-Identifier: MIT
import React, { Component } from 'react'
import PropTypes from 'prop-types'
import TwoLineEntry from '../../TwoLineEntry'
import Tag from 'antd/lib/tag'

export default class CurationRenderer extends Component {
  static propTypes = {
    curation: PropTypes.object,
    onClick: PropTypes.func
  }

  render() {
    const { curation, onClick } = this.props
    return (
      <TwoLineEntry
        onClick={() => onClick && onClick(curation.number)}
        headline={
          <span>
            #{curation.number} {curation.title}{' '}
            <Tag color={curation.status === 'merged' ? 'green' : 'gold'}>
              {curation.status === 'merged' ? 'Curated' : 'Pending'}
            </Tag>
          </span>
        }
        message={<span>@{curation.contributor}</span>}
      />
    )
  }
}
