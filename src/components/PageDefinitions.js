// Copyright (c) Microsoft Corporation and others. Licensed under the MIT license.
// SPDX-License-Identifier: MIT

import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Grid, Row, Col, Button, DropdownButton, MenuItem, Navbar, Nav, NavItem, NavDropdown } from 'react-bootstrap'
import { ROUTE_DEFINITIONS, ROUTE_INSPECT, ROUTE_CURATE } from '../utils/routingConstants'
import { getDefinitionsAction } from '../actions/definitionActions'
import { curateAction } from '../actions/curationActions'
import { FilterBar, ComponentList, Section, ContributePrompt } from './'
import { uiNavigation, uiBrowseUpdateList, uiBrowseUpdateFilterList, uiNotificationNew } from '../actions/ui'
import EntitySpec from '../utils/entitySpec'
import { set, get, find, filter, sortBy } from 'lodash'
import { saveAs } from 'file-saver'
import Dropzone from 'react-dropzone'

const sorts = [
  { value: 'license', label: 'License' },
  { value: 'name', label: 'Name' },
  { value: 'namespace', label: 'Namespace' },
  { value: 'provider', label: 'Provider' },
  { value: 'releaseDate', label: 'Release Date' },
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

class PageDefinitions extends Component {
  constructor(props) {
    super(props)
    this.state = {
      activeFilters: {},
      activeSort: null,
      sequence: 0
    }
    this.onAddComponent = this.onAddComponent.bind(this)
    this.onDrop = this.onDrop.bind(this)
    this.onSearch = this.onSearch.bind(this)
    this.onInspect = this.onInspect.bind(this)
    this.onCurate = this.onCurate.bind(this)
    this.onRemoveComponent = this.onRemoveComponent.bind(this)
    this.onSort = this.onSort.bind(this)
    this.onFilter = this.onFilter.bind(this)
    this.onChangeComponent = this.onChangeComponent.bind(this)
    this.doPromptContribute = this.doPromptContribute.bind(this)
    this.doContribute = this.doContribute.bind(this)
    this.doSave = this.doSave.bind(this)
    this.renderFilterBar = this.renderFilterBar.bind(this)
    this.name = this.name.bind(this)
    this.namespace = this.namespace.bind(this)
    this.provider = this.provider.bind(this)
    this.type = this.type.bind(this)
    this.releaseDate = this.releaseDate.bind(this)
    this.license = this.license.bind(this)
    this.transform = this.transform.bind(this)
    this.onRemoveAll = this.onRemoveAll.bind(this)
    this.collapseAll = this.collapseAll.bind(this)
  }

  getDefinition(component) {
    return this.props.definitions.entries[EntitySpec.fromCoordinates(component).toPath()]
  }

  getValue(component, field) {
    return get(component, field)
  }

  componentDidMount() {
    const { dispatch } = this.props
    dispatch(uiNavigation({ to: ROUTE_DEFINITIONS }))
  }

  onAddComponent(value, after = null) {
    const { dispatch, token, definitions } = this.props
    const component = typeof value === 'string' ? EntitySpec.fromPath(value) : value
    const path = component.toPath()
    !definitions.entries[path] && dispatch(getDefinitionsAction(token, [path]))
    dispatch(uiBrowseUpdateList({ add: component }))
  }

  onDrop(acceptedFiles, rejectedFiles) {
    const { dispatch, token, definitions } = this.props
    dispatch(uiNotificationNew({ type: 'info', message: 'Loading component list from file(s)', timeout: 5000 }))
    acceptedFiles.forEach(file => {
      const reader = new FileReader()
      reader.onload = () => {
        const listSpec = this.loadListSpec(reader.result, file)
        if (typeof listSpec === 'string') {
          const message = `Invalid component list file: ${listSpec}`
          return dispatch(uiNotificationNew({ type: 'info', message, timeout: 5000 }))
        }
        listSpec.coordinates.forEach(component => {
          // TODO figure a way to add these in bulk. One by one will be painful for large lists
          const spec = EntitySpec.validateAndCreate(component)
          if (spec) {
            const path = spec.toPath()
            !definitions.entries[path] && dispatch(getDefinitionsAction(token, [path]))
            dispatch(uiBrowseUpdateList({ add: spec }))
          }
        })
      }
      reader.readAsBinaryString(file)
    })
  }

  loadListSpec(content, file) {
    try {
      const object = JSON.parse(content)
      if (file.name.toLowerCase() === 'package-lock.json') return this.loadPackageLockFile(object.dependencies)
      if (object.coordinates) return object
      return 'No component coordinates found'
    } catch (e) {
      return e.message
    }
  }

  loadPackageLockFile(dependencies) {
    const coordinates = []
    for (const dependency in dependencies) {
      let [namespace, name] = dependency.split('/')
      if (!name) {
        name = namespace
        namespace = null
      }
      coordinates.push({ type: 'npm', provider: 'npmjs', namespace, name, revision: dependencies[dependency].version })
    }
    return { coordinates }
  }

  onSearch(value) {
    const { dispatch, token } = this.props
    dispatch(uiBrowseUpdateFilterList(token, value))
  }

  onCurate(component) {
    const url = `${ROUTE_CURATE}/${component.toPath()}`
    this.props.history.push(url)
  }

  onInspect(component) {
    const url = `${ROUTE_INSPECT}/${component.toPath()}`
    this.props.history.push(url)
  }

  onRemoveComponent(component) {
    this.props.dispatch(uiBrowseUpdateList({ remove: component }))
  }

  onRemoveAll() {
    this.props.dispatch(uiBrowseUpdateList({ removeAll: {} }))
  }

  onChangeComponent(component, newComponent) {
    this.props.dispatch(uiBrowseUpdateList({ update: component, value: newComponent }))
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

  doContribute(description) {
    const { dispatch, token, components } = this.props
    const patches = this.buildContributeSpec(components.list)
    const spec = { description: description, patches }
    dispatch(curateAction(token, spec))
  }

  doSave() {
    const { components } = this.props
    const spec = this.buildSaveSpec(components.list)
    const fileObject = { filter: null, sortBy: null, coordinates: spec }
    const file = new File([JSON.stringify(fileObject, null, 2)], 'components.json')
    saveAs(file)
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

  doPromptContribute(proposal) {
    if (!this.hasChanges()) return
    this.refs.contributeModal.open()
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
    const described = get(definition, 'described')
    if (described && described.releaseDate) return described.releaseDate
    return null
  }

  license(coordinates) {
    const definition = this.props.definitions.entries[EntitySpec.fromCoordinates(coordinates).toPath()]
    const licensed = get(definition, 'licensed')
    if (licensed && licensed.declared) return licensed.declared
    return null
  }

  getSort(eventKey) {
    return this[eventKey]
  }

  onSort(eventKey) {
    let activeSort = eventKey.value
    if (this.state.activeSort === activeSort) activeSort = null
    this.setState({ ...this.state, activeSort, sequence: this.state.sequence + 1 })
    this.props.dispatch(uiBrowseUpdateList({ transform: this.createTransform(activeSort, this.state.activeFilters) }))
  }

  sortList(list, sortFunction) {
    return list ? sortBy(list, sortFunction) : list
  }

  filterList(list, activeFilters) {
    if (Object.keys(activeFilters).length === 0) return list
    return filter(list, component => {
      const defintion = this.getDefinition(component)
      for (let filterType in activeFilters) {
        const value = activeFilters[filterType]
        const fieldValue = this.getValue(defintion, filterType)
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
    this.props.dispatch(uiBrowseUpdateList({ transform: this.createTransform(this.state.activeSort, activeFilters) }))
  }

  transform(list, sort, filters) {
    let newList = list
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

  noRowsRenderer() {
    return <div>Search for a component above</div>
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
        bsStyle={''}
        pullRight
        title={title}
        disabled={!this.hasComponents()}
        id={id}
      >
        {list.map(sortType => {
          return (
            <MenuItem onSelect={this.onSort} eventKey={{ type: id, value: sortType.value }}>
              {sortType.label}
              {this.checkSort(sortType) && <i className="fas fa-check pull-right" />}
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
        bsStyle={''}
        pullRight
        title={title}
        disabled={!this.hasComponents()}
        id={id}
      >
        {list.map(filterType => {
          return (
            <MenuItem onSelect={this.onFilter} eventKey={{ type: id, value: filterType.value }}>
              {filterType.label}
              {this.checkFilter(filterType, id) && <i className="fas fa-check pull-right" />}
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

  renderButtons() {
    return (
      <div className="pull-right">
        <Button bsStyle="danger" disabled={!this.hasComponents()} onClick={this.onRemoveAll}>
          Clear All
        </Button>
        &nbsp;
        <Button bsStyle="default" disabled={!this.hasComponents()} onClick={this.collapseAll}>
          Collapse All
        </Button>
        &nbsp;
        <Button bsStyle="success" disabled={!this.hasComponents()} onClick={this.doSave}>
          Save
        </Button>
        &nbsp;
        <Button bsStyle="success" disabled={!this.hasChanges()} onClick={this.doPromptContribute}>
          Contribute
        </Button>
      </div>
    )
  }

  noRowsRenderer() {
    return () => <div className={'list-noRows'}>Search for components above ...</div>
  }

  render() {
    const { components, filterOptions, definitions, token } = this.props
    const { sequence } = this.state
    return (
      <Grid className="main-container">
        <ContributePrompt ref="contributeModal" actionHandler={this.doContribute} />
        <Row className="show-grid spacer">
          <Col md={10} mdOffset={1}>
            <FilterBar options={filterOptions} onChange={this.onAddComponent} onSearch={this.onSearch} clearOnChange />
          </Col>
        </Row>
        <Section name={'Available definitions'} actionButton={this.renderButtons()}>
          <Dropzone disableClick onDrop={this.onDrop} style={{ position: 'relative' }}>
            <div className="section-body">
              <ComponentList
                list={components.transformedList}
                listLength={get(components, 'headers.pagination.totalCount')}
                listHeight={1000}
                onRemove={this.onRemoveComponent}
                onChange={this.onChangeComponent}
                onAddComponent={this.onAddComponent}
                onInspect={this.onInspect}
                onCurate={this.onCurate}
                renderFilterBar={this.renderFilterBar}
                definitions={definitions}
                githubToken={token}
                noRowsRenderer={this.noRowsRenderer()}
                sequence={sequence}
              />
            </div>
          </Dropzone>
        </Section>
      </Grid>
    )
  }
}

function mapStateToProps(state, ownProps) {
  return {
    token: state.session.token,
    filterValue: state.ui.browse.filter,
    filterOptions: state.ui.browse.filterList,
    components: state.ui.browse.componentList,
    definitions: state.definition.bodies
  }
}
export default connect(mapStateToProps)(PageDefinitions)
