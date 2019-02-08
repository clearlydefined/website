// Copyright (c) Microsoft Corporation and others. Licensed under the MIT license.
// SPDX-License-Identifier: MIT

import React from 'react'
import { connect } from 'react-redux'
import pako from 'pako'
import { Grid, Tooltip } from 'react-bootstrap'
import base64js from 'base64-js'
import notification from 'antd/lib/notification'
import get from 'lodash/get'
import { uiNavigation, uiWarning } from '../../../../actions/ui'
import { ROUTE_DEFINITIONS } from '../../../../utils/routingConstants'
import NotificationButtons from '../../Ui/NotificationButtons'
import SearchBar from '../../Ui/SearchBar'
import { ComponentList, Section, ContributePrompt } from '../../../'
import FullDetailPage from '../../../FullDetailView/FullDetailPage'
import DropComponent from '../../Ui/DropComponent'
import FilterBar from '../../Sections/FilterBar'
import VersionSelector from '../../Ui/VersionSelector'
import ButtonsBar from './ButtonsBar'
import UserManagedList from '../../../UserManagedList'
import SavePopUp from '../../Ui/SavePopUp'

export class PageDefinitions extends UserManagedList {
  constructor(props) {
    super(props)
    this.onAddComponent = this.onAddComponent.bind(this)
    this.doSave = this.doSave.bind(this)
    this.doSaveAsUrl = this.doSaveAsUrl.bind(this)
    this.revertAll = this.revertAll.bind(this)
    this.revertDefinition = this.revertDefinition.bind(this)
    this.renderVersionSelectopPopup = this.renderVersionSelectopPopup.bind(this)
    this.renderFilterBar = this.renderFilterBar.bind(this)
    this.storeList = 'browse'
  }

  componentDidMount() {
    const { dispatch, path } = this.props
    if (path.length > 1) {
      try {
        const definitionSpec = pako.inflate(base64js.toByteArray(path), { to: 'string' })
        this.loadFromListSpec(JSON.parse(definitionSpec))
      } catch (e) {
        uiWarning(dispatch, 'Loading components from URL failed')
      }
    }
    dispatch(uiNavigation({ to: ROUTE_DEFINITIONS }))
  }

  tableTitle() {
    return 'Available definitions'
  }

  doRefreshAll = () => {
    if (this.hasChanges()) {
      const key = `open${Date.now()}`
      notification.open({
        message: 'Unsaved Changes',
        description: 'Some information has been changed and is currently unsaved. Are you sure to continue?',
        btn: (
          <NotificationButtons
            onClick={() => {
              this.refresh()
              notification.close(key)
            }}
            onClose={() => notification.close(key)}
            confirmText="Refresh"
            dismissText="Dismiss"
          />
        ),
        key,
        onClose: notification.close(key),
        duration: 0
      })
    } else {
      this.refresh()
    }
  }

  tooltip(text) {
    return <Tooltip id="tooltip">{text}</Tooltip>
  }

  renderButtons() {
    return (
      <ButtonsBar
        components={this.props.components}
        hasChanges={!this.hasChanges()}
        revertAll={this.revertAll}
        doRefreshAll={this.doRefreshAll}
        collapseAll={this.collapseAll}
        onRemoveAll={this.onRemoveAll}
        doPromptContribute={this.doPromptContribute}
        shareUrl={this.doSaveAsUrl}
        shareFile={() => this.setState({ showSavePopup: true, saveType: 'file' })}
        shareNotice={() => this.setState({ showSavePopup: true, saveType: 'notice' })}
        shareGist={() => this.setState({ showSavePopup: true, saveType: 'gist' })}
      />
    )
  }

  renderFilterBar() {
    return (
      <FilterBar
        activeSort={this.state.activeSort}
        activeFilters={this.state.activeFilters}
        onFilter={this.onFilter}
        onSort={this.onSort}
        hasComponents={!this.hasComponents()}
      />
    )
  }

  noRowsRenderer() {
    return (
      <div className="list-noRows">
        <div>
          <p>Search for components in the above search bar or drag and drop...</p>
          <ul>
            <li>the URL for a component version/commit from nuget.org, github.com, npmjs.com, ... </li>
            <li>
              the URL for curation PR from{' '}
              <a href="https://github.com/clearlydefined/curated-data">
                https://github.com/clearlydefined/curated-data
              </a>
              , ...{' '}
            </li>
            <li>a saved ClearlyDefined component list, package-lock.json, project-log.json, ... </li>
          </ul>
        </div>
      </div>
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

  render() {
    const { components, definitions, session, filterOptions } = this.props
    const { sequence, showFullDetail, path, currentComponent, currentDefinition } = this.state
    return (
      <Grid className="main-container">
        <ContributePrompt
          ref={this.contributeModal}
          session={session}
          onLogin={this.handleLogin}
          actionHandler={this.doContribute}
        />
        <SearchBar filterOptions={filterOptions} onChange={this.onAddComponent} onSearch={this.onSearch} />
        <Section name={this.tableTitle()} actionButton={this.renderButtons()}>
          {
            <DropComponent onLoad={this.loadComponentList} onAddComponent={this.onAddComponent}>
              <div className="section-body">
                <ComponentList
                  readOnly={this.readOnly}
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
                  showVersionSelectorPopup={this.showVersionSelectorPopup}
                />
              </div>
            </DropComponent>
          }
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
            readOnly={this.readOnly}
          />
        )}
        <SavePopUp
          show={this.state.showSavePopup}
          type={this.state.saveType}
          onHide={() => this.setState({ showSavePopup: false })}
          onOK={options => this.setState({ options }, this.doSave)}
        />
        {this.renderVersionSelectopPopup()}
      </Grid>
    )
  }
}

function mapStateToProps(state, ownProps) {
  return {
    token: state.session.token,
    filterValue: state.ui.definitions.filter,
    path: ownProps.location.pathname.slice(ownProps.match.url.length + 1),
    filterOptions: state.ui.definitions.filterList,
    components: state.ui.definitions.componentList,
    definitions: state.definition.bodies,
    session: state.session
  }
}
export default connect(mapStateToProps)(PageDefinitions)
