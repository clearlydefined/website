// Copyright (c) Microsoft Corporation and others. Licensed under the MIT license.
// SPDX-License-Identifier: MIT

import React from 'react'
import PropTypes from 'prop-types'
import isEqual from 'lodash/isEqual'
import FormGroup from 'react-bootstrap/lib/FormGroup'
import { RowEntityList, DefinitionEntry } from './'
import EntitySpec from '../utils/entitySpec'
import ComponentButtons from './Navigation/Ui/ComponentButtons'
import { withResize } from '../utils/WindowProvider'

class ComponentList extends React.Component {
  static propTypes = {
    list: PropTypes.array,
    listLength: PropTypes.number,
    loadMoreRows: PropTypes.func,
    multiSelectEnabled: PropTypes.bool,
    onRemove: PropTypes.func,
    onAddComponent: PropTypes.func,
    onChange: PropTypes.func,
    onInspect: PropTypes.func,
    noRowsRenderer: PropTypes.func,
    renderFilterBar: PropTypes.func,
    definitions: PropTypes.object,
    selected: PropTypes.object,
    sequence: PropTypes.number,
    toggleCheckbox: PropTypes.func,
    curations: PropTypes.object
  }

  static defaultProps = {
    selected: {}
  }

  constructor(props) {
    super(props)
    this.state = { contentSeq: 0, sortOrder: null, changes: {} }
    this.renderRow = this.renderRow.bind(this)
    this.rowHeight = this.rowHeight.bind(this)
    this.onEntryChange = this.onEntryChange.bind(this)
    this.getDefinition = this.getDefinition.bind(this)
  }

  componentWillReceiveProps(newProps) {
    if (newProps.definitions.sequence !== this.props.definitions.sequence) this.incrementSequence()
    if (newProps.curations.sequence !== this.props.curations.sequence) this.incrementSequence()
    if (newProps.sequence !== this.props.sequence) this.incrementSequence()
    if (!isEqual(newProps.list, this.props.list.sequence)) this.incrementSequence()
  }

  getDefinition(component) {
    return this.props.definitions.entries[EntitySpec.fromObject(component).toPath()]
  }

  getCuration(component) {
    return this.props.curations.entries[EntitySpec.fromObject(component).toPath()]
  }

  revertComponent(component, param) {
    const { onRevert } = this.props
    onRevert && onRevert(component, param)
  }

  onEntryChange(component, changes, field) {
    const { onChange } = this.props
    const newComponent = { ...component, changes }
    onChange && onChange(component, newComponent, field)
    this.incrementSequence()
  }

  incrementSequence() {
    this.setState({ ...this.state, contentSeq: this.state.contentSeq + 1 })
  }

  rowHeight({ index }) {
    const component = this.props.list[index]
    return component && component.expanded ? 150 * this.props.isMobileMultiplier : 50
  }

  toggleExpanded(component) {
    const { onChange } = this.props
    onChange && onChange(component, { ...component, expanded: !component.expanded })
    this.incrementSequence()
  }

  renderRow({ index, key, style }, toggleExpanded = null, showExpanded = false) {
    const {
      list,
      readOnly,
      hasChange,
      onAddComponent,
      onInspect,
      onRemove,
      onRevert,
      showVersionSelectorPopup,
      hideVersionSelector,
      onSelectAll,
      selected,
      toggleCheckbox,
      multiSelectEnabled,
      hideRemoveButton
    } = this.props

    const component = list[index]
    if (!component) return
    const definition = this.getDefinition(component) || { coordinates: component }
    let curation = this.getCuration(component)
    curation = curation || { contributions: [], curations: {} }
    return (
      <div key={key} style={style} className="component-row">
        <DefinitionEntry
          multiSelectEnabled={multiSelectEnabled}
          onSelectAll={onSelectAll}
          isSelected={selected[index] || false}
          toggleCheckbox={multiSelectEnabled && toggleCheckbox.bind(this, index)}
          draggable
          readOnly={readOnly}
          onClick={() => this.toggleExpanded(component)}
          curation={curation}
          definition={definition}
          component={component}
          onChange={this.onEntryChange}
          otherDefinition={definition.otherDefinition}
          classOnDifference="bg-info"
          renderButtons={() => (
            <ComponentButtons
              definition={definition}
              currentComponent={component}
              hasChange={hasChange}
              readOnly={readOnly}
              onAddComponent={onAddComponent}
              onInspect={onInspect}
              onRevert={onRevert}
              onRemove={onRemove}
              getDefinition={this.getDefinition}
              showVersionSelectorPopup={showVersionSelectorPopup}
              hideVersionSelector={hideVersionSelector}
              hideRemoveButton={hideRemoveButton}
            />
          )}
          onRevert={param => this.revertComponent(component, param)}
        />
      </div>
    )
  }

  render() {
    const { loadMoreRows, noRowsRenderer, list, listLength, renderFilterBar } = this.props
    const { sortOrder, contentSeq } = this.state
    return (
      <div className="component-list flex-grow">
        {renderFilterBar()}
        <FormGroup className="flex-grow-column">
          <RowEntityList
            list={list}
            listLength={listLength}
            loadMoreRows={loadMoreRows}
            rowRenderer={this.renderRow}
            rowHeight={this.rowHeight}
            noRowsRenderer={noRowsRenderer}
            sortOrder={sortOrder}
            contentSeq={contentSeq}
            customClassName={'components-list'}
          />
        </FormGroup>
      </div>
    )
  }
}

export default withResize(ComponentList)
