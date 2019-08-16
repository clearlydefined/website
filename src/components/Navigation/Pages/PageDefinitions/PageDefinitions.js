// Copyright (c) Microsoft Corporation and others. Licensed under the MIT license.
// SPDX-License-Identifier: MIT

import React from 'react'
import { connect } from 'react-redux'
import { Grid, Tooltip } from 'react-bootstrap'
import notification from 'antd/lib/notification'
import get from 'lodash/get'
import { uiDefinitionsUpdateList, uiNavigation, uiWarning } from '../../../../actions/ui'
import { ROUTE_WORKSPACE } from '../../../../utils/routingConstants'
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
import UrlShare from '../../../../utils/urlShare'

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
  }

  componentDidMount() {
    const { dispatch, path } = this.props
    if (path.length > 1) {
      try {
        const urlShare = new UrlShare()
        urlShare.start()
        const definitionSpec = urlShare.decode(path)
        this.loadFromListSpec(definitionSpec)
      } catch (e) {
        uiWarning(dispatch, 'Loading components from URL failed')
      }
    }
    dispatch(uiNavigation({ to: ROUTE_WORKSPACE }))
  }

  componentWillReceiveProps(nextProps) {
    if (
      JSON.stringify(nextProps.curationStatus) !== JSON.stringify(this.props.curationStatus) &&
      !nextProps.curationStatus.isFetching &&
      !nextProps.curationStatus.error
    ) {
      this.refresh()
    }
  }

  tableTitle() {
    return 'Workspace'
  }

  doRefreshAll = () => {
    if (this.hasChanges()) {
      const key = `open${Date.now()}`
      notification.open({
        message: 'Unsaved Changes',
        description: 'Some information has been changed and is currently unsaved. Are you sure you want to continue?',
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
        toggleCollapseExpandAll={this.toggleCollapseExpandAll}
        onRemoveAll={this.onRemoveAll}
        doPromptContribute={this.doPromptContribute}
        shareUrl={this.doSaveAsUrl}
        shareFile={() => this.setState({ showSavePopup: true, saveType: 'file' })}
        shareNotice={() => this.setState({ showSavePopup: true, saveType: 'notice' })}
      />
    )
  }

  renderFilterBar() {
    const { activeFilters, activeSort, selected } = this.state
    return (
      <FilterBar
        components={this.props.components.list}
        multiSelectEnabled={this.multiSelectEnabled}
        onSelectAll={this.onSelectAll}
        selected={selected}
        activeSort={activeSort}
        activeFilters={activeFilters}
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
          <p>Build your own workspace of components by searching for them in above or drag and drop a...</p>
          <ul>
            <li>URL for a component version/commit from nuget.org, github.com, npmjs.com, ... </li>
            <li>
              URL for curation PR from{' '}
              <a href="https://github.com/clearlydefined/curated-data">
                https://github.com/clearlydefined/curated-data
              </a>
              , ...{' '}
            </li>
            <li>package manager list like package-lock.json, project-log.json, ... </li>
            <li>workspace shared using the "Share" feature in ClearlyDefined </li>
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

  updateList(value) {
    return this.props.dispatch(uiDefinitionsUpdateList(value))
  }

  render() {
    const { components, curations, definitions, session, filterOptions } = this.props
    const {
      currentComponent,
      currentDefinition,
      path,
      saveType,
      selected,
      sequence,
      showFullDetail,
      showSavePopup
    } = this.state

    return (
      <Grid className="main-container flex-column">
        <ContributePrompt
          ref={this.contributeModal}
          session={session}
          onLogin={this.handleLogin}
          actionHandler={this.doContribute}
          definitions={this.getDefinitionsWithChanges()}
        />
        <SearchBar filterOptions={filterOptions} onChange={this.onAddComponent} onSearch={this.onSearch} />
        <Section className="flex-grow-column" name={this.tableTitle()} actionButton={this.renderButtons()}>
          <DropComponent
            className="section-body flex-grow"
            onLoad={this.loadComponentList}
            onAddComponent={this.onAddComponent}
          >
            <ComponentList
              readOnly={this.readOnly}
              onAddComponent={this.onAddComponent}
              multiSelectEnabled={this.multiSelectEnabled}
              list={components.transformedList}
              listLength={get(components, 'headers.pagination.totalCount') || components.list.length}
              onRemove={this.onRemoveComponent}
              onRevert={this.revertDefinition}
              onChange={this.onChangeComponent}
              selected={selected}
              onSelectAll={this.onSelectAll}
              toggleCheckbox={this.toggleSelectAllCheckbox}
              onInspect={this.onInspect}
              renderFilterBar={this.renderFilterBar}
              curations={curations}
              definitions={definitions}
              noRowsRenderer={this.noRowsRenderer}
              sequence={sequence}
              hasChange={this.hasChange}
              showVersionSelectorPopup={this.showVersionSelectorPopup}
            />
          </DropComponent>
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
        {showSavePopup && (
          <SavePopUp
            show={showSavePopup}
            type={saveType}
            onHide={() => this.setState({ showSavePopup: false })}
            onOK={options => this.setState({ options }, this.doSave)}
          />
        )}
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
    curations: state.ui.curate.bodies,
    curationStatus: state.ui.curate.status,
    definitions: state.definition.bodies,
    session: state.session
  }
}
export default connect(mapStateToProps)(PageDefinitions)
