// Copyright (c) Microsoft Corporation and others. Licensed under the MIT license.
// SPDX-License-Identifier: MIT

import React, { Component } from 'react'
import { Grid, Row, Col } from 'react-bootstrap'
import Attachments from '../../../../utils/attachments'

export default class PageFile extends Component {
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
            {content !== 404 ? (
              content && (
                <>
                  <div className="file-content">
                    <pre>{content.text}</pre>
                  </div>
                  {content.source === 'SWH' && (
                    <span>
                      Content Fetched from{' '}
                      <a href="https://www.softwareheritage.org/" target="_blank" rel="noopener noreferrer">
                        Software Heritage
                      </a>
                    </span>
                  )}
                </>
              )
            ) : (
              <span>The file referenced is not available individulally but they can download the full package</span>
            )}
          </Col>
        </Row>
      </Grid>
    )
  }
}
