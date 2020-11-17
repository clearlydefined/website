// Copyright (c) Microsoft Corporation and others. Licensed under the MIT license.
// SPDX-License-Identifier: MIT

import React, { Component } from 'react'
import throat from 'throat'
import compact from 'lodash/compact'
import filter from 'lodash/filter'
import find from 'lodash/find'
import get from 'lodash/get'
import set from 'lodash/set'
import sortBy from 'lodash/sortBy'
import chunk from 'lodash/chunk'
import isEmpty from 'lodash/isEmpty'
import isEqual from 'lodash/isEqual'
import isNumber from 'lodash/isNumber'
import isString from 'lodash/isString'
import notification from 'antd/lib/notification'
import { curateAction, getCurationsAction } from '../actions/curationActions'
import { login } from '../actions/sessionActions'
import { getDefinitionsAction, checkForMissingDefinition } from '../actions/definitionActions'
import { uiBrowseUpdateFilterList, uiRevert, uiInfo, uiDanger } from '../actions/ui'
import EntitySpec from '../utils/entitySpec'
import Auth from '../utils/auth'
import NotificationButtons from './Navigation/Ui/NotificationButtons'
import { multiEditableFields } from '../utils/utils'

/**
 * Abstracts methods for system-managed list
 * Implements and expose all the methods used in any list that is read-only
 * The user can only export data from this kind of list, without the allowance to import or drop new data
 */
export default class SystemManagedList extends Component {
  constructor(props) {
    super(props)
    this.state = {
      activeFilters: {},
      activeSort: null,
      selected: {},
      sequence: 0,
      showFullDetail: false,
      path: null,
      removeContributedDefinitions: false
    }
    this.readOnly = true
    this.multiSelectEnabled = false
    this.getDefinition = this.getDefinition.bind(this)
    this.getValue = this.getValue.bind(this)
    this.hasChanges = this.hasChanges.bind(this)
    this.hasChange = this.hasChange.bind(this)
    this.hasComponents = this.hasComponents.bind(this)
    this.updateList = this.updateList.bind(this)
    this.onSearch = this.onSearch.bind(this)
    this.onInspect = this.onInspect.bind(this)
    this.onSort = this.onSort.bind(this)
    this.onFilter = this.onFilter.bind(this)
    this.onChangeComponent = this.onChangeComponent.bind(this)
    this.doPromptContribute = this.doPromptContribute.bind(this)
    this.doContribute = this.doContribute.bind(this)
    this.getDefinitionsWithChanges = this.getDefinitionsWithChanges.bind(this)
    this.handleLogin = this.handleLogin.bind(this)
    this.transform = this.transform.bind(this)
    this.createTransform = this.createTransform.bind(this)
    this.toggleCollapseExpandAll = this.toggleCollapseExpandAll.bind(this)
    this.incrementSequence = this.incrementSequence.bind(this)
    this.getDefinitionsAndNotify = this.getDefinitionsAndNotify.bind(this)
    this.getCurations = this.getCurations.bind(this)
    this.revertAll = this.revertAll.bind(this)
    this.revert = this.revert.bind(this)
    this.revertDefinition = this.revertDefinition.bind(this)
    this.contributeModal = React.createRef()
  }

  getDefinition(component) {
    const definition = this.props.definitions.entries[EntitySpec.fromObject(component).toPath()]
    if (component.changes) definition.changes = component.changes
    return definition
  }

  getValue(component, field) {
    return get(component, field)
  }

  onSearch(value) {
    const { dispatch, token } = this.props
    dispatch(uiBrowseUpdateFilterList(token, value))
  }

  // Opens a Modal that shows the Full Detail View
  onInspect(component, definition) {
    this.setState({
      ...(definition ? { currentDefinition: definition } : {}),
      path: EntitySpec.fromObject(component).toPath(),
      currentComponent: EntitySpec.fromObject(component),
      showFullDetail: true
    })
  }

