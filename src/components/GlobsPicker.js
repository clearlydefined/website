// Copyright (c) Microsoft Corporation and others. Licensed under the MIT license.
// SPDX-License-Identifier: MIT
import React, { Component } from 'react'
import PropTypes from 'prop-types'
import Tag from 'antd/lib/tag'
import Input from 'antd/lib/input'
import Tooltip from 'antd/lib/tooltip'
import Icon from 'antd/lib/icon'

export default class GlobPicker extends Component {
  static propTypes = {
    globs: PropTypes.oneOfType([PropTypes.string, PropTypes.array]).isRequired,
    onBlur: PropTypes.func,
    onChange: PropTypes.func,
    readOnly: PropTypes.bool
  }

  constructor(props) {
    super(props)
    this.state = {
      inputVisible: false,
      inputValue: ''
    }
  }

  handleClose = removedglob => {
    const { globs, onChange } = this.props
    const newGlobs = globs.filter(glob => glob !== removedglob)
    onChange(newGlobs)
  }

  showInput = () => {
    this.setState({ inputVisible: true }, () => this.input.focus())
  }

  handleInputChange = e => {
    this.setState({ inputValue: e.target.value })
  }

  handleInputConfirm = () => {
    const { globs, onChange } = this.props
    const { inputValue } = this.state
    let newGlobs = [...globs]
    if (inputValue && globs.indexOf(inputValue) === -1) newGlobs = [...globs, inputValue]
    this.setState({
      inputVisible: false,
      inputValue: ''
    })
    onChange(newGlobs)
  }

  saveInputRef = input => (this.input = input)

  render() {
    const { globs, className, readOnly } = this.props
    const { inputVisible, inputValue } = this.state

    return (
      <div className="editable-editor">
        {globs &&
          globs.map(glob => {
            const isLongTag = glob.length > 20
            const globElem = (
              <Tag className={className} key={glob} closable={!readOnly} afterClose={() => this.handleClose(glob)}>
                {isLongTag ? `${glob.slice(0, 20)}...` : glob}
              </Tag>
            )
            return isLongTag ? (
              <Tooltip title={glob} key={glob}>
                {globElem}
              </Tooltip>
            ) : (
              globElem
            )
          })}
        {inputVisible ? (
          <Input
            ref={this.saveInputRef}
            type="text"
            size="small"
            style={{ width: 78 }}
            value={inputValue}
            onChange={this.handleInputChange}
            onBlur={this.handleInputConfirm}
            onPressEnter={this.handleInputConfirm}
          />
        ) : (
          !readOnly && (
            <Tag onClick={this.showInput} style={{ background: '#fff', borderStyle: 'dashed' }}>
              <Icon type="plus" /> Add a valid Glob expression
            </Tag>
          )
        )}
      </div>
    )
  }
}
