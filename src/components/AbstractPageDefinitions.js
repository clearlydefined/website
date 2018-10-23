// Copyright (c) Microsoft Corporation and others. Licensed under the MIT license.
// SPDX-License-Identifier: MIT

import React, { Component } from 'react'
import { Modal, Grid, DropdownButton, MenuItem, FormGroup, InputGroup, FormControl, Button } from 'react-bootstrap'
import compact from 'lodash/compact'
import filter from 'lodash/filter'
import find from 'lodash/find'
import get from 'lodash/get'
import set from 'lodash/set'
import sortBy from 'lodash/sortBy'
import { curateAction } from '../actions/curationActions'
import { login } from '../actions/sessionActions'
import { ComponentList, Section, ContributePrompt } from './'
import FullDetailPage from './FullDetailView/FullDetailPage'
import { uiBrowseUpdateFilterList } from '../actions/ui'
import EntitySpec from '../utils/entitySpec'
import Definition from '../utils/definition'
import Auth from '../utils/auth'

const sorts = [
  { value: 'license', label: 'License' },
  { value: 'name', label: 'Name' },
  { value: 'namespace', label: 'Namespace' },
  { value: 'provider', label: 'Provider' },
  { value: 'releaseDate', label: 'Release Date' },
  { value: 'score', label: 'Score' },
  { value: 'type', label: 'Type' }
]

const licenses = [
  { value: 'apache-2.0', label: 'Apache-2.0' },
  { value: 'bsd-2-clause', label: 'BSD-2-Clause' },
  { value: 'cddl-1.0', label: 'CDDL-1.0' },
  { value: 'epl-1.0', label: 'EPL-1.0' },
  { value: 'gpl', label: 'GPL' },
  { value: 'lgpl', label: 'LGPL' },
  { value: 'mit', label: 'MIT' },
  { value: 'mpl-2.0', label: 'MPL-2.0' },
  { value: 'presence', label: 'Presence Of' },
  { value: 'absence', label: 'Absence Of' }
]

const sources = [{ value: 'presence', label: 'Presence Of' }, { value: 'absence', label: 'Absence Of' }]

const releaseDates = [{ value: 'presence', label: 'Presence Of' }, { value: 'absence', label: 'Absence Of' }]

export default class AbstractPageDefinitions extends Component {
  constructor(props) {
    super(props)
    this.state = {
      activeFilters: {},
      activeSort: null,
      sequence: 0,
      showFullDetail: false,
      path: null
    }
    this.onAddComponent = this.onAddComponent.bind(this)
    this.onSearch = this.onSearch.bind(this)
    this.onInspect = this.onInspect.bind(this)
    this.onRemoveComponent = this.onRemoveComponent.bind(this)
    this.onSort = this.onSort.bind(this)
    this.onFilter = this.onFilter.bind(this)
    this.onChangeComponent = this.onChangeComponent.bind(this)
    this.doPromptContribute = this.doPromptContribute.bind(this)
    this.doContribute = this.doContribute.bind(this)
    this.handleLogin = this.handleLogin.bind(this)
    this.renderFilterBar = this.renderFilterBar.bind(this)
    this.name = this.name.bind(this)
    this.namespace = this.namespace.bind(this)
    this.provider = this.provider.bind(this)
    this.type = this.type.bind(this)
    this.releaseDate = this.releaseDate.bind(this)
    this.license = this.license.bind(this)
    this.score = this.score.bind(this)
    this.transform = this.transform.bind(this)
    this.onRemoveAll = this.onRemoveAll.bind(this)
    this.collapseAll = this.collapseAll.bind(this)
    this.renderSavePopup = this.renderSavePopup.bind(this)
    this.contributeModal = React.createRef()
  }

  getDefinition(component) {
    return this.props.definitions.entries[EntitySpec.fromCoordinates(component).toPath()]
  }

  getValue(component, field) {
    return get(component, field)
  }

  onAddComponent(value, after = null) {}

  // can be implemented by subclasses to introduce a dropzone
  dropZone(child) {
    return child
  }

  onSearch(value) {
    const { dispatch, token } = this.props
    dispatch(uiBrowseUpdateFilterList(token, value))
  }

  // Opens a Modal that shows the Full Detail View
  onInspect(component, definition) {
    this.setState({
      ...(definition ? { currentDefinition: definition } : {}),
      path: EntitySpec.fromCoordinates(component).toPath(),
      currentComponent: EntitySpec.fromCoordinates(component),
      showFullDetail: true
    })
  }

  // Close the Full Detail Modal
  onInspectClose = () => {
    this.setState({ currentDefinition: null, currentComponent: null, showFullDetail: false })
  }

  onRemoveComponent(component) {
    this.props.dispatch(this.updateList({ remove: component }))
  }

  onRemoveAll() {
    this.props.dispatch(this.updateList({ removeAll: {} }))
  }

  onChangeComponent(component, newComponent) {
    this.setState({ currentDefinition: null, showFullDetail: false }, () => {
      this.incrementSequence()
      this.props.dispatch(this.updateList({ update: component, value: newComponent }))
    })
  }

