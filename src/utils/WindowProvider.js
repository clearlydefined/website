// Copyright (c) Microsoft Corporation and others.
// SPDX-License-Identifier: MIT

import React, { PureComponent, createContext } from 'react'

const { Provider, Consumer } = createContext({ isMobile: undefined, isMobileMultiplier: 0 })

export class WindowProvider extends PureComponent {
  state = this.getDimensions()

  constructor(props) {
    super(props)
    ;(function() {
      const throttle = (type, name, obj) => {
        obj = obj || window
        let running = false
        function func() {
          if (running) return
          running = true
          requestAnimationFrame(function() {
            obj.dispatchEvent(new CustomEvent(name))
            running = false
          })
        }
        obj.addEventListener(type, func)
      }

      /* init - you can init any event */
      throttle('resize', 'optimizedResize')
    })()
  }

  componentDidMount() {
    window.addEventListener('optimizedResize', this.updateDimensions)
  }

  componentWillUnmount() {
    window.removeEventListener('optimizedResize', this.updateDimensions)
  }

  getDimensions() {
    const { documentElement } = document
    const body = document.getElementsByTagName('body')[0]
    const width = window.innerWidth || documentElement.clientWidth || body.clientWidth
    // const height = window.innerHeight || documentElement.clientHeight || body.clientHeight
    const isMobile = width < 768
    // if it's mobile size use 1.4x multipler for the component list height
    const isMobileMultiplier = isMobile ? 1 : 1.4

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
