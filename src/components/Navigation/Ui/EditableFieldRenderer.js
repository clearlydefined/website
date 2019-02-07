// Copyright (c) Microsoft Corporation and others. Licensed under the MIT license.
// SPDX-License-Identifier: MIT
import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Row, Col } from 'react-bootstrap'
import LabelRenderer from './LabelRenderer'
import { InlineEditor, ModalEditor } from '../..'
import Contribution from '../../../utils/contribution'
import ListDataRenderer from '../Ui/ListDataRenderer'

class EditableFieldRenderer extends Component {
  static propTypes = {
    label: PropTypes.string,
    field: PropTypes.string,
    placeholder: PropTypes.string,
    definition: PropTypes.object,
    previewDefinition: PropTypes.object,
    readOnly: PropTypes.bool,
    onChange: PropTypes.func,
    handleRevert: PropTypes.func,
    applyCurationSuggestion: PropTypes.func,
    type: PropTypes.string,
    value: PropTypes.any,
    editable: PropTypes.bool,
    multiple: PropTypes.bool,
    component: PropTypes.any
  }

  constructor(props) {
    super(props)
    this.state = {
      computedValue: ''
    }
  }

  componentDidMount() {
    const { definition, previewDefinition, field, type } = this.props
    this.setComputedValue(definition, previewDefinition, field, type)
  }

  componentWillReceiveProps(nextProps) {
    const { definition, previewDefinition, field, type } = nextProps
    this.setComputedValue(definition, previewDefinition, field, type)
  }

  setComputedValue(definition, previewDefinition, field, type) {
    let computedValue, initialValue
    switch (type) {
      case 'coordinates':
        computedValue = Contribution.printCoordinates(Contribution.getValue(definition, previewDefinition, field))
        initialValue = Contribution.printCoordinates(Contribution.getOriginalValue(definition, field))
        break
      case 'date':
        computedValue = Contribution.printDate(Contribution.getValue(definition, previewDefinition, field))
        initialValue = Contribution.printDate(Contribution.getOriginalValue(definition, field))
        break
      case 'license':
        computedValue = Contribution.getValue(definition, previewDefinition, field)
        initialValue = Contribution.getOriginalValue(definition, field)
        break
      default:
        break
    }
    this.setState({ computedValue, initialValue })
  }

  render() {
    const {
      label,
      field,
      placeholder,
      definition,
      previewDefinition,
      readOnly,
      onChange,
      handleRevert,
      type,
      value,
      editable,
      editor,
      multiple,
      component
    } = this.props
    const { computedValue, initialValue } = this.state
    const { licensed } = definition || {}

    const renderEditor = () =>
      editor ? (
        <ModalEditor
          field={field}
          extraClass={Contribution.classIfDifferent(definition, previewDefinition, field)}
          readOnly={readOnly}
          initialValue={initialValue}
          value={computedValue}
          onChange={value =>
            onChange(field, value, null, type === 'coordinates' ? Contribution.toSourceLocation : a => a)
          }
          validator
          revertable
          onRevert={() => handleRevert(field)}
          editor={editor}
          placeholder={placeholder}
        />
      ) : (
        <InlineEditor
          field={field}
          extraClass={Contribution.classIfDifferent(definition, previewDefinition, field)}
          readOnly={readOnly}
          type={type && type !== 'coordinates' ? type : 'text'}
          initialValue={initialValue}
          value={computedValue}
          onChange={value => onChange(field, value, null, a => a)}
          onRevert={() => handleRevert(field)}
          validator
          placeholder={placeholder}
        />
      )

    return (
      <Row className="no-gutters">
        <Col md={3}>
          <LabelRenderer text={label} />
        </Col>
        <Col md={9} className="definition__line">
          {component ? (
            component
          ) : editable ? (
            renderEditor()
          ) : multiple ? (
            <ListDataRenderer licensed={licensed} item={field} title={label} />
          ) : (
            <p className={`list-singleLine ${Contribution.classIfDifferent(definition, previewDefinition, field)}`}>
              {value}
            </p>
          )}
        </Col>
      </Row>
    )
  }
}

export default EditableFieldRenderer
