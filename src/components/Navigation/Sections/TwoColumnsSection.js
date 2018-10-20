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
        field: PropTypes.string,
        placeholder: PropTypes.string,
        type: PropTypes.string,
        editable: PropTypes.bool,
        editor: PropTypes.func,
        multiple: PropTypes.bool,
        component: PropTypes.any
      })
    )
  }

  render() {
    const { definition, elements } = this.props

    return (
      <Row>
        {elements.map((element, index) => (
          <Col md={6} key={`element_${index}`}>
            <EditableFieldRenderer
              editable={element.editable}
              editor={element.editor}
              label={element.label}
              field={element.field}
              placeholder={element.placeholder || null}
              type={element.type}
              component={element.component || null}
              multiple={element.multiple || false}
              value={element.value || null}
              definition={definition}
              {...this.props}
            />
          </Col>
        ))}
      </Row>
    )
  }
}

export default TwoColumnsSection
