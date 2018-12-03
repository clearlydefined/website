import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Button, ButtonGroup } from 'react-bootstrap'

export default class ProviderButtons extends Component {
  static propTypes = {
    onClick: PropTypes.func,
    activeProvider: PropTypes.string
  }

  render() {
    const { onClick, activeProvider } = this.props
    return (
      <ButtonGroup>
        <Button name="github" onClick={onClick} active={activeProvider === 'github'}>
          GitHub
        </Button>
        <Button name="maven" onClick={onClick} active={activeProvider === 'maven'}>
          Maven
        </Button>
        <Button name="npm" onClick={onClick} active={activeProvider === 'npm'}>
          NPM
        </Button>
        <Button name="nuget" onClick={onClick} active={activeProvider === 'nuget'}>
          NuGet
        </Button>
        <Button name="crate" onClick={onClick} active={activeProvider === 'crate'}>
          Crate
        </Button>
        <Button name="pypi" onClick={onClick} active={activeProvider === 'pypi'}>
          PyPi
        </Button>
        <Button name="rubygems" onClick={onClick} active={activeProvider === 'rubygems'}>
          RubyGems
        </Button>
      </ButtonGroup>
    )
  }
}
