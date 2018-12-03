// Copyright (c) Microsoft Corporation and others. Licensed under the MIT license.
// SPDX-License-Identifier: MIT
import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { getBadgeUrl } from '../../../api/clearlyDefined'
import get from 'lodash/get'

class TitleWithScore extends Component {
  static propTypes = {
    title: PropTypes.string,
    domain: PropTypes.object
  }

  constructor(props) {
    super(props)
    this.renderScore = this.renderScore.bind(this)
  }

  renderScore(domain) {
    if (!domain) return null
    return (
      <img
        className="list-buttons"
        src={getBadgeUrl(get(domain, 'toolScore.total'), get(domain, 'score.total'))}
        alt="score"
      />
    )
  }

  render() {
    const { title, domain } = this.props
    return (
      <span>
        {title} {this.renderScore(domain)}
      </span>
    )
  }
}

export default TitleWithScore
