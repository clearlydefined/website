import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Button, ButtonGroup } from 'react-bootstrap'
import { providers } from '../../../utils/utils'

export default class ProviderButtons extends Component {
  static propTypes = {
    onClick: PropTypes.func,
    activeProvider: PropTypes.string
  }

  render() {
    const { onClick, activeProvider } = this.props

    return (
      <ButtonGroup className="providers-button-wrapper">
        {providers.map(item => (
          <Button
            className="provider-button"
            name={item.value}
            onClick={() => onClick(item.value)}
            active={activeProvider === item.value}
          >
            <img src={item.image} height="20" alt={item.label} title={item.label} />
          </Button>
        ))}
      </ButtonGroup>
    )
  }
}
