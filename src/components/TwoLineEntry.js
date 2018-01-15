// Copyright (c) Microsoft Corporation. All rights reserved.
// SPDX-License-Identifier: MIT

import React from 'react'
import PropTypes from 'prop-types'

export default class TwoLineEntry extends React.Component {
  static propTypes = {
    buttons: PropTypes.element,
    image: PropTypes.string,
    letter: PropTypes.string,
    headline: PropTypes.element,
    message: PropTypes.element,
    onClick: PropTypes.func,
  }

  static defaultProps = {
    onClick: () => { }
  };

  render() {
    const { buttons, image, headline, message, onClick, letter } = this.props
    return (
      <div className="list-row" onClick={onClick} >
        {image && <img className="list-image" src={image} alt="" />}
        {letter && !image && <span className="list-letter">{letter.slice(0, 1)}</span>}
        <div className="list-body">
          <div className="list-headline">
            {headline}
          </div>
          <div className="list-message">
            {message}
          </div>
        </div>
        {buttons}
      </div>
    )
  }
}
