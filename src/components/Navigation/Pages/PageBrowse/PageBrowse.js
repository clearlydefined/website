// Copyright (c) Microsoft Corporation and others. Licensed under the MIT license.
// SPDX-License-Identifier: MIT

import React from 'react'
import { connect } from 'react-redux'
import { Grid } from 'react-bootstrap'
import get from 'lodash/get'
import map from 'lodash/map'
import classNames from 'classnames'
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
import { licenses } from '../../../../utils/utils'

/**
 * Page that show to the user a list of interesting definitions to curate
 */
class PageBrowse extends SystemManagedList {
  constructor(props) {
    super(props)
    this.state = { activeProvider: 'npmjs' }
    this.onProviderSelection = this.onProviderSelection.bind(this)
    this.onFilter = this.onFilter.bind(this)
    this.onSort = this.onSort.bind(this)
    this.updateData = this.updateData.bind(this)
    this.renderFilterBar = this.renderFilterBar.bind(this)
    this.storeList = 'browse'
  }

  componentDidMount() {
    this.props.dispatch(uiNavigation({ to: ROUTE_BROWSE }))
    this.updateData()
  }

  noRowsRenderer(loading) {
    return loading ? <div /> : <div className="list-noRows">Broaden your filters to find more results</div>
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

  // Overrides the default onFilter method
  onFilter(filter, overwrite = false) {
    const activeFilters = overwrite === true ? filter : Object.assign({}, this.state.activeFilters)
    if (overwrite !== true) {
      const filterValue = get(activeFilters, filter.type)
      if (filterValue && activeFilters[filter.type] === filter.value) delete activeFilters[filter.type]
      else activeFilters[filter.type] = filter.value
    }
    this.setState({ ...this.state, activeFilters }, () => this.updateData())
  }

  // Overrides the default onSort method
  onSort(eventKey) {
    let activeSort = eventKey.value
    if (this.state.activeSort === activeSort) activeSort = null
    this.setState({ ...this.state, activeSort, sequence: this.state.sequence + 1 }, () => this.updateData())
  }

  renderFilterBar() {
    const sorts = [
      { value: 'license', label: 'License' },
      { value: 'name', label: 'Name' },
      { value: 'namespace', label: 'Namespace' },
      { value: 'releaseDate', label: 'Release Date' },
      { value: 'licensedScore', label: 'Licensed score' },
      { value: 'describedScore', label: 'Described score' }
    ]
    return (
      <FilterBar
        activeSort={this.state.activeSort}
        customSorts={sorts}
        activeFilters={this.state.activeFilters}
        onFilter={this.onFilter}
        onSort={this.onSort}
        hasComponents={false} // always false to keep filters activated
        showSourceFilter={false}
        showReleaseDateFilter={false}
        showCurateFilter={true}
        customLicenses={licenses.filter(license => license.value !== 'absence' && license.value !== 'presence')}
      />
    )
  }

  onProviderSelection(event) {
    const target = event.target
    const activeProvider = target.name
    this.setState({ ...this.state, activeProvider, activeFilters: null, activeSort: null }, () => this.updateData())
  }

  async updateData(continuationToken) {
    const { activeFilters, activeSort, activeProvider } = this.state
    const query = { provider: activeProvider }
    if (continuationToken) query.continuationToken = continuationToken
    if (activeSort) query.sort = activeSort
    map(activeFilters, (item, key) => {
      switch (key) {
        case 'curate':
          if (item === 'licensed') query.maxLicensedScore = 70
          if (item === 'described') query.maxDescribedScore = 70
          break
        case 'licensed.declared':
          query.license = item
          break
        default:
          break
      }
    })
    this.setState({ ...this.state, loading: true })
    const result = await this.props.dispatch(uiBrowseGet(this.props.token, query))
    this.setState({ ...this.state, loading: false })
    return result
  }

  loadMoreRows = async () => {
    const { components } = this.props
    if (components.data) return await this.updateData(components.data)
  }

  render() {
    const { components, definitions, session } = this.props
    const { sequence, showFullDetail, path, currentComponent, currentDefinition, activeProvider, loading } = this.state
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
            <div className={classNames('section-body', { loading })}>
              <i className="fas fa-spinner fa-spin" />
              <ComponentList
                readOnly={this.readOnly}
                list={components.transformedList}
                listLength={get(components, 'headers.pagination.totalCount') || components.list.length}
                listHeight={1000}
                loadMoreRows={this.loadMoreRows}
                onRemove={this.onRemoveComponent}
                onRevert={this.revertDefinition}
                onChange={this.onChangeComponent}
                onAddComponent={this.onAddComponent}
                onInspect={this.onInspect}
                renderFilterBar={this.renderFilterBar}
                definitions={definitions}
                noRowsRenderer={() => this.noRowsRenderer(loading)}
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
