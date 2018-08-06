// Copyright (c) Microsoft Corporation and others. Licensed under the MIT license.
// SPDX-License-Identifier: MIT
import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'

/**
 * Component that renders the Full Detail View as a Page
 *
 */
export class PageFullDetail extends Component {
  componentDidMount() {
    console.log(this.props.path)
  }

  render() {
    return <div />
  }
}

function mapStateToProps(state, ownProps) {
  const path = ownProps.location.pathname.slice(ownProps.match.url.length + 1)
  return {
    token: state.session.token,
    path
  }
}

const mapDispatchToProps = {}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(PageFullDetail)
