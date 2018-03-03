// Copyright (c) Microsoft Corporation and others. Licensed under the MIT license.
// SPDX-License-Identifier: MIT

import React, { Component } from 'react'
import PropTypes from 'prop-types'
import FontAwesome from 'react-fontawesome'

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
        <FontAwesome name={icon} />
      </a>
    )
  }

  render() {
    const { website, github, facebook, twitter, instagram, email, discord } = this.props.entity
    return (
      <span className={this.props.className}>
        {github && this.renderLink(github, 'github')}
        {website && this.renderLink(website, 'globe')}
        {email && this.renderLink('mailto:' + email, 'envelope')}
        {facebook && this.renderLink(facebook, 'facebook-official')}
        {twitter && this.renderLink(twitter, 'twitter')}
        {instagram && this.renderLink(instagram, 'instagram')}
        {discord && this.renderLink(discord, 'comment')}
      </span>
    )
  }
}
