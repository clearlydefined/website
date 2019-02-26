import React, { Component } from 'react'
import PropTypes from 'prop-types'
import SortList from '../Ui/SortList'
import FilterList from '../Ui/FilterList'
import { sorts, licenses, sources, releaseDates } from '../../../utils/utils'
import { Checkbox, Dropdown, Button, Icon, Menu } from 'antd'

export default class FilterBar extends Component {
  static propTypes = {
    activeSort: PropTypes.string,
    activeFilters: PropTypes.object,
    onFilter: PropTypes.func,
    onSort: PropTypes.func,
    hasComponents: PropTypes.bool,
    showSortFilter: PropTypes.bool,
    showLicenseFilter: PropTypes.bool,
    showSourceFilter: PropTypes.bool,
    showReleaseDateFilter: PropTypes.bool,
    customLicenses: PropTypes.array,
    customSorts: PropTypes.array,
    customSources: PropTypes.array,
    customReleaseDates: PropTypes.array
  }

  static defaultProps = {
    showSortFilter: true,
    showLicenseFilter: true,
    showSourceFilter: true,
    showReleaseDateFilter: true
  }

  onChangeAllLicenses = ({ item }) => {
    console.log(item)
  }

  menu(list) {
    return (
      <Menu onClick={this.onChangeAllLicenses}>
        {list.map((item, key) => (
          <Menu.Item key={key}>{item.label}</Menu.Item>
        ))}
      </Menu>
    )
  }

  render() {
    const {
      activeSort,
      activeFilters,
      onFilter,
      onSort,
      hasComponents,
      selected,
      showSortFilter,
      showLicenseFilter,
      showReleaseDateFilter,
      showSourceFilter,
      customLicenses,
      customSorts,
      customSources,
      customReleaseDates
    } = this.props

    return (
      <div>
        <div className="pull-left">
          <Checkbox style={{ marginTop: 6 }} disabled={hasComponents} onChange={this.props.onSelectAll}>
            Select All
          </Checkbox>
          {selected.length > 0 && (
            // testId="multi-license-select"
            <Button.Group style={{ display: 'inline-block' }}>
              <Dropdown overlay={this.menu(customLicenses || licenses)} trigger={['click']}>
                <Button style={{ marginLeft: 8 }}>
                  License <Icon type="down" />
                </Button>
              </Dropdown>
              <Button>Source</Button>
              <Button>Release Date</Button>
            </Button.Group>
          )}
        </div>
        <div className="list-filter" align="right">
          {showSortFilter && (
            <SortList
              list={customSorts || sorts}
              title={'Sort By'}
              id={'sort'}
              disabled={hasComponents}
              value={activeSort}
              onSort={onSort}
            />
          )}
          {showLicenseFilter && (
            <FilterList
              list={customLicenses || licenses}
              title={'License'}
              id={'licensed.declared'}
              disabled={hasComponents}
              value={activeFilters}
              onFilter={onFilter}
            />
          )}
          {showSourceFilter && (
            <FilterList
              list={customSources || sources}
              title={'Source'}
              id={'described.sourceLocation'}
              disabled={hasComponents}
              value={activeFilters}
              onFilter={onFilter}
            />
          )}
          {showReleaseDateFilter && (
            <FilterList
              list={customReleaseDates || releaseDates}
              title={'Release Date'}
              id={'described.releaseDate'}
              disabled={hasComponents}
              value={activeFilters}
              onFilter={onFilter}
            />
          )}
        </div>
      </div>
    )
  }
}
