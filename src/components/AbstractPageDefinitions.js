// Copyright (c) Microsoft Corporation and others. Licensed under the MIT license.
// SPDX-License-Identifier: MIT

import React, { Component, Fragment } from 'react'
import throat from 'throat'
import compact from 'lodash/compact'
import filter from 'lodash/filter'
import find from 'lodash/find'
import get from 'lodash/get'
import set from 'lodash/set'
import sortBy from 'lodash/sortBy'
import AntdButton from 'antd/lib/button'
import chunk from 'lodash/chunk'
import isEmpty from 'lodash/isEmpty'
import notification from 'antd/lib/notification'
import { curateAction } from '../actions/curationActions'
import { login } from '../actions/sessionActions'
import {
  uiBrowseUpdateFilterList,
  uiBrowseUpdateList,
  uiRevertDefinition,
  uiInfo,
  uiWarning,
  uiDanger
} from '../actions/ui'
import EntitySpec from '../utils/entitySpec'
import Definition from '../utils/definition'
import Auth from '../utils/auth'
import VersionSelector from './Navigation/Ui/VersionSelector'
import NotificationButtons from './Navigation/Ui/NotificationButtons'
import { getDefinitionsAction } from '../actions/definitionActions'
import { saveAs } from 'file-saver'
import trim from 'lodash/trim'
import { ROUTE_CURATIONS, ROUTE_SHARE } from '../utils/routingConstants'
import { getCurationAction } from '../actions/curationActions'
import { asObject } from '../utils/utils'
import { getGist, saveGist } from '../api/github'
import base64js from 'base64-js'
import pako from 'pako'

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
    this.transform = this.transform.bind(this)
    this.onRemoveAll = this.onRemoveAll.bind(this)
    this.collapseAll = this.collapseAll.bind(this)
    this.renderSavePopup = this.renderSavePopup.bind(this)
    this.renderVersionSelectopPopup = this.renderVersionSelectopPopup.bind(this)
    this.showVersionSelectorPopup = this.showVersionSelectorPopup.bind(this)
    this.applySelectedVersions = this.applySelectedVersions.bind(this)
    this.contributeModal = React.createRef()
  }

  getDefinition(component) {
    return this.props.definitions.entries[EntitySpec.fromCoordinates(component).toPath()]
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
   * @param  {} contributionInfo object that describes the contribution
   */
  doContribute(contributionInfo) {
    const { dispatch, token, components } = this.props
    const patches = this.buildContributeSpec(components.list)
    const spec = { contributionInfo, patches }
    dispatch(curateAction(token, spec))
    this.refresh(contributionInfo.removeDefinitions)
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

  collapseAll() {
    const { components } = this.props
    components.list.forEach(component => component.expanded && this.collapseComponent(component))
    this.incrementSequence()
  }

  handleLogin(e) {
    e.preventDefault()
    Auth.doLogin((token, permissions, username) => {
      this.props.dispatch(login(token, permissions, username))
    })
  }

  updateList(o) {
    return uiBrowseUpdateList(o)
  }

  showVersionSelectorPopup(component, multiple) {
    this.setState({ showVersionSelectorPopup: true, multipleVersionSelection: multiple, selectedComponent: component })
  }

  applySelectedVersions(versions) {
    const { multipleVersionSelection, selectedComponent } = this.state
    if (!multipleVersionSelection) {
      return this.setState({ showVersionSelectorPopup: false }, async () => {
        if (selectedComponent.changes) {
          const key = `open${Date.now()}`
          notification.open({
            message: 'This definition has some changes. All the unsaved changes will be lost.',
            btn: (
              <NotificationButtons
                onClick={async () => {
                  await this.onRemoveComponent(selectedComponent)
                  await this.onAddComponent(
                    EntitySpec.fromCoordinates({ ...selectedComponent, revision: versions, changes: {} })
                  )
                  notification.close(key)
                }}
                onClose={() => notification.close(key)}
                confirmText="Ok"
                dismissText="Cancel"
              />
            ),
            key,
            onClose: notification.close(key),
            duration: 0
          })
        } else {
          await this.onRemoveComponent(selectedComponent)
          await this.onAddComponent(EntitySpec.fromCoordinates({ ...selectedComponent, revision: versions }))
        }
      })
    }
    this.setState({ showVersionSelectorPopup: false }, () =>
      versions.map(version =>
        this.onAddComponent(EntitySpec.fromCoordinates({ ...selectedComponent, revision: version }))
      )
    )
  }

  renderVersionSelectopPopup() {
    const { multipleVersionSelection, selectedComponent, showVersionSelectorPopup } = this.state
    return showVersionSelectorPopup ? (
      <VersionSelector
        show={showVersionSelectorPopup}
        onClose={() => this.setState({ showVersionSelectorPopup: false, selectedComponent: null })}
        onSave={this.applySelectedVersions}
        multiple={multipleVersionSelection}
        component={selectedComponent}
      />
    ) : null
  }

  // Get an array of definitions asynchronous, split them into 100 chunks and alert the user when they're all done
  getDefinitionsAndNotify(definitions, message) {
    const { dispatch, token, getDefinitionsAction } = this.props
    const chunks = chunk(definitions, 100)
    Promise.all(chunks.map(throat(10, chunk => dispatch(getDefinitionsAction(token, chunk)))))
      .then(() => uiInfo(dispatch, message))
      .catch(() => uiDanger(dispatch, 'There was an issue retrieving components'))
  }

  refresh = removeDefinitions => {
    const { components, dispatch } = this.props
    const refreshedData = removeDefinitions
      ? components.list.filter(item => isEmpty(item.changes))
      : components.list.map(({ changes, ...keepAttrs }) => keepAttrs)
    if (this.hasChanges()) {
      dispatch(
        uiBrowseUpdateList({
          updateAll: refreshedData
        })
      )
    }

    const definitions = this.buildSaveSpec(components.list)
    const definitionsToGet = definitions.map(definition => definition.toPath())
    this.getDefinitionsAndNotify(definitionsToGet, 'All components have been refreshed')
  }

  revertAll() {
    this.revert(null, 'Are you sure to revert all the unsaved changes from all the active definitions?')
  }

  revertDefinition(definition, value) {
    this.revert(definition, 'Are you sure to revert all the unsaved changes from the selected definition?', value)
  }

  revert(definition, description, value) {
    const { dispatch } = this.props
    if (value) {
      dispatch(uiRevertDefinition(definition, value))
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
            dispatch(uiRevertDefinition(definition))
            this.incrementSequence()
            notification.close(key)
          }}
          onClose={() => notification.close(key)}
          confirmText="Revert"
          dismissText="Dismiss"
        />
      ),
      key,
      onClose: notification.close(key),
      duration: 0
    })
  }

  doSave() {
    const { components } = this.props
    const spec = this.buildSaveSpec(components.list)
    this.saveSpec(spec)
    this.setState({ showSavePopup: false, fileName: null })
  }

  async saveSpec(spec) {
    const { dispatch } = this.props
    try {
      const fileObject = { filter: this.state.activeFilters, sortBy: this.state.activeSort, coordinates: spec }
      if (this.state.saveType === 'gist') await this.createGist(this.state.fileName, fileObject)
      else {
        const file = new File([JSON.stringify(fileObject, null, 2)], `${this.state.fileName}.json`)
        saveAs(file)
      }
    } catch (error) {
      if (error.status === 404)
        return uiWarning(dispatch, "Could not create Gist. Likely you've not given us permission")
      uiWarning(dispatch, error.message)
    }
  }

  async createGist(name, content) {
    const { token, dispatch } = this.props
    const url = await saveGist(token, `${name}.json`, JSON.stringify(content))
    const message = (
      <div>
        A new Gist File has been created and is available{' '}
        <a href={url} target="_blank" rel="noopener noreferrer">
          here
        </a>
      </div>
    )
    return uiInfo(dispatch, message)
  }

  doSaveAsUrl() {
    const { components } = this.props
    const spec = this.buildSaveSpec(components.list)
    const fileObject = { filter: this.state.activeFilters, sortBy: this.state.activeSort, coordinates: spec }
    const url = `${document.location.origin}${ROUTE_SHARE}/${base64js.fromByteArray(
      pako.deflate(JSON.stringify(fileObject))
    )}`
    this.copyToClipboard(url, 'URL copied to clipboard')
  }

  copyToClipboard(text, message) {
    const textArea = document.createElement('textarea')
    textArea.value = text
    document.body.appendChild(textArea)
    textArea.focus()
    textArea.select()
    document.execCommand('copy')
    document.body.removeChild(textArea)
    uiInfo(this.props.dispatch, message)
  }

  onDragOver = e => e.preventDefault()
  onDragEnter = e => e.preventDefault()

  onDrop = async e => {
    e.preventDefault()
    e.persist()
    try {
      if ((await this.handleTextDrop(e)) !== false) return
      if (this.handleDropFiles(e) !== false) return
      uiWarning(this.props.dispatch, 'ClearlyDefined does not understand whatever it is you just dropped')
    } catch (error) {
      uiWarning(this.props.dispatch, error.message)
    }
  }

  handleTextDrop = async event => {
    const text = event.dataTransfer.getData('Text')
    if (!text) return false
    if (this.handleDropObject(text) !== false) return
    if ((await this.handleDropGist(text)) !== false) return
    if (this.handleDropEntityUrl(text) !== false) return
    if (this.handleDropPrURL(text) !== false) return
    return false
  }

  // handle dropping a URL to an npm, github repo/release, nuget package, ...
  handleDropEntityUrl(content) {
    const spec = EntitySpec.fromUrl(content)
    if (!spec) return false
    this.onAddComponent(spec)
  }

  // dropping an actual definition, an object that has `coordinates`
  handleDropObject(content) {
    const contentObject = asObject(content)
    if (!contentObject) return false
    this.onAddComponent(EntitySpec.fromCoordinates(contentObject))
  }

  // handle dropping a url pointing to a curation PR
  handleDropPrURL(urlSpec) {
    try {
      const url = new URL(trim(urlSpec, '/'))
      if (url.hostname !== 'github.com') return false
      const [, org, , type, number] = url.pathname.split('/')
      if (org !== 'clearlydefined' || type !== 'pull') return false
      this.props.history.push(`${ROUTE_CURATIONS}/${number}`)
    } catch (exception) {
      return false
    }
  }

  // handle dropping a url to a Gist that contains a ClearlyDefined coordinate list
  async handleDropGist(urlString) {
    if (!urlString.startsWith('https://gist.github.com')) return false
    uiInfo(this.props.dispatch, 'Loading component list from gist')
    const url = new URL(urlString)
    const [, , id] = url.pathname.split('/')
    if (!id) throw new Error(`Gist url ${url} is malformed`)
    const content = await getGist(id)
    if (!content || !Object.keys(content).length) throw new Error(`Gist at ${url} could not be loaded or was empty`)
    for (let name in content) this.loadComponentList(content[name], name)
  }

  handleDropFiles(event) {
    const files = Object.values(event.dataTransfer.files)
    if (!files || !files.length) return false
    const { acceptedFiles, rejectedFiles } = this.sortDroppedFiles(files)
    if (acceptedFiles.length) this.handleDropAcceptedFiles(acceptedFiles)
    if (rejectedFiles.length) this.handleDropRejectedFiles(rejectedFiles)
  }

  sortDroppedFiles(files) {
    const acceptedFilesValues = ['application/json']
    return files.reduce(
      (result, file) => {
        if (acceptedFilesValues.includes(file.type)) result.acceptedFiles.push(file)
        else result.rejectedFiles.push(file)
        return result
      },
      { acceptedFiles: [], rejectedFiles: [] }
    )
  }

  handleDropAcceptedFiles(files) {
    uiInfo(this.props.dispatch, 'Loading component list from file(s)')
    files.forEach(file => {
      const reader = new FileReader()
      reader.onload = () => this.loadComponentList(reader.result, file.name)
      reader.readAsBinaryString(file)
    })
  }

  handleDropRejectedFiles = files => {
    const fileNames = files.map(file => file.name).join(', ')
    uiWarning(this.props.dispatch, `Could not load: ${fileNames}`)
  }

  onAddComponent(value) {
    const { dispatch, token, definitions } = this.props
    const component = typeof value === 'string' ? EntitySpec.fromPath(value) : value
    const path = component.toPath()
    if (!component.revision) return uiWarning(dispatch, `${path} needs version information`)

    !definitions.entries[path] &&
      dispatch(getDefinitionsAction(token, [path])) &&
      dispatch(getCurationAction(token, component))
    dispatch(uiBrowseUpdateList({ add: component }))
  }

  dropZone(child) {
    return (
      <div
        onDragOver={this.onDragOver}
        onDragEnter={this.onDragEnter}
        onDrop={this.onDrop}
        style={{ position: 'relative' }}
      >
        {child}
      </div>
    )
  }

  loadComponentList(content, name) {
    const list = this.getList(content)
    if (!list) return uiWarning(this.props.dispatch, `Invalid component list file: ${name}`)
    this.loadFromListSpec(list)
  }

  getList(content) {
    const object = typeof content === 'string' ? JSON.parse(content) : content
    if (this.isPackageLock(object)) return this.getListFromPackageLock(object.dependencies)
    if (this.isClearlyDefinedList(object)) return object
    return null
  }

  isPackageLock(content) {
    // TODO better, more definitive test here
    return !!content.dependencies
  }

  isClearlyDefinedList(content) {
    // TODO better, more definitive test here
    return !!content.coordinates
  }

  getListFromPackageLock(dependencies) {
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

  loadFromListSpec(list) {
    const { dispatch, definitions } = this.props
    if (list.filter) this.setState({ activeFilters: list.filter })
    if (list.sortBy) this.setState({ activeSort: list.sortBy })
    if (list.sortBy || list.filter) this.setState({ sequence: this.state.sequence + 1 })

    const toAdd = list.coordinates.map(component => EntitySpec.validateAndCreate(component)).filter(e => e)
    dispatch(uiBrowseUpdateList({ addAll: toAdd }))
    const missingDefinitions = toAdd.map(spec => spec.toPath()).filter(path => !definitions.entries[path])
    this.getDefinitionsAndNotify(missingDefinitions, 'All components have been loaded')
    dispatch(
      uiBrowseUpdateList({
        transform: this.createTransform.call(
          this,
          list.sortBy || this.state.activeSort,
          list.filter || this.state.activeFilters
        )
      })
    )
  }
}
