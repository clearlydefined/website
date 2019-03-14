// Copyright (c) Microsoft Corporation and others. Licensed under the MIT license.
// SPDX-License-Identifier: MIT

import React from 'react'
import { connect } from 'react-redux'
import { Row, Col, Grid, Button } from 'react-bootstrap'
import get from 'lodash/get'
import has from 'lodash/has'
import uniq from 'lodash/uniq'
import classNames from 'classnames'
import { ROUTE_ROOT } from '../../../../utils/routingConstants'
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
import { curateFilters } from '../../../../utils/utils'
import SpdxPicker from '../../../SpdxPicker'
import FilterBar from '../../../FilterBar'
import EntitySpec from '../../../../utils/entitySpec'

/**
 * Page that show to the user a list of interesting definitions to curate
 */
class PageBrowse extends SystemManagedList {
  constructor(props) {
    super(props)
    this.onFilter = this.onFilter.bind(this)
    this.onClearSearch = this.onClearSearch.bind(this)
    this.onSort = this.onSort.bind(this)
    this.updateData = this.updateData.bind(this)
    this.renderFilterBar = this.renderFilterBar.bind(this)
    this.nameFilter = null
  }

  componentDidMount() {
    this.props.dispatch(uiNavigation({ to: ROUTE_ROOT }))
    this.updateData()
  }

  noRowsRenderer(isFetching) {
    return isFetching ? <div /> : <div className="list-noRows">Broaden your filters to find more results</div>
  }

  onBrowse = value => {
    this.nameFilter = { value }
    this.updateData()
  }

  tableTitle() {
    return 'Browse'
  }

  renderTopFilters() {
    const providers = [
      { value: 'cocoapods', label: 'CocoaPods' },
      { value: 'cratesio', label: 'Crates.io' },
      { value: 'github', label: 'GitHub' },
      { value: 'mavencentral', label: 'MavenCentral' },
      { value: 'npmjs', label: 'NpmJS' },
      { value: 'nuget', label: 'NuGet' },
      { value: 'pypi', label: 'PyPi' },
      { value: 'rubygems', label: 'RubyGems' }
    ]
    const { filterOptions } = this.props
    const { activeFilters } = this.state
    const coordinates = filterOptions.list
      .map(item => EntitySpec.isPath(item) && EntitySpec.fromPath(item))
      .filter(x => x)
    const names = uniq(coordinates.map(coordinate => coordinate.name))
    filterOptions.list = names
    return (
      <Row className="show-grid spacer">
        <Col md={11} mdOffset={1}>
          <div className={'horizontalBlock'}>
            {this.renderFilter(curateFilters, 'Fix something', 'curate', 'success', has(activeFilters, 'curate'), () =>
              this.onFilter({ type: 'curate', value: get(activeFilters, 'curate') })
            )}
            <span>&nbsp;</span>
            {this.renderFilter(providers, 'Provider', 'provider', null, has(activeFilters, 'provider'), () =>
              this.onFilter({ type: 'provider', value: get(activeFilters, 'provider') })
            )}
            <span>&nbsp;</span>
            <FilterBar
              options={filterOptions}
              onChange={this.onBrowse}
              onSearch={this.onSearch}
              onClear={this.onBrowse}
              clearOnChange
            />
            {Object.keys(activeFilters).length > 0 ? (
              <>
                <span>&nbsp;</span>
                <Button variant="primary" onClick={this.onClearSearch}>
                  Clear Search
                </Button>
              </>
            ) : null}
          </div>
        </Col>
      </Row>
    )
  }

  renderButtons() {
    return (
      <ButtonsBar
        hasChanges={!this.hasChanges()}
        revertAll={() => this.revertAll('browse')}
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

  onClearSearch() {
    this.setState({ ...this.state, activeFilters: {} }, () => this.updateData())
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

    return (
      // OMG, structural whitespace?!
      <div className="filter-list" align="right">
        <SpdxPicker value={''} promptText={'License'} onChange={value => this.onFilter({ type: 'license', value })} />
        &nbsp;
        <SortList list={sorts} title={'Sort By'} id={'sort'} value={this.state.activeSort} onSort={this.onSort} />
        &nbsp; &nbsp; &nbsp; &nbsp;
      </div>
    )
  }

  renderFilter(list, title, id, variant, allowReset, onReset) {
    return (
      <FilterList
        list={list}
        title={title}
        id={id}
        value={this.state.activeFilters}
        onFilter={this.onFilter}
        variant={variant}
        allowReset={allowReset}
        onReset={onReset}
      />
    )
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
      case 'score':
        query.sort = 'effectiveScore'
        query.sortDesc = false
        break
      case 'score-desc':
        query.sort = 'effectiveScore'
        query.sortDesc = true
        break
      default:
        break
    }
    if (query.curate === 'licensed') query.maxLicensedScore = 70
    if (query.curate === 'described') query.maxDescribedScore = 70
    if (query.curate === 'effective') query.maxEffectiveScore = 70
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
      <Grid className="main-container flex-column">
        <ContributePrompt
          ref={this.contributeModal}
          session={session}
          onLogin={this.handleLogin}
          actionHandler={this.doContribute}
        />
        {this.renderTopFilters()}
        <Section className="flex-grow-column" name={this.tableTitle()} actionButton={this.renderButtons()}>
          <div className={classNames('section-body flex-grow', { loading: components.isFetching })}>
            <i className="fas fa-spinner fa-spin" />
            <ComponentList
              readOnly={false}
              list={components.transformedList}
              listLength={get(components, 'headers.pagination.totalCount') || components.list.length}
              loadMoreRows={this.loadMoreRows}
              onRevert={(definition, value) => this.revertDefinition(definition, value, 'browse')}
              onChange={this.onChangeComponent}
              onInspect={this.onInspect}
              renderFilterBar={this.renderFilterBar}
              curations={curations}
              definitions={definitions}
              noRowsRenderer={() => this.noRowsRenderer(components.isFetching)}
              sequence={sequence}
              hasChange={this.hasChange}
              hideVersionSelector
            />
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
          </div>
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
    components: state.ui.browse.componentList,
    filterOptions: state.ui.definitions.filterList
  }
}

export default connect(mapStateToProps)(PageBrowse)
