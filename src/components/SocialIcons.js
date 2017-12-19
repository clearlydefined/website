// Copyright (c) Microsoft Corporation. All rights reserved.
// SPDX-License-Identifier: MIT

import React, { Component } from 'react'
import PropTypes from 'prop-types'
import * as Fa from 'react-icons/lib/fa'
import * as Md from 'react-icons/lib/md'

export default class SocialIcons extends Component {
  static propTypes = {
    entity: PropTypes.object.isRequired,
    className: PropTypes.string
  }

  static defaultProps = {
    className: "page__socials"
  }

  render() {
    const { website, facebook, twitter, instagram, email } = this.props.entity
    return (
      <span className={this.props.className}>
        {website && <a href={website} target="_blank"><Md.MdPublic /></a>}
        {email && <a href={'mailto:' + email}><Fa.FaEnvelopeO /></a>}
        {facebook && <a href={facebook} target="_blank"><Fa.FaFacebook /></a>}
        {twitter && <a href={twitter} target="_blank"><Fa.FaTwitter /></a>}
        {instagram && <a href={instagram} target="_blank"><Fa.FaInstagram /></a>}
      </span>
    )
  }
}
