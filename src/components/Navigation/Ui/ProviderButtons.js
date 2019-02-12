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
        <Button name="npmjs" onClick={onClick} active={activeProvider === 'npmjs'}>
          NPM
        </Button>
        <Button name="github" onClick={onClick} active={activeProvider === 'github'}>
          GitHub
        </Button>
        <Button name="mavencentral" onClick={onClick} active={activeProvider === 'mavencentral'}>
          Maven
        </Button>
        <Button name="nuget" onClick={onClick} active={activeProvider === 'nuget'}>
          NuGet
        </Button>
        <Button name="cratesio" onClick={onClick} active={activeProvider === 'cratesio'}>
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
