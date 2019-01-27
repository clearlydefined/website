// Copyright (c) Microsoft Corporation and others. Licensed under the MIT license.
// SPDX-License-Identifier: MIT
import React, { Component } from 'react'
import PropTypes from 'prop-types'
import ScoreRenderer from './ScoreRenderer'

class TitleWithScore extends Component {
  static propTypes = {
    title: PropTypes.string,
    domain: PropTypes.object
  }

  render() {
    const { title, domain } = this.props
    return (
      <span>
        {title} <ScoreRenderer domain={domain} />
      </span>
    )
  }
}

export default TitleWithScore
