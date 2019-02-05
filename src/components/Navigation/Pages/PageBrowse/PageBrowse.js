// Copyright (c) Microsoft Corporation and others. Licensed under the MIT license.
// SPDX-License-Identifier: MIT

import React from 'react'
import { connect } from 'react-redux'
import { Grid } from 'react-bootstrap'
import get from 'lodash/get'
import { ROUTE_BROWSE } from '../../../../utils/routingConstants'
import { uiNavigation, uiBrowseGet } from '../../../../actions/ui'
import SystemManagedList from '../../../SystemManagedList'
import Section from '../../../Section'
import ComponentList from '../../../ComponentList'
import ButtonsBar from './ButtonsBar'
import FilterBar from '../../Sections/FilterBar'
import FullDetailPage from '../../../FullDetailView/FullDetailPage'
import ProviderButtons from '../../Ui/ProviderButtons'
import ContributePrompt from '../../../ContributePrompt'

/**
 * Page that show to the user a list of interesting definitions to curate
 */
class PageBrowse extends SystemManagedList {
  constructor(props) {
    super(props)
    this.state = { activeProvider: 'github' }
    this.onProviderSelection = this.onProviderSelection.bind(this)
    this.renderFilterBar = this.renderFilterBar.bind(this)
    this.storeList = 'browse'
  }

  componentDidMount() {
    this.props.dispatch(uiNavigation({ to: ROUTE_BROWSE }))
  }

  noRowsRenderer() {
    return (
      <div className="list-noRows">Select a Provider to retrieve a list of definitions that need to be curated</div>
    )
  }

  tableTitle() {
    return <span>Browse Definitions</span>
  }

  renderButtons() {
    return (
      <ButtonsBar
        hasChanges={!this.hasChanges()}
        revertAll={this.revertAll}
        doRefreshAll={this.doRefreshAll}
        collapseAll={this.collapseAll}
        onRemoveAll={this.onRemoveAll}
        doPromptContribute={this.doPromptContribute}
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

  onProviderSelection(event) {
    const target = event.target
    const activeProvider = target.name
    this.setState({ ...this.state, activeProvider })
    this.props.dispatch(uiBrowseGet(this.props.token, { type: activeProvider }))
  }

  render() {
    const { components, definitions, session } = this.props
    const { sequence, showFullDetail, path, currentComponent, currentDefinition, activeProvider } = this.state
    return (
      <Grid className="main-container">
        <ContributePrompt
          ref={this.contributeModal}
          session={session}
          onLogin={this.handleLogin}
          actionHandler={this.doContribute}
        />
        <ProviderButtons onClick={this.onProviderSelection} activeProvider={activeProvider} />
        <Section name={this.tableTitle()} actionButton={this.renderButtons()}>
          {
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
                hideVersionSelector
              />
            </div>
          }
          {currentDefinition && (
            <FullDetailPage
              modalView
              visible={showFullDetail}
              onClose={this.onInspectClose}
              onSave={this.onChangeComponent}
              path={path}
              currentDefinition={currentDefinition}
              component={currentComponent}
              readOnly={false}
            />
          )}
        </Section>
      </Grid>
    )
  }
}

function mapStateToProps(state) {
  return {
    token: state.session.token,
    session: state.session,
    definitions: state.definition.bodies,
    components: state.ui.browse.componentList
  }
}

export default connect(mapStateToProps)(PageBrowse)
