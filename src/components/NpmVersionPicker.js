// Copyright (c) Microsoft Corporation. All rights reserved.
// SPDX-License-Identifier: MIT

import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { PortalSelect } from './'
import { getNpmRevisions } from '../api/clearlyDefined'

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
    this.getOptions = this.getOptions.bind(this)
    this.onChange = this.onChange.bind(this)
    this.cleanInput = this.cleanInput.bind(this)
    this.newOptionCreator = this.newOptionCreator.bind(this)
  }

  async getOptions(value) {
    try {
      const { namespace, name } = this.props.request
      const path = name ? `${namespace}/${name}` : name
      const options = await getNpmRevisions(this.props.token, path)
      return { options }
    } catch (error) {
      console.log(error)
      return []
    }
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

  render() {
    const { request, gotoValue, backspaceRemoves } = this.props
    return (
      <div>
        <PortalSelect
          multi={false}
          mode='async'
          value={request.revision}
          onChange={this.onChange}
          onBlurResetsInput={false}
          onCloseResetsInput={false}
          onValueClick={gotoValue}
          onInputChange={this.cleanInput}
          loadOptions={this.getOptions}
          clearable
          autosize={false}
          placeholder={this.state.creatable ? 'Could not fetch versions, type an NPM version' : 'Pick an NPM version'}
          backspaceRemoves={backspaceRemoves}
        />
      </div>)
  }
}
