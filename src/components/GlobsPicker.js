// Copyright (c) Microsoft Corporation and others. Licensed under the MIT license.
// SPDX-License-Identifier: MIT
import React, { Component } from 'react'
import PropTypes from 'prop-types'
import Tag from 'antd/lib/tag'
import Input from 'antd/lib/input'
import Tooltip from 'antd/lib/tooltip'
import Icon from 'antd/lib/icon'
import isEqual from 'lodash/isEqual'
import isValidGlob from 'is-valid-glob'
import withSuggestions from '../utils/withSuggestions'

class GlobsPicker extends Component {
  static propTypes = {
    globs: PropTypes.oneOfType([PropTypes.string, PropTypes.array]).isRequired,
    onChange: PropTypes.func,
    readOnly: PropTypes.bool
  }

  state = {
    inputVisible: false
  }

  handleClose = removedglob => {
    const { globs, onChange } = this.props
    const newGlobs = globs.filter(glob => glob !== removedglob)
    onChange(newGlobs)
  }

  showInput = () => this.setState({ inputVisible: true })

  handleInputConfirm = e => {
    const { value } = e.target
    const { globs, onChange } = this.props
    let newGlobs = [...globs]
    if (isValidGlob(value) && globs.indexOf(value) === -1) newGlobs = [...globs, value]
    this.setState({ inputVisible: false })
    if (newGlobs.length > 0 && !isEqual(newGlobs, globs)) onChange(newGlobs)
  }

  onChange = suggestion => this.props.onChange(suggestion)

  render() {
    const { globs, className, readOnly, onRevert } = this.props
    const { inputVisible } = this.state

    return (
      <div className="editable-editor">
        {!readOnly && (
          <i
            className={`fas fa-undo editable-marker ${globs.length > -1 ? '' : 'fa-disabled'}`}
            onClick={() => onRevert && globs && onRevert()}
          />
        )}
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
            autoFocus
            type="text"
            size="small"
            style={{ width: 78 }}
            onBlur={this.handleInputConfirm}
            onPressEnter={this.handleInputConfirm}
          />
        ) : (
          !readOnly && (
            <Tag onClick={this.showInput} style={{ background: '#fff', borderStyle: 'dashed' }}>
              <Icon type="plus" />
            </Tag>
          )
        )}
      </div>
    )
  }
}

export default withSuggestions(GlobsPicker)
