// Copyright (c) Microsoft Corporation.
// SPDX-License-Identifier: MIT

import React, { Component } from 'react'
import { API_DEVELOP, API_PROD, API_LOCAL } from '../api/clearlyDefined'
import { SocialIcons } from './'
import { Col } from 'react-bootstrap'

function colorize(content) {
  const serverAddress = process.env.REACT_APP_ENVIRONMENT || API_DEVELOP
  if (serverAddress === API_PROD)
    return content
  if (serverAddress === API_LOCAL)
    return (<font color="orange">{content}</font>)
  return (<font color="green">{content}</font>)
}

export default class Footer extends Component {
  static propTypes = {}
  static defaultProps = {
    socials: {
      github: 'https://github.com/clearlydefined',
      website: 'https://clearlydefined.io',
      email: 'mailto:clearlydefined@outlook.com',
      discord: 'https://discord.gg/wEzHJku',
      twitter: 'https://twitter.com/clearlydefd'
    }
  }

  render() {
    const { socials } = this.props
    return <footer className="Footer">
      <Col sm={4} className="Footer-element">
        <SocialIcons className="Footer-socials" entity={socials} />
      </Col>
      <Col sm={4} className="Footer-element Footer-center">
        Are you ClearlyDefined?
      </Col>
      <Col sm={4} className="Footer-element">
        <div className="pull-right">{colorize('© ClearlyDefined')}</div>
      </Col>
    </footer >
  }
}