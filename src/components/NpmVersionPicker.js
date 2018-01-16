// Copyright (c) Microsoft Corporation. All rights reserved.
// SPDX-License-Identifier: MIT

import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { PortalSelect } from './'

export default class NpmVersionPicker extends Component {

  static propTypes = {
    value: PropTypes.object,
    onChange: PropTypes.func,
    backspaceRemoves: PropTypes.bool,
    request: PropTypes.object.isRequired,
  }

  static defaultProps = {
    backspaceRemoves: true,
    gotoValue: value => console.log(value)
  }

  constructor(props) {
    super(props)
    this.state = { creatable: false, created: [] }
    this.getOptions = this.getOptions.bind(this)
    this.onChange = this.onChange.bind(this)
    this.cleanInput = this.cleanInput.bind(this)
    this.newOptionCreator = this.newOptionCreator.bind(this)
  }

  async getOptions(value) {
    this.setState({ ...this.state, creatable: true })
    return this.state.created

    // TODO npmjs.com does not allow CORS GETs. Need to do something on the service? or a ServiceWorker?
    // try {
    //   const baseUrl = 'https://registry.npmjs.com'
    //   const { namespace, name } = this.props.request
    //   const fullName = `${namespace ? namespace + '/' : ''}${name}`;
    //   const url = `${baseUrl}/${encodeURIComponent(fullName).replace('%40', '@')}` // npmjs doesn't handle the escaped version
    //   const response = await fetch(url, { mode: 'cors' })
    //   const json = await response.json()
    //   this.setState( {...this.state, creatable: false})
    //   return { options: Object.getOwnPropertyNames(json.versions) }
    // } catch (error) {
    //   this.setState( {...this.state, creatable: true})
    //   console.log(error)
    //   return []
    // }
  }

  cleanInput(inputValue) {
    // Strip all whitespace characters from the input
    return inputValue.replace(/[\s]/g, '')
  }

  onChange(value) {
    const { onChange } = this.props
    this.setState({ ...this.state, created: [value, ...this.state.created] })
    this.forceUpdate()
    onChange && onChange(value.label)
  }

  newOptionCreator({ label, labelKey, valueKey }) {
    return { label, value: label }
  }

  render() {
    const { request, gotoValue, backspaceRemoves } = this.props
    const { creatable, created } = this.state
    return (
      <div>
        <PortalSelect
          multi={false}
          mode={creatable ? 'creatable' : 'select'}
          value={request.revision}
          options={created}
          onChange={this.onChange}
          onBlurResetsInput={false}
          onCloseResetsInput={false}
          onValueClick={gotoValue}
          onInputChange={this.cleanInput}
          // loadOptions={this.getOptions}
          clearable
          autosize={false}
          placeholder={this.state.creatable ? 'Could not fetch versions, type an NPM version' : 'Pick an NPM version'}
          backspaceRemoves={backspaceRemoves}
          newOptionCreator={this.newOptionCreator}
        />
      </div>)
  }
}
