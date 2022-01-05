// Copyright (c) Microsoft Corporation and others. Licensed under the MIT license.
// SPDX-License-Identifier: MIT
import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Row, Col } from 'react-bootstrap'
import LabelRenderer from './LabelRenderer'
import { InlineEditor, ModalEditor } from '../..'
import Contribution from '../../../utils/contribution'
import ListDataRenderer from '../Ui/ListDataRenderer'
import { Divider } from '@material-ui/core'
import carrortDown from "../../../images/icons/carrortDown.svg"
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
    type: PropTypes.string,
    value: PropTypes.any,
    editable: PropTypes.bool,
    multiple: PropTypes.bool,
    component: PropTypes.any,
    dropDown: PropTypes.bool,
  }

  constructor(props) {
    super(props)
    this.handleOpenForm = this.handleOpenForm.bind(this)
    this.state = {
      computedValue: '',
      openedForm: false
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
  // open close edit form
  handleOpenForm() {
    this.setState({ openedForm: !this.state.openedForm })
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
      component,
      lastIndex,
      labelIcon,
      dropDown,
      customBox,
      customBoxIcon,
    } = this.props
    const { computedValue, initialValue } = this.state
    const { licensed } = definition || {}

    const renderEditor = () =>
      editor ? (
        <ModalEditor
          definition={definition}
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
          definition={definition}
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
      <>
        {customBox ?
          <div className="row justify-content-center my-2 pt-2 align-items-start">
            <div className="col-12">
              <div className="custom-box">
                <div className="custom-box-header">
                  {customBoxIcon && customBoxIcon}
                  <LabelRenderer text={label} />
                </div>
                <div className="custom-box-body">
                  {component}
                </div>
              </div>
            </div>
          </div>
          :
          <>
            <Row className="tile-row">
              <Col md={labelIcon ? 12 : 3} xs={labelIcon ? 12 : 4} className="tile-row__title">
                <LabelRenderer text={label} />
                {labelIcon && labelIcon}:
                {dropDown &&
                  <img onClick={this.handleOpenForm}
                    className={`carrotImg ${this.state.openedForm ? 'openedForm' : 'closeForm'}`} src={carrortDown} alt="openForm" />
                }
              </Col>
              {dropDown && <Divider className="mt-3" />}
              <Col md={labelIcon ? 12 : 9} xs={labelIcon ? 12 : 8}
                className={`tile-row__definition ${dropDown ? !this.state.openedForm ? 'no-height' : '.' : ''}`}>
                {component ? (
                  dropDown ?
                    this.state.openedForm ?
                      component : null
                    :
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
            {lastIndex || dropDown ?
              null :
              <Divider />
            }
          </>
        }
      </>
    )
  }
}

export default EditableFieldRenderer
