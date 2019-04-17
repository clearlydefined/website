// Copyright (c) Microsoft Corporation and others. Licensed under the MIT license.
// SPDX-License-Identifier: MIT

import React, { Component } from 'react'
import { Grid, Row, Col } from 'react-bootstrap'
import Attachments from '../../../../utils/attachments'

export default class PageFiles extends Component {
  state = { content: null }

  componentDidMount() {
    const token = this.props.location.pathname.slice(this.props.match.url.length + 1)
    Attachments.fetchAttachmentWithToken(token).then(content => this.setState({ content }))
  }
  render() {
    const { content } = this.state
    return (
      <Grid className="main-container">
        <Row>
          <Col>
            <div className="file-content">
              <pre>{content}</pre>
            </div>
          </Col>
        </Row>
      </Grid>
    )
  }
}
