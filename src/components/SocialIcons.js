// Copyright (c) Microsoft Corporation and others. Licensed under the MIT license.
// SPDX-License-Identifier: MIT

import React, { Component } from 'react'
import PropTypes from 'prop-types'

export default class SocialIcons extends Component {
  static propTypes = {
    entity: PropTypes.object.isRequired,
    className: PropTypes.string
  }

  static defaultProps = {
    className: 'page__socials'
  }

  renderLink(href, icon) {
    return (
      <a href={href} target="_blank">
        <i className={icon} />
      </a>
    )
  }

  render() {
    const { website, github, facebook, twitter, instagram, email, discord } = this.props.entity
    return (
      <span className={this.props.className}>
        {github && this.renderLink(github, 'fab fa-github')}
        {website && this.renderLink(website, 'fas fa-globe')}
        {email && this.renderLink(email, 'fas fa-envelope')}
        {facebook && this.renderLink(facebook, 'fab fa-facebook')}
        {twitter && this.renderLink(twitter, 'fab fa-twitter')}
        {instagram && this.renderLink(instagram, 'fab fa-instagram')}
        {discord && this.renderLink(discord, 'fab fa-discord')}
      </span>
    )
  }
}
