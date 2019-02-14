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
    return <div className="placeholder-message">Fetching details on the components included in the pull request.</div>
  }

  tableTitle() {
    const { prNumber } = this.props
    const linkBack = this.props.url.isFetched ? <a href={this.props.url.item}>#{prNumber}</a> : `#${prNumber}`
    return <span>Definitions from pull request {linkBack}</span>
  }

  renderButtons() {
    return <ButtonsBar hasChanges={!this.hasChanges()} collapseAll={this.collapseAll} doSave={this.doSave} />
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
    const { components, definitions } = this.props
    const { sequence, showFullDetail, path, currentComponent, currentDefinition } = this.state
    return (
      <Grid className="main-container">
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
              readOnly={this.readOnly}
            />
          )}
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
    definitions: state.ui.contribution.definitions,
    components: state.ui.contribution.componentList,
    filterValue: state.ui.browse.filter,
    filterOptions: state.ui.browse.filterList
  }
}

export default connect(mapStateToProps)(PageContribution)
