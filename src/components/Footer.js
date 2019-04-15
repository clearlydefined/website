// Copyright (c) Microsoft Corporation and others. Licensed under the MIT license.
// SPDX-License-Identifier: MIT

import React, { Component } from 'react'
import { SocialIcons } from './'
import { Col, Grid } from 'react-bootstrap'

// import { API_DEVELOP, API_PROD, API_LOCAL } from '../api/clearlyDefined';
// function colorize(content) {
//   const serverAddress = process.env.REACT_APP_ENVIRONMENT || API_DEVELOP;
//   if (serverAddress === API_PROD) return content;
//   if (serverAddress === API_LOCAL) return <font color="orange">{content}</font>;
//   return <font color="green">{content}</font>;
// }

export default class Footer extends Component {
  static propTypes = {}
  static defaultProps = {
    socials: {
      github: 'https://github.com/clearlydefined',
      // website: 'https://clearlydefined.io',
      email: 'mailto:clearlydefined@googlegroups.com',
      discord: 'https://discord.gg/wEzHJku',
      twitter: 'https://twitter.com/clearlydefd'
    }
  }

  render() {
    const { socials } = this.props
    return (
      <footer className="Footer">
        <Grid>
          <Col sm={4} xs={3} className="vcenter">
            <SocialIcons className="socials" entity={socials} />
          </Col>
          <Col sm={4} xs={5} className="text-center vcenter">
            Are you ClearlyDefined?
          </Col>
          <Col sm={4} xs={4} className="vcenter">
            <div className="pull-right right">
              <a href="https://docs.clearlydefined.io/legal/terms" target="_blank" rel="noopener noreferrer">
                Terms of use
              </a>{' '}
              <span>| </span>
              <a href="https://docs.clearlydefined.io/legal/privacy" target="_blank" rel="noopener noreferrer">
                Privacy policy
              </a>{' '}
              <span>| </span>
              <a href="https://docs.clearlydefined.io/legal/NOTICES">Notices</a>
            </div>
          </Col>
        </Grid>
      </footer>
    )
  }
}
