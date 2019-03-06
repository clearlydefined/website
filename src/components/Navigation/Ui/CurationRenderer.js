// Copyright (c) Microsoft Corporation and others. Licensed under the MIT license.
// SPDX-License-Identifier: MIT
import React, { Component } from 'react'
import PropTypes from 'prop-types'
import TwoLineEntry from '../../TwoLineEntry'
import Tag from 'antd/lib/tag'
import Curation from '../../../utils/curation'

export default class CurationRenderer extends Component {
  static propTypes = {
    contribution: PropTypes.object,
    onClick: PropTypes.func
  }

  render() {
    const { contribution, onClick } = this.props
    return (
      <TwoLineEntry
        onClick={() => onClick && onClick(contribution.pr.number)}
        headline={
          <span>
            #{contribution.pr.number} {contribution.pr.title}{' '}
            <Tag className="cd-badge" color={this._tagColor(contribution)}>
              {this._tagText(contribution)}
            </Tag>
          </span>
        }
        message={<span>@{contribution.pr.user.login}</span>}
      />
    )
  }

  _tagColor(contribution) {
    if (Curation.isOpen(contribution)) return 'green'
    return Curation.isMerged(contribution) ? 'purple' : 'red'
  }

  _tagText(contribution) {
    if (Curation.isOpen(contribution)) return 'Open'
    return Curation.isMerged(contribution) ? 'Merged' : 'Closed'
  }
}
