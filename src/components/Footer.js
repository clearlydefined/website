// Copyright (c) Microsoft Corporation and others. Licensed under the MIT license.
// SPDX-License-Identifier: MIT

import React, { Component } from 'react'
import { SocialIcons } from './'
import { Link } from 'react-router-dom'

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
      <footer className="clearly-footer text-white">
        <div className="container">
          <div className="row justify-content-between align-items-center footer-row">
            <SocialIcons className="clearly-footer-socials pb-2" entity={socials} />
            <div className="col-md-8">
              <p class="mb-0">
                ClearlyDefined was created by the
                <Link to="/" className="mx-1 highlighted-link-blue">Open Source Initiative</Link>
                in partnership with
                <Link to="/" className="mx-1 highlighted-link-blue">Microsoft.</Link>
              </p>
            </div>
            <div className="col-md-4 footer-links col-12 ml-md-auto mt-md-0 mt-4">
              <Link to="/" className="text-decoration-underline mx-2 d-inline text-white">Terms</Link>
              <Link to="/" className="text-decoration-underline mx-2 d-inline  text-white">Privacy</Link>
              <Link to="/" className="text-decoration-underline mx-2 d-inline text-white">Notices</Link>
            </div>
          </div>
        </div>
      </footer>
      // <footer className="Footer">
      //   <Grid>
      //     <Col sm={4} xs={3} className="vcenter">
      //       <SocialIcons className="socials" entity={socials} />
      //     </Col>
      //     <Col sm={4} xs={5} className="text-center vcenter">
      //       Are you ClearlyDefined?
      //     </Col>
      //     <Col sm={4} xs={4} className="vcenter">
      //       <div className="pull-right right">
      //         <a href="https://docs.clearlydefined.io/legal/terms" target="_blank" rel="noopener noreferrer">
      //           Terms of use
      //         </a>{' '}
      //         <span>| </span>
      //         <a href="https://docs.clearlydefined.io/legal/privacy" target="_blank" rel="noopener noreferrer">
      //           Privacy policy
      //         </a>{' '}
      //         <span>| </span>
      //         <a href="https://docs.clearlydefined.io/legal/NOTICES">Notices</a>
      //       </div>
      //     </Col>
      //   </Grid>
      // </footer>
    )
  }
}
