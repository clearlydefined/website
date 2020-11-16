// Copyright (c) Microsoft Corporation and others. Licensed under the MIT license.
// SPDX-License-Identifier: MIT

import React from 'react'
import { connect } from 'react-redux'
import { Grid } from 'react-bootstrap'
import get from 'lodash/get'
import { uiContributionUpdateList, uiContributionGetData } from '../../../../actions/ui'
import { ROUTE_CURATIONS } from '../../../../utils/routingConstants'
import { uiNavigation } from '../../../../actions/ui'
import Section from '../../../Section'
import ComponentList from '../../../ComponentList'
import ButtonsBar from './ButtonsBar'
import FilterBar from '../../Sections/FilterBar'
import FullDetailPage from '../../../FullDetailView/FullDetailPage'
import SystemManagedList from '../../../SystemManagedList'

class PageContribution extends SystemManagedList {
  constructor(props) {
    super(props)
    this.renderFilterBar = this.renderFilterBar.bind(this)
  }
  componentDidMount() {
    const { dispatch, prNumber, token } = this.props
    dispatch(uiNavigation({ to: ROUTE_CURATIONS }))
    dispatch(uiContributionGetData(token, prNumber))
  }

  noRowsRenderer() {
    return <div className="placeholder-message">No open (unmerged) definitions found in this pull request</div>
  }

  tableTitle() {
    const { prNumber } = this.props
    const linkBack = this.props.url.isFetched ? (
      <a href={this.props.url.item} target="_blank" rel="noopener noreferrer">
        #{prNumber}
      </a>
    ) : (
        `#${prNumber}`
      )
    return <span>Open (unmerged) definitions from pull request {linkBack}</span>
  }

  renderButtons() {
    return <ButtonsBar toggleCollapseExpandAll={this.toggleCollapseExpandAll} />
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

  updateList(value) {
    return this.props.dispatch(uiContributionUpdateList(value))
  }

  render() {
    const { components, curations, definitions } = this.props
    const { sequence, showFullDetail, path, currentComponent, currentDefinition } = this.state
    return (
      <Grid className="main-container flex-column">
        <Section
          className="flex-grow-column"
          name={this.tableTitle()}
          actionButton={this.renderButtons()}
          titleCols={6}
          buttonCols={6}
        >
          <>
            <div className="section-body flex-grow">
              <ComponentList
                readOnly={this.readOnly}
                multiSelectEnabled={this.multiSelectEnabled}
                list={components.transformedList}
                listLength={get(components, 'headers.pagination.totalCount') || components.list.length}
                onRemove={this.onRemoveComponent}
                onRevert={this.revertDefinition}
                onChange={this.onChangeComponent}
                onAddComponent={this.onAddComponent}
                onInspect={this.onInspect}
                renderFilterBar={this.renderFilterBar}
                curations={curations}
                definitions={definitions}
                noRowsRenderer={this.noRowsRenderer}
                sequence={sequence}
                hasChange={this.hasChange}
                hideVersionSelector
              />
            </div>
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
          </>
        </Section>
      </Grid>
    )
  }
}

function mapStateToProps(state, ownProps) {
  return {
    token: state.session.token,
    session: state.session,
    prNumber: ownProps.location.pathname.slice(ownProps.match.url.length + 1),
    url: state.ui.contribution.url,
    curations: state.ui.curate.bodies,
    definitions: state.ui.contribution.definitions,
    components: state.ui.contribution.componentList,
    filterValue: state.ui.browse.filter,
    filterOptions: state.ui.browse.filterList
  }
}

export default connect(mapStateToProps)(PageContribution)
