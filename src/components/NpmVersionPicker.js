// Copyright (c) Microsoft Corporation. All rights reserved.
// SPDX-License-Identifier: MIT

import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { createPortal, findDOMNode } from 'react-dom';
import Select from 'react-select-plus';

export default class NpmVersionPicker extends Component {

  static propTypes = {
    value: PropTypes.object,
    onChange: PropTypes.func,
    backspaceRemoves: PropTypes.bool,
    request: PropTypes.object.isRequired,
  }

  static defaultProps = {
    backspaceRemoves: true,
  }

  constructor(props) {
    super(props)
    this.state = { createable: false }
    this.getOptions = this.getOptions.bind(this)
    this.onChange = this.onChange.bind(this)
    this.cleanInput = this.cleanInput.bind(this)
  }

  componentDidMount() {
    this.setState({ element: findDOMNode(this.select) });
  }

  async getOptions(value) {
    this.setState( {...this.state, createable: true})
    return []

    // TODO npmjs.com does not allow CORS GETs. Need to do something on the service? or a ServiceWorker?
    // try {
    //   const baseUrl = 'https://registry.npmjs.com'
    //   const { namespace, name } = this.props.request
    //   const fullName = `${namespace ? namespace + '/' : ''}${name}`;
    //   const url = `${baseUrl}/${encodeURIComponent(fullName).replace('%40', '@')}` // npmjs doesn't handle the escaped version
    //   const response = await fetch(url, { mode: 'cors' })
    //   const json = await response.json()
    //   this.setState( {...this.state, createable: false})
    //   return { options: Object.getOwnPropertyNames(json.versions) }
    // } catch (error) {
    //   this.setState( {...this.state, createable: true})
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
    onChange && onChange(value)
  }

  // protal building code from https://gist.github.com/Liooo/3bd6c79d5b4bdcded9927bbdd9133af0
  buildPortal() {
    return (props) => {
      if (!this.state.element)
        return props.children;

      const box = this.state.element.getBoundingClientRect();
      const style = {
        position: 'absolute',
        top: box.top + box.height,
        left: box.left,
        width: box.width,
      };
      return createPortal(
        <div style={style}>{props.children}</div>,
        document.getElementsByTagName('body')[0]
      );
    }
  }

  render() {
    const { request, backspaceRemoves } = this.props
    const kids = props => <Select {...props}
      ref={
        select => this.select = this.select || select}
    />
    const AsyncComponent = this.state.creatable
			? Select.AsyncCreatable
			: Select.Async;
    return (
      <div>
        <AsyncComponent
          children={kids}
          multi={false}
          value={request.revision}
          onChange={this.onChange}
          onBlurResetsInput={false}
          onCloseResetsInput={false}
          onInputChange={this.cleanInput}
          loadOptions={this.getOptions}
          simpleValue
          clearable
          autosize={false}
          placeholder={this.state.createable ? 'Could not fetch versions, type an NPM version' : 'Pick an NPM version'}
          backspaceRemoves={backspaceRemoves}
          dropdownComponent={this.buildPortal()}
        />
      </div>)
  }
}
