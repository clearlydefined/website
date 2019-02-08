// Copyright (c) Microsoft Corporation and others. Licensed under the MIT license.
// SPDX-License-Identifier: MIT

import React from 'react'
import PropTypes from 'prop-types'
import isEqual from 'lodash/isEqual'
import { RowEntityList, DefinitionEntry } from './'
import EntitySpec from '../utils/entitySpec'
import ComponentButtons from './Navigation/Ui/ComponentButtons'

export default class ComponentList extends React.Component {
  static propTypes = {
    list: PropTypes.array,
    listLength: PropTypes.number,
    listHeight: PropTypes.number,
    loadMoreRows: PropTypes.func,
    onRemove: PropTypes.func,
    onAddComponent: PropTypes.func,
    onChange: PropTypes.func,
    onInspect: PropTypes.func,
    noRowsRenderer: PropTypes.func,
    renderFilterBar: PropTypes.func,
    definitions: PropTypes.object,
    sequence: PropTypes.number
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
    if (newProps.sequence !== this.props.sequence) this.incrementSequence()
    if (!isEqual(newProps.list, this.props.list.sequence)) this.incrementSequence()
  }

  getDefinition(component) {
    return this.props.definitions.entries[EntitySpec.fromCoordinates(component).toPath()]
  }

  revertComponent(component, param) {
    const { onRevert } = this.props
    onRevert && onRevert(component, param)
  }

  onEntryChange(component, changes) {
    const { onChange } = this.props
    const newComponent = { ...component, changes }
    onChange && onChange(component, newComponent)
    this.incrementSequence()
  }

  incrementSequence() {
    this.setState({ ...this.state, contentSeq: this.state.contentSeq + 1 })
  }

  rowHeight({ index }) {
    const component = this.props.list[index]
    if (!component) return 50
    return component.expanded ? 150 : 50
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
      hideVersionSelector
    } = this.props
    const component = list[index]
    if (!component) return
    let definition = this.getDefinition(component)
    definition = definition || { coordinates: component }
    return (
      <div key={key} style={style}>
        <DefinitionEntry
          draggable
          readOnly={readOnly}
          onClick={() => this.toggleExpanded(component)}
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
            />
          )}
          onRevert={param => this.revertComponent(component, param)}
        />
      </div>
    )
  }

  render() {
    const { loadMoreRows, listHeight, noRowsRenderer, list, listLength, renderFilterBar } = this.props
    const { sortOrder, contentSeq } = this.state
    return (
      <div>
        {renderFilterBar()}
        <RowEntityList
          list={list}
          listLength={listLength}
          loadMoreRows={loadMoreRows}
          listHeight={listHeight}
          rowRenderer={this.renderRow}
          rowHeight={this.rowHeight}
          noRowsRenderer={noRowsRenderer}
          sortOrder={sortOrder}
          contentSeq={contentSeq}
        />
      </div>
    )
  }
}