  hasChanges() {
    const { components } = this.props
    return components && components.list.some(entry => this.hasChange(entry))
  }

  hasComponents() {
    const { components } = this.props
    return components && components.list.length > 0
  }

  hasChange(entry) {
    return entry.changes && Object.getOwnPropertyNames(entry.changes).length
  }

  /**
   * Dispatch the action to save a contribution
   * @param  {} constributionInfo object that describes the contribution
   */
  doContribute(constributionInfo) {
    const { dispatch, token, components } = this.props
    const patches = this.buildContributeSpec(components.list)
    const spec = { constributionInfo, patches }
    dispatch(curateAction(token, spec))
    this.refresh(constributionInfo.removeDefinitions)
  }

  buildContributeSpec(list) {
    return list.reduce((result, component) => {
      if (!this.hasChange(component)) return result
      const coord = EntitySpec.asRevisionless(component)
      const patch = find(result, p => {
        return EntitySpec.isEquivalent(p.coordinates, coord)
      })
      const revisionNumber = component.revision
      const patchChanges = Object.getOwnPropertyNames(component.changes).reduce((result, change) => {
        set(result, change, component.changes[change])
        return result
      }, {})
      if (patchChanges.files) patchChanges.files = compact(patchChanges.files)
      if (patch) {
        patch.revisions[revisionNumber] = patchChanges
      } else {
        const newPatch = { coordinates: coord, revisions: { [revisionNumber]: patchChanges } }
        result.push(newPatch)
      }
      return result
    }, [])
  }

  buildSaveSpec(list) {
    return list.reduce((result, component) => {
      result.push(EntitySpec.fromCoordinates(component))
      return result
    }, [])
  }

  doPromptContribute() {
    if (!this.hasChanges()) return
    this.contributeModal.current.open()
  }

  name(coordinates) {
    return coordinates.name ? coordinates.name : null
  }

  namespace(coordinates) {
    return coordinates.namespace ? coordinates.namespace : null
  }

  provider(coordinates) {
    return coordinates.provider ? coordinates.provider : null
  }

  type(coordinates) {
    return coordinates.type ? coordinates.type : null
  }

  releaseDate(coordinates) {
    const definition = this.props.definitions.entries[EntitySpec.fromCoordinates(coordinates).toPath()]
    return get(definition, 'described.releaseDate', null)
  }

  license(coordinates) {
    const definition = this.props.definitions.entries[EntitySpec.fromCoordinates(coordinates).toPath()]
    return get(definition, 'licensed.declared', null)
  }

  score(coordinates) {
    const definition = this.props.definitions.entries[EntitySpec.fromCoordinates(coordinates).toPath()]
    const scores = Definition.computeScores(definition)
    return scores ? (scores.tool + scores.effective) / 2 : -1
  }

  getSort(eventKey) {
    return this[eventKey]
  }

  onSort(eventKey) {
    let activeSort = eventKey.value
    if (this.state.activeSort === activeSort) activeSort = null
    this.setState({ ...this.state, activeSort, sequence: this.state.sequence + 1 })
    this.props.dispatch(this.updateList({ transform: this.createTransform(activeSort, this.state.activeFilters) }))
  }

  sortList(list, sortFunction) {
    return list ? sortBy(list, sortFunction) : list
  }

  filterList(list, activeFilters) {
    if (Object.keys(activeFilters).length === 0) return list
    return filter(list, component => {
      const definition = this.getDefinition(component)
      for (let filterType in activeFilters) {
        const value = activeFilters[filterType]
        const fieldValue = this.getValue(definition, filterType)
        if (value === 'presence') {
          if (!fieldValue) return false
        } else if (value === 'absence') {
          if (fieldValue) return false
        } else {
          if (!fieldValue || !fieldValue.toLowerCase().includes(value.toLowerCase())) {
            return false
          }
        }
      }
      return true
    })
  }

  onFilter(value) {
    const activeFilters = Object.assign({}, this.state.activeFilters)
    const filterValue = get(activeFilters, value.type)
    if (filterValue && activeFilters[value.type] === value.value) delete activeFilters[value.type]
    else activeFilters[value.type] = value.value
    this.setState({ ...this.state, activeFilters })
    this.props.dispatch(this.updateList({ transform: this.createTransform(this.state.activeSort, activeFilters) }))
  }

  transform(newList, sort, filters) {
    if (sort) {
      const sortFunction = this.getSort(sort)
      newList = this.sortList(newList, sortFunction)
    }
    if (filters) newList = this.filterList(newList, filters)
    return newList
  }

  createTransform(sort, filters) {
    return list => this.transform(list, sort, filters)
  }

  incrementSequence() {
    this.setState({ ...this.state, sequence: this.state.sequence + 1 })
  }

  checkSort(sortType) {
    return this.state.activeSort === sortType.value
  }

  checkFilter(filterType, id) {
    const { activeFilters } = this.state
    for (let filterId in activeFilters) {
      const filter = activeFilters[filterId]
      if (filterId === id && filter === filterType.value) return true
    }
    return false
  }

