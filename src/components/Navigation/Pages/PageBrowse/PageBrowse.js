// Copyright (c) Microsoft Corporation and others. Licensed under the MIT license.
// SPDX-License-Identifier: MIT

import React from 'react'
import { connect } from 'react-redux'
import { Row, Col, Grid } from 'react-bootstrap'
import omit from 'lodash/omit'
import get from 'lodash/get'
import uniqBy from 'lodash/uniqBy'
import difference from 'lodash/difference'
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
import { curateFilters, types, getParamsToUrl, getParamsFromUrl } from '../../../../utils/utils'
import SpdxPicker from '../../../SpdxPicker'
import FilterBar from '../../../FilterBar'
import EntitySpec from '../../../../utils/entitySpec'
import ActiveFilters from '../../Sections/ActiveFilters'

/**
 * Page that show to the user a list of interesting definitions to curate
 */
class PageBrowse extends SystemManagedList {
  constructor(props) {
    super(props)
    this.state = {
      activeSort: 'releaseDate-desc'
    }
    this.onFilter = this.onFilter.bind(this)
    this.onSort = this.onSort.bind(this)
    this.updateData = this.updateData.bind(this)
    this.renderFilterBar = this.renderFilterBar.bind(this)
  }

  componentDidMount() {
    this.props.dispatch(uiNavigation({ to: ROUTE_ROOT }))
    const urlParams = getParamsFromUrl(this.props.location.search)
    urlParams
      ? this.setState(
          {
            activeSort: urlParams.sort && urlParams.sort,
            activeName: urlParams.name && urlParams.name,
            activeFilters: omit(urlParams, ['sort', 'name'])
          },
          () => this.updateData()
        )
      : this.updateData()
  }

  noRowsRenderer(isFetching) {
    return isFetching ? <div /> : <div className="list-noRows">Broaden your filters to find more results</div>
  }

  onBrowse = value => {
    this.setState({ activeName: value }, () => this.updateData())
  }

  tableTitle() {
    return 'Browse'
  }

  renderTopFilters() {
    const { filterOptions } = this.props
    const coordinates = filterOptions.list
      .map(item => EntitySpec.isPath(item) && EntitySpec.fromPath(item))
      .filter(x => x)
    const names = uniqBy(
      coordinates.map(coordinate => {
        return { type: coordinate.type, namespace: coordinate.namespace, name: coordinate.name }
      }),
      'name',
      'type'
    )

    const options = { ...filterOptions, list: names }
    return (
      <>
        <Row className="show-grid spacer">
          <Col md={2} mdOffset={1}>
            {this.renderFilter(curateFilters, 'Fix something', 'curate', 'success')}
          </Col>
          <Col md={8}>
            <div className={'horizontalBlock'}>
              {this.renderFilter(types, 'Type', 'type')}
              <span>&nbsp;</span>
              <FilterBar
                options={options}
                onChange={this.onBrowse}
                onSearch={this.onSearch}
                onClear={this.onBrowse}
                clearOnChange
              />
            </div>
          </Col>
        </Row>
      </>
    )
  }

  clearFilters = (filterName, id) => {
    switch (filterName) {
      case 'activeFilters':
        return this.onFilter({ type: id, value: get(this.state, `${filterName}.${id}`) })
      case 'activeSort':
        return this.onSort({ value: id })
      case 'activeName':
        return this.setState({ activeName: null }, () => this.updateData())
      default:
        return
    }
  }

  clearAllFilters = () =>
    this.setState({ activeFilters: null, activeSort: null, activeName: null }, () => this.updateData())

  renderButtons() {
    return (
      <ButtonsBar
        hasChanges={!this.hasChanges()}
        revertAll={() => this.revertAll('browse')}
        toggleCollapseExpandAll={this.toggleCollapseExpandAll}
        doPromptContribute={this.doPromptContribute}
      />
    )
  }

  // Overrides the default onFilter method
  onFilter(filter, overwrite = false) {
    const activeFilters = overwrite === true ? filter : Object.assign({}, this.state.activeFilters)
    let activeSort = null
    if (overwrite !== true) {
      const filterValue = get(activeFilters, filter.type)
      if ((filterValue && activeFilters[filter.type] === filter.value) || !filter.value)
        delete activeFilters[filter.type]
      else activeFilters[filter.type] = filter.value
    }
    if (filter.type === 'curate') {
      activeSort = 'score'
    }
    this.setState(
      {
        ...this.state,
        activeFilters: Object.keys(activeFilters).length > 0 ? activeFilters : null,
        activeSort: activeSort ? activeSort : this.state.activeSort
      },
      () => this.updateData()
    )
  }

  // Overrides the default onSort method
  onSort(eventKey) {
    let activeSort = eventKey.value
    if (this.state.activeSort === activeSort) activeSort = null
    this.setState({ ...this.state, activeSort, sequence: this.state.sequence + 1 }, () => this.updateData())
  }

  renderFilterBar() {
    const { activeFilters, activeSort, activeName } = this.state
    const sorts = [
      { value: 'releaseDate-desc', label: 'Newer' },
      { value: 'releaseDate', label: 'Older' },
      { value: 'score-desc', label: 'Higher Score' },
      { value: 'score', label: 'Lower Score' }
    ]

    return (
      // OMG, structural whitespace?!
      <div className="section--filter-bar">
        <div className="active-filters">
          <ActiveFilters
            activeFilters={activeFilters}
            activeSort={activeSort}
            activeName={activeName}
            onClear={this.clearFilters}
            onClearAll={this.clearAllFilters}
          />
        </div>
        <div className="filter-list">
          <SpdxPicker
            value={''}
            promptText={'License'}
            onChange={value => this.onFilter({ type: 'license', value })}
            customIdentifiers={['NOASSERTION', '']}
          />
          &nbsp;
          <SortList list={sorts} title={'Sort By'} id={'sort'} value={this.state.activeSort} onSort={this.onSort} />
          &nbsp; &nbsp; &nbsp; &nbsp;
        </div>
      </div>
    )
  }

  renderFilter(list, title, id, variant) {
    return (
      <FilterList
        list={list}
        title={title}
        id={id}
        value={this.state.activeFilters}
        onFilter={this.onFilter}
        variant={variant}
      />
    )
  }

  async updateData(continuationToken) {
    const { activeFilters, activeSort, activeName } = this.state
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
    const urlParams = getParamsToUrl(omit(query, ['continuationToken']))
    this.props.history.replace({
      pathname: this.props.location.pathname,
      search: `?${urlParams}`
    })
    await this.props.dispatch(uiBrowseGet(this.props.token, query))
    if (this.props.definitions.entries)
      this.props.dispatch(
        getCurationsAction(
          this.props.token,
          difference(Object.keys(this.props.definitions.entries), Object.keys(this.props.curations.entries))
        )
      )
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
          definitions={this.getDefinitionsWithChanges()}
        />
        {this.renderTopFilters()}
        <Section className="flex-grow-column" name={this.tableTitle()} actionButton={this.renderButtons()}>
          <div className={classNames('section-body flex-grow', { loading: components.isFetching })}>
            <i className="fas fa-spinner fa-spin" />
            <ComponentList
              multiSelectEnabled={this.multiSelectEnabled}
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
              hideRemoveButton
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
