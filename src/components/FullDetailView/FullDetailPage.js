// Copyright (c) Microsoft Corporation and others. Licensed under the MIT license.
// SPDX-License-Identifier: MIT
import React, { Component } from 'react'
import { connect } from 'react-redux'

/**
 * Component that renders the Full Detail View as a Page
 *
 */
export class FullDetailPage extends Component {
  constructor(props) {
    super(props)

    this.state = {
      path: props.location.pathname.slice(props.match.url.length + 1)
    }
  }

  render() {
    const { path } = this.state

    return <div>{path}</div>
  }
}

function mapStateToProps(state) {
  return {
    token: state.session.token
  }
}

const mapDispatchToProps = {}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(FullDetailPage)
