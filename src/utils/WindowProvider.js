// Copyright (c) Microsoft Corporation and others.
// SPDX-License-Identifier: MIT

import React, { PureComponent, createContext } from 'react'
import debounce from 'lodash/debounce'

const { Provider, Consumer } = createContext({ isMobile: undefined, isMobileMultiplier: 0 })

export class WindowProvider extends PureComponent {
  constructor(props) {
    super(props)

    this.state = this.getDimensions()

    this.trottledResize = debounce(this.updateDimensions, 100)
  }

  componentDidMount() {
    window.addEventListener('resize', debounce(this.updateDimensions))
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.trottledResize)
  }

  getDimensions() {
    const { documentElement } = document
    const body = document.getElementsByTagName('body')[0]
    const width = window.innerWidth || documentElement.clientWidth || body.clientWidth
    // const height = window.innerHeight || documentElement.clientHeight || body.clientHeight
    const isMobile = width < 768
    // if it's mobile size use 1.4x multipler for the component list height
    const isMobileMultiplier = isMobile ? 1.4 : 1

    return { isMobile, isMobileMultiplier }
  }

  updateDimensions = () => this.setState(this.getDimensions())

  render() {
    return <Provider value={this.state}>{this.props.children}</Provider>
  }
}

export const WindowConsumer = Consumer

export const withResize = Component => props => (
  <Consumer>{windowProps => <Component {...props} {...windowProps} />}</Consumer>
)