  // Close the Full Detail Modal
  onInspectClose = () => {
    this.setState({ currentDefinition: null, currentComponent: null, showFullDetail: false })
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
   * @param  {*} contributionInfo object that describes the contribution
   */
  doContribute(contributionInfo) {
    const { dispatch, token, components } = this.props
    let patches
    const { selectedEntries, selectedComponents } = this.getSelectedComponents()
    // contribute all the components
    if (selectedEntries.length === 0) {
      patches = this.buildContributeSpec(components.transformedList)
    } else {
      patches = this.buildContributeSpec(selectedComponents)
    }
    const spec = { contributionInfo, patches }
    dispatch(curateAction(token, spec))
    this.setState({ removeContributedDefinitions: contributionInfo.removeDefinitions })
  }

  buildContributeSpec(list) {
    return list.reduce((result, component) => {
      if (!this.hasChange(component)) return result
      const coord = EntitySpec.withoutRevision(component)
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

  doPromptContribute() {
    if (!this.hasChanges()) return
    this.contributeModal.current.open()
  }

  getDefinitionsWithChanges() {
    const { components } = this.props
    const res = this.getSelectedComponents()
    if (res.selectedComponents.length > 0) return res.selectedComponents.filter(component => this.hasChange(component))
    return components.transformedList.filter(component => this.hasChange(component))
  }

  getSort(eventKey) {
    const sorts = {
      name: coordinates => (coordinates.name ? coordinates.name : null),
      namespace: coordinates => (coordinates.namespace ? coordinates.namespace : null),
      provider: coordinates => (coordinates.provider ? coordinates.provider : null),
      type: coordinates => (coordinates.type ? coordinates.type : null),
      releaseDate: coordinates => {
        const definition = this.props.definitions.entries[EntitySpec.fromObject(coordinates).toPath()]
        return get(definition, 'described.releaseDate', null)
      },
      license: coordinates => {
        const definition = this.props.definitions.entries[EntitySpec.fromObject(coordinates).toPath()]
        return get(definition, 'licensed.declared', null)
      },
      score: coordinates => {
        const definition = this.props.definitions.entries[EntitySpec.fromObject(coordinates).toPath()]
        const scores = get(definition, 'scores')
        return scores ? (get(scores, 'tool') + get(scores, 'effective')) / 2 : -1
      }
    }
    return sorts[eventKey]
  }

  onSort(eventKey) {
    let activeSort = eventKey.value
    if (this.state.activeSort === activeSort) activeSort = null
    this.setState({ ...this.state, activeSort, sequence: this.state.sequence + 1 })
    this.updateList({ transform: this.createTransform(activeSort, this.state.activeFilters) })
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
        if (!value) return true
        if (value === 'PRESENCE OF') {
          if (!fieldValue) return false
        } else if (value === 'ABSENCE OF') {
          if (fieldValue && !['NONE', 'NOASSERTION', 'OTHER'].includes(fieldValue)) return false
        } else {
          if (!fieldValue || (isString(fieldValue) && !fieldValue.toLowerCase().includes(value.toLowerCase()))) {
            return false
          }
        }
      }
      return true
    })
  }

  // note that in some scenarios `onFilter` is called with a random second arg
  // and sometimes with an explicit overwrite intent (e.g., true)
  onFilter(value, overwrite = false) {
    const activeFilters = overwrite === true ? value : Object.assign({}, this.state.activeFilters)
    if (overwrite !== true) {
      const filterValue = get(activeFilters, value.type)
      if (filterValue && activeFilters[value.type] === value.value) delete activeFilters[value.type]
      else activeFilters[value.type] = value.value
    }
    this.setState({ ...this.state, activeFilters })
    this.updateList({ transform: this.createTransform(this.state.activeSort, activeFilters) })
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

  checkFilter(filterType, id) {
    const { activeFilters } = this.state
    for (let filterId in activeFilters) {
      const filter = activeFilters[filterId]
      if (filterId === id && filter === filterType.value) return true
    }
    return false
  }

  collapseComponent(component) {
    this.onChangeComponent(component, { ...component, expanded: false })
  }

  expandComponent(component) {
    this.onChangeComponent(component, { ...component, expanded: true })
  }

  toggleCollapseExpandAll() {
    const { components } = this.props
    if (components.list.filter(component => component.expanded).length > 0) {
      components.list.forEach(component => component.expanded && this.collapseComponent(component))
    } else {
      components.list.forEach(component => !component.expanded && this.expandComponent(component))
    }
    this.incrementSequence()
  }

  getSelectedComponents() {
    const { components } = this.props
    const { selected } = this.state
    const selectedEntries = selected
      ? Object.entries(selected)
          .map(s => (s[1] ? parseInt(s[0]) : null))
          .filter(x => isNumber(x))
      : []
    const selectedComponents = components.transformedList.filter((_, i) => selectedEntries.includes(i))
    return { selectedEntries, selectedComponents }
  }

  async onChangeComponent(component, newComponent, field) {
    const { selectedEntries, selectedComponents } = this.getSelectedComponents()
    // contribute all the components
    if (
      multiEditableFields.includes(field) &&
      selectedEntries.length > 0 &&
      selectedComponents.find(selectedComponent => isEqual(selectedComponent, component))
    ) {
      const res = await this.showMultiSelectNotification(selectedComponents.length)
      if (res) {
        // Apply the same change to all the selected components
        this.setState({ currentDefinition: null, showFullDetail: false }, () => {
          this.incrementSequence()
          selectedComponents.map(selectedComponent =>
            this.updateList({
              update: selectedComponent,
              value: {
                ...selectedComponent,
                changes: { [field]: get(newComponent, ['changes', field]) }
              }
            })
          )
        })
      } else {
        this.setState({ currentDefinition: null, showFullDetail: false }, () => {
          this.incrementSequence()
          this.updateList({ update: component, value: newComponent })
        })
      }
    } else {
      this.setState({ currentDefinition: null, showFullDetail: false }, () => {
        this.incrementSequence()
        this.updateList({ update: component, value: newComponent })
      })
    }
  }

  async showMultiSelectNotification(length) {
    return new Promise(resolve => {
      const key = `open${Date.now()}`
      notification.open({
        message: 'Unsaved Changes',
        description: `You have ${length} definitions selected. Apply this change to all or just this definition?`,
        btn: (
          <NotificationButtons
            onClick={() => {
              notification.close(key)
              return resolve(true)
            }}
            onClose={() => {
              notification.close(key)
              return resolve(false)
            }}
            confirmText="Change all"
            dismissText="Change just this one"
          />
        ),
        key,
        onClose: () => {
          notification.close(key)
          return resolve(false)
        },
        duration: 0
      })
    })
  }

  handleLogin(e) {
    e.preventDefault()
    Auth.doLogin((token, permissions, username, publicEmails) => {
      this.props.dispatch(login(token, permissions, username, publicEmails))
    })
  }

  revertAll(store) {
    this.revert(null, 'Are you sure to revert all the unsaved changes from all the active definitions?', null, store)
  }

  revertDefinition(definition, value, store) {
    this.revert(
      definition,
      'Are you sure to revert all the unsaved changes from the selected definition?',
      value,
      store
    )
  }

  revert(definition, description, value, store) {
    const { dispatch } = this.props
    if (value) {
      dispatch(uiRevert(definition, value, store))
      this.incrementSequence()
      return
    }
    const key = `open${Date.now()}`
    notification.open({
      message: 'Confirm Revert?',
      description,
      btn: (
        <NotificationButtons
          onClick={() => {
            dispatch(uiRevert(definition, null, store))
            this.incrementSequence()
            notification.close(key)
          }}
          onClose={() => notification.close(key)}
          confirmButtonTestId="notification-revert-confirm"
          dismissButtonTestId="notification-revert-dismiss"
          confirmText="OK"
          dismissText="Cancel"
        />
      ),
      key,
      onClose: notification.close(key),
      duration: 0
    })
  }

  // Get an array of definitions asynchronous, split them into 100 chunks and alert the user when they're all done
  getDefinitionsAndNotify(definitions, message) {
    const { dispatch, token } = this.props
    const chunks = chunk(definitions, 100)
    Promise.all(chunks.map(throat(10, chunk => dispatch(getDefinitionsAction(token, chunk)))))
      .then(() => {
        uiInfo(dispatch, message)
        dispatch(checkForMissingDefinition(token, true))
      })
      .catch(() => uiDanger(dispatch, 'There was an issue retrieving components'))
  }

  getCurations(curations) {
    const { dispatch, token } = this.props
    const chunks = chunk(curations, 100)
    Promise.all(chunks.map(throat(10, chunk => dispatch(getCurationsAction(token, chunk)))))
  }

  refresh = () => {
    const { components } = this.props
    const refreshedData = this.state.removeContributedDefinitions
      ? components.list.filter(item => isEmpty(item.changes))
      : components.list.map(({ changes, ...keepAttrs }) => keepAttrs)
    if (this.hasChanges()) this.updateList({ updateAll: refreshedData })
    const definitions = this.buildSaveSpec(components.list)
    const definitionsToGet = definitions.map(definition => definition.toPath())
    const curationsToGet = definitions.map(definition => definition.toPath())
    this.getDefinitionsAndNotify(definitionsToGet, 'All components have been refreshed')
    this.getCurations(curationsToGet)
    this.setState({ removeContributedDefinitions: false })
  }

  updateList(_) {}

  buildSaveSpec(list) {
    return list.map(component => EntitySpec.fromObject(component))
  }
}
