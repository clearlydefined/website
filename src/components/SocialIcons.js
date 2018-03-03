// Copyright (c) Microsoft Corporation and others. Made available under the MIT license.
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
    className: "page__socials"
  }

  render() {
    const { website, github, facebook, twitter, instagram, email } = this.props.entity
    return (
      <span className={this.props.className}>
        {github && <a href={github} target="_blank"><FontAwesome name="github" /></a>}
        {website && <a href={website} target="_blank"><FontAwesome name="globe" /></a>}
        {email && <a href={'mailto:' + email}><FontAwesome name="envelope" /></a>}
        {facebook && <a href={facebook} target="_blank"><FontAwesome name="facebook-official" /></a>}
        {twitter && <a href={twitter} target="_blank"><FontAwesome name="twitter" /></a>}
        {instagram && <a href={instagram} target="_blank"><FontAwesome name="instagram" /></a>}
      </span>
    )
  }
}