  renderSort(list, title, id) {
    return (
      <DropdownButton
        className="list-button"
        bsStyle="default"
        pullRight
        title={title}
        disabled={!this.hasComponents()}
        id={id}
      >
        {list.map((sortType, index) => {
          return (
            <MenuItem
              className="page-definitions__menu-item"
              key={index}
              onSelect={this.onSort}
              eventKey={{ type: id, value: sortType.value }}
            >
              <span>{sortType.label}</span>
              {this.checkSort(sortType) && <i className="fas fa-check" />}
            </MenuItem>
          )
        })}
      </DropdownButton>
    )
  }

  renderFilter(list, title, id) {
    return (
      <DropdownButton
        className="list-button"
        bsStyle="default"
        pullRight
        title={title}
        disabled={!this.hasComponents()}
        id={id}
      >
        {list.map((filterType, index) => {
          return (
            <MenuItem
              className="page-definitions__menu-item"
              key={index}
              onSelect={this.onFilter}
              eventKey={{ type: id, value: filterType.value }}
            >
              <span>{filterType.label}</span>
              {this.checkFilter(filterType, id) && <i className="fas fa-check" />}
            </MenuItem>
          )
        })}
      </DropdownButton>
    )
  }

  renderFilterBar() {
    return (
      <div className="list-filter" align="right">
        {this.renderSort(sorts, 'Sort By', 'sort')}
        {this.renderFilter(licenses, 'License', 'licensed.declared')}
        {this.renderFilter(sources, 'Source', 'described.sourceLocation')}
        {this.renderFilter(releaseDates, 'Release Date', 'described.releaseDate')}
      </div>
    )
  }

  collapseComponent(component) {
    this.onChangeComponent(component, { ...component, expanded: false })
  }

  collapseAll() {
    const { components } = this.props
    components.list.forEach(component => component.expanded && this.collapseComponent(component))
    this.incrementSequence()
  }

  updateList() {
    throw Error('This method has to be implemented in a sub class')
  }

  tableTitle() {
    throw Error('This method has to be implemented in a sub class')
  }

  renderSearchBar() {
    throw Error('This method has to be implemented in a sub class')
  }

  renderButtons() {
    throw Error('This method has to be implemented in a sub class')
  }

  noRowsRenderer() {
    throw Error('This method has to be implemented in a sub class')
  }

  readOnly() {
    throw Error('This method has to be implemented in a sub class')
  }

  handleLogin(e) {
    e.preventDefault()
    Auth.doLogin((token, permissions, username) => {
      this.props.dispatch(login(token, permissions, username))
    })
  }

  renderSavePopup() {
    return (
      <Modal show={this.state.showSavePopup} onHide={() => this.setState({ showSavePopup: false })}>
        <Modal.Header closeButton>
          <Modal.Title>Save the file with a name</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <FormGroup>
            <InputGroup>
              <FormControl
                type="text"
                placeholder="Type a name to apply to the file that is going to be saved"
                onChange={e => this.setState({ fileName: e.target.value })}
              />
              <InputGroup.Addon>.json</InputGroup.Addon>
            </InputGroup>
          </FormGroup>
        </Modal.Body>
        <Modal.Footer>
          <div>
            <FormGroup className="pull-right">
              <Button onClick={() => this.setState({ showSavePopup: false })}>Cancel</Button>
              <Button bsStyle="success" disabled={!this.state.fileName} type="button" onClick={() => this.doSave()}>
                OK
              </Button>
            </FormGroup>
          </div>
        </Modal.Footer>
      </Modal>
    )
  }

  render() {
    const { components, definitions, session } = this.props
    const { sequence, showFullDetail, path, currentComponent, currentDefinition } = this.state
    return (
      <Grid className="main-container">
        <ContributePrompt
          ref={this.contributeModal}
          session={session}
          onLogin={this.handleLogin}
          actionHandler={this.doContribute}
        />
        {this.renderSearchBar()}
        <Section name={this.tableTitle()} actionButton={this.renderButtons()}>
          {this.dropZone(
            <div className="section-body">
              <ComponentList
                readOnly={this.readOnly()}
                list={components.transformedList}
                listLength={get(components, 'headers.pagination.totalCount') || components.list.length}
                listHeight={1000}
                onRemove={this.onRemoveComponent}
                onRevert={this.revertDefinition}
                onChange={this.onChangeComponent}
                onAddComponent={this.onAddComponent}
                onInspect={this.onInspect}
                renderFilterBar={this.renderFilterBar}
                definitions={definitions}
                noRowsRenderer={this.noRowsRenderer}
                sequence={sequence}
                hasChange={this.hasChange}
              />
            </div>
          )}
        </Section>
        {currentDefinition && (
          <FullDetailPage
            modalView
            visible={showFullDetail}
            onClose={this.onInspectClose}
            onSave={this.onChangeComponent}
            path={path}
            currentDefinition={currentDefinition}
            component={currentComponent}
            readOnly={this.readOnly()}
          />
        )}
        {this.renderPopup()}
      </Grid>
    )
  }
}
