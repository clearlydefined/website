// Copyright (c) Microsoft Corporation and others. Licensed under the MIT license.
// SPDX-License-Identifier: MIT

import React, { Component } from 'react'
import { SocialIcons } from './'

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
                ClearlyDefined is an 
                <a href="https://opensource.org" className="mx-1 highlighted-link-blue">OSI</a> project 
                maintained by a growing community.
              </p>
            </div>
            <div className="col-md-4 footer-links col-12 ml-md-auto mt-md-0 mt-4">
              <a href="https://docs.clearlydefined.io/docs/legal/terms" className="text-decoration-underline mx-2 d-inline text-white">Terms</a>
              <a href="https://docs.clearlydefined.io/docs/legal/privacy" className="text-decoration-underline mx-2 d-inline text-white">Privacy</a>
              <a href="https://docs.clearlydefined.io/docs/legal/NOTICES" className="text-decoration-underline mx-2 d-inline text-white">Notices</a>
            </div>
          </div>
        </div>
      </footer>
    )
  }
}
