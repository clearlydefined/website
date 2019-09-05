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
      <ButtonGroup>
        <Button name="npmjs" onClick={onClick} active={activeProvider === 'npmjs'}>
          <img src={providers.find(provider => provider.value === 'npmjs').image} height="20" alt="NPM" title="NPM" />
        </Button>
        <Button name="github" onClick={onClick} active={activeProvider === 'github'}>
          <img
            src={providers.find(provider => provider.value === 'github').image}
            height="20"
            alt="Github"
            title="Github"
          />
        </Button>
        <Button name="mavencentral" onClick={onClick} active={activeProvider === 'mavencentral'}>
          <img
            src={providers.find(provider => provider.value === 'mavencentral').image}
            height="20"
            alt="Maven"
            title="Maven"
          />
        </Button>
        <Button name="nuget" onClick={onClick} active={activeProvider === 'nuget'}>
          <img
            src={providers.find(provider => provider.value === 'nuget').image}
            height="20"
            alt="Nuget"
            title="Nuget"
          />
        </Button>
        <Button name="cratesio" onClick={onClick} active={activeProvider === 'cratesio'}>
          <img
            src={providers.find(provider => provider.value === 'cratesio').image}
            height="20"
            alt="Cratesio"
            title="Cratesio"
          />
        </Button>
        <Button name="pypi" onClick={onClick} active={activeProvider === 'pypi'}>
          <img src={providers.find(provider => provider.value === 'pypi').image} height="20" alt="Pypi" title="Pypi" />
        </Button>
        <Button name="rubygems" onClick={onClick} active={activeProvider === 'rubygems'}>
          <img
            src={providers.find(provider => provider.value === 'rubygems').image}
            height="20"
            alt="Rubygems"
            title="Rubygems"
          />
        </Button>
        <Button name="debian" onClick={onClick} active={activeProvider === 'debian'}>
          <img
            src={providers.find(provider => provider.value === 'debian').image}
            height="20"
            alt="Debian"
            title="Debian"
          />
        </Button>
        <Button name="packagist" onClick={onClick} active={activeProvider === 'packagist'}>
          Composer
        </Button>
      </ButtonGroup>
    )
  }
}
