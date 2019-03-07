// Copyright (c) Microsoft Corporation and others. Licensed under the MIT license.
// SPDX-License-Identifier: MIT

import React from 'react'
import { connect } from 'react-redux'
import { Grid, FormControl } from 'react-bootstrap'
import get from 'lodash/get'
import debounce from 'lodash/debounce'
import classNames from 'classnames'
import { ROUTE_BROWSE } from '../../../../utils/routingConstants'
import { getCurationsAction } from '../../../../actions/curationActions'
import { uiBrowseUpdateList, uiNavigation, uiBrowseGet } from '../../../../actions/ui'
import SystemManagedList from '../../../SystemManagedList'
import Section from '../../../Section'
import ComponentList from '../../../ComponentList'
import ButtonsBar from './ButtonsBar'
import FullDetailPage from '../../../FullDetailView/FullDetailPage'
import FilterList from '../../Ui/FilterList'
import SortList from '../../Ui/SortList'
import ContributePrompt from '../../../ContributePrompt'
import { licenses, curateFilters } from '../../../../utils/utils'

/**
 * Page that show to the user a list of interesting definitions to curate
 */
class PageBrowse extends SystemManagedList {
  constructor(props) {
    super(props)
    this.state = {}
    this.onFilter = this.onFilter.bind(this)
    this.onSort = this.onSort.bind(this)
    this.updateData = this.updateData.bind(this)
    this.renderFilterBar = this.renderFilterBar.bind(this)
    this.nameFilter = null
  }

  componentDidMount() {
    this.props.dispatch(uiNavigation({ to: ROUTE_BROWSE }))
    this.updateData()
  }

  noRowsRenderer(isFetching) {
    return isFetching ? <div /> : <div className="list-noRows">Broaden your filters to find more results</div>
  }

  tableTitle() {
    return (
      <div>
        <span>Browse Definitions</span>
        <FormControl
          placeholder="Name"
          aria-label="Name"
          inputRef={input => (this.nameFilter = input)}
          onChange={debounce(() => this.updateData(), 500)}
        />
      </div>
    )
  }

  renderButtons() {
    return (
      <ButtonsBar
        hasChanges={!this.hasChanges()}
        revertAll={this.revertAll}
        collapseAll={this.collapseAll}
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
      { value: 'releaseDate-desc', label: 'Newer' },
      { value: 'releaseDate', label: 'Older' },
      { value: 'score-desc', label: 'Higher Score' },
      { value: 'score', label: 'Lower Score' }
    ]

    const providers = [
      { value: 'cratesio', label: 'Crates.io' },
      { value: 'github', label: 'GitHub' },
      { value: 'mavencentral', label: 'MavenCentral' },
      { value: 'npmjs', label: 'NpmJS' },
      { value: 'nuget', label: 'NuGet' },
      { value: 'pypi', label: 'PyPi' },
      { value: 'rubygems', label: 'RubyGems' }
    ]

    return (
      <div className="filter-list" align="right">
        <SortList list={sorts} title={'Sort By'} id={'sort'} value={this.state.activeSort} onSort={this.onSort} />
        {this.renderFilter(providers, 'Provider', 'provider')}
        {this.renderFilter(
          licenses.filter(license => license.value !== 'absence' && license.value !== 'presence'),
          'License',
          'license'
        )}
        {this.renderFilter(curateFilters, 'Curate', 'curate')}
      </div>
    )
  }

  renderFilter(list, title, id) {
    return <FilterList list={list} title={title} id={id} value={this.state.activeFilters} onFilter={this.onFilter} />
  }

  async updateData(continuationToken) {
    const { activeFilters, activeSort } = this.state
    const activeName = get(this.nameFilter, 'value')
    const query = Object.assign({}, activeFilters)
    if (continuationToken) query.continuationToken = continuationToken
    if (activeSort) query.sort = activeSort
    switch (activeSort) {
      case 'releaseDate-desc':
        query.sort = 'releaseDate'
        query.sortDesc = true
        break
      case 'score-desc':
        query.sort = 'score'
        query.sortDesc = true
        break
      default:
        break
    }
    if (query.curate === 'licensed') query.maxLicensedScore = 70
    if (query.curate === 'described') query.maxDescribedScore = 70
    if (query.curate) delete query.curate
    if (activeName) {
      if (activeName.indexOf('/') > 0) {
        query.namespace = activeName.split('/')[0]
        query.name = activeName.split('/')[1]
      } else query.name = activeName
    }
    await this.props.dispatch(uiBrowseGet(this.props.token, query))
    if (this.props.definitions.entries)
      this.props.dispatch(getCurationsAction(this.props.token, Object.keys(this.props.definitions.entries)))
  }

  loadMoreRows = async () => {
    const { components } = this.props
    if (components.data) return await this.updateData(components.data)
  }

  updateList(value) {
    return this.props.dispatch(uiBrowseUpdateList(value))
  }

  render() {
    const { components, curations, definitions, session } = this.props
    const { sequence, showFullDetail, path, currentComponent, currentDefinition } = this.state
    return (
      <Grid className="main-container">
        <ContributePrompt
          ref={this.contributeModal}
          session={session}
          onLogin={this.handleLogin}
          actionHandler={this.doContribute}
        />
        <Section name={this.tableTitle()} actionButton={this.renderButtons()}>
          {
            <div className={classNames('section-body', { loading: components.isFetching })}>
              <i className="fas fa-spinner fa-spin" />
              <ComponentList
                readOnly={false}
                list={components.transformedList}
                listLength={get(components, 'headers.pagination.totalCount') || components.list.length}
                listHeight={600}
                loadMoreRows={this.loadMoreRows}
                onRemove={this.onRemoveComponent}
                onRevert={this.revertDefinition}
                onChange={this.onChangeComponent}
                onAddComponent={this.onAddComponent}
                onInspect={this.onInspect}
                renderFilterBar={this.renderFilterBar}
                curations={curations}
                definitions={definitions}
                noRowsRenderer={() => this.noRowsRenderer(components.isFetching)}
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
    curations: state.ui.curate.bodies,
    definitions: state.definition.bodies,
    components: state.ui.browse.componentList
  }
}

export default connect(mapStateToProps)(PageBrowse)
