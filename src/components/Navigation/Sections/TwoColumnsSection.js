// Copyright (c) Microsoft Corporation and others. Licensed under the MIT license.
// SPDX-License-Identifier: MIT
import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Row, Col } from 'react-bootstrap'
import EditableFieldRenderer from '../Ui/EditableFieldRenderer'

/**
 * Renders a Boostrap Row with two Columns
 * It accepts an array "elements", which contains a set of objects
 * Each element of the array will be rendered as an EditableFieldRenderer
 */
class TwoColumnsSection extends Component {
  static propTypes = {
    definition: PropTypes.object,
    elements: PropTypes.arrayOf(
      PropTypes.shape({
        label: PropTypes.string,
        labelIcon: PropTypes.any,
        lastIndex: PropTypes.bool,
        field: PropTypes.string,
        placeholder: PropTypes.string,
        type: PropTypes.string,
        editable: PropTypes.bool,
        editor: PropTypes.func,
        multiple: PropTypes.bool,
        component: PropTypes.any,

      })
    )
  }

  static defaulProps = {
    className: ''
  }

  render() {
    const { className, definition, elements } = this.props
    return (
      <Row className={className}>
        {elements.map((element, index) => (
          <Col md={12} key={`element_${index}`}>
            <EditableFieldRenderer
              editable={element.editable}
              editor={element.editor}
              label={element.label}
              lastIndex={element.lastIndex || false}
              labelIcon={element.labelIcon || null}
              field={element.field}
              placeholder={element.placeholder || null}
              type={element.type}
              component={element.component || null}
              multiple={element.multiple || false}
              value={element.value || null}
              definition={definition}
              {...this.props}
              dropDown={element.dropDown}
              customBox={element.customBox}
              customBoxIcon={element.customBoxIcon}
            />
          </Col>
        ))}
      </Row>
    )
  }
}

export default TwoColumnsSection
