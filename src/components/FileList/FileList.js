// Copyright (c) Microsoft Corporation and others. Licensed under the MIT license.
// SPDX-License-Identifier: MIT

import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import { Table, Input, Button, Icon, Checkbox } from 'antd'
import get from 'lodash/get'
import isArray from 'lodash/isArray'
import CopyrightsRenderer from '../../components/CopyrightsRenderer'
import LicensesRenderer from '../../components/LicensesRenderer'
import FacetsRenderer from '../../components/FacetsRenderer'
import Contribution from '../../utils/contribution'
import FileListSpec from '../../utils/filelist'
import Attachments from '../../utils/attachments'

export default class FileList extends PureComponent {
  static propTypes = {
    onChange: PropTypes.func,
    files: PropTypes.array,
    component: PropTypes.object,
    previewDefinition: PropTypes.object,
    readOnly: PropTypes.bool
  }

  state = {
    files: [],
    filteredFiles: [],
    filteredInfo: {},
    sortedInfo: {},
    expandedRows: [],
    searchText: null
  }

  componentDidMount() {
    this.updateFileList(this.props)
  }

  componentWillReceiveProps(nextProps) {
    this.updateFileList(nextProps)
  }

  updateFileList = props => {
    this.setState({
      files: FileListSpec.pathToTreeFolders(props.files, props.component.item, props.previewDefinition)
    })
  }

  filterFiles = (files, dataIndex, value) => {
    return files.map(record => this.filterValues(record, dataIndex, value)).filter(x => x)
  }

  filterValues = (record, dataIndex, value) => {
    if (!value) return record
    if (Object.keys(record).includes('children')) {
      const children = record.children.reduce((previousValue, item) => {
        const filteredValue = this.filterValues(item, dataIndex, value)
        if (filteredValue) previousValue.push(filteredValue)
        return previousValue
      }, [])
      if (children.length > 0) return { ...record, children }
    }

    if (!record[dataIndex]) return false
    if (isArray(record[dataIndex]))
      return record[dataIndex].find(item =>
        Object.keys(item).length > 0
          ? item.value.toLowerCase().includes(value.toLowerCase())
          : item.toLowerCase().includes(value.toLowerCase())
      )
        ? record
        : false
    return record[dataIndex]
      .toString()
      .toLowerCase()
      .includes(value.toLowerCase())
      ? record
      : false
  }

  getColumnSearchProps = dataIndex => ({
    filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }) => (
      <div style={{ padding: 8 }}>
        <Input
          ref={node => {
            this.searchInput = node
          }}
          placeholder={`Search ${dataIndex}`}
          value={selectedKeys[0]}
          onChange={e => setSelectedKeys(e.target.value ? [e.target.value] : [])}
          onPressEnter={() => this.handleSearch(selectedKeys, confirm)}
          style={{ width: 188, marginBottom: 8, display: 'block' }}
        />
        <Button
          type="primary"
          onClick={() => this.handleSearch(dataIndex, selectedKeys, confirm)}
          icon="search"
          size="small"
          style={{ width: 90, marginRight: 8 }}
        >
          Search
        </Button>
        <Button onClick={() => this.handleReset(clearFilters)} size="small" style={{ width: 90 }}>
          Reset
        </Button>
      </div>
    ),
    sorter: false,
    filterIcon: filtered => <Icon type="search" style={{ color: filtered ? '#1890ff' : undefined }} />,
    onFilterDropdownVisibleChange: visible => {
      if (visible) {
        setTimeout(() => this.searchInput.select())
      }
    }
  })

  getLicenseColumnFilter = dataIndex => ({
    filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters, filters }) => (
      <div style={{ padding: 8 }}>
        <div>
          <Checkbox.Group options={filters} value={selectedKeys} onChange={e => setSelectedKeys(e)} />
        </div>
        <Button
          type="primary"
          onClick={() => this.handleSearch(dataIndex, selectedKeys, confirm)}
          icon="search"
          size="small"
          style={{ width: 90, marginRight: 8 }}
        >
          Search
        </Button>
        <Button onClick={() => this.handleReset(clearFilters)} size="small" style={{ width: 90 }}>
          Reset
        </Button>
      </div>
    ),
    sorter: false,
    filterIcon: filtered => <Icon type="search" style={{ color: filtered ? '#1890ff' : undefined }} />,
    onFilterDropdownVisibleChange: visible => {
      if (visible) {
        setTimeout(() => this.searchInput.select())
      }
    }
  })

  handleSearch = (dataIndex, selectedKeys, confirm) => {
    confirm()
    const filteredFiles = this.filterFiles(this.state.files, dataIndex, selectedKeys[0])
    this.setState(state => {
      return {
        ...state,
        searchText: selectedKeys[0],
        filteredFiles,
        expandedRows: FileListSpec.getFilesKeys(state.files)
      }
    })
  }

  handleReset = clearFilters => {
    clearFilters()
    this.setState({ searchText: '', expandedRows: [] })
  }

  handleChange = (pagination, filters, sorter) => {
    this.setState({
      filteredInfo: filters,
      sortedInfo: sorter
    })
  }

  clearFilters = () => {
    this.setState({ filteredInfo: null })
  }

  getNameCellEntry = (definition, row) => {
    if (!row || !definition) return null
    const path = get(row, 'path')
    const attachments = new Attachments({ ...definition.coordinates, path, row })
    const url = attachments.getFileAttachmentUrl()
    return url ? (
      <a href={url} target="_blank" rel="noopener noreferrer">
        {row.name}
      </a>
    ) : (
      <span>{row.name}</span>
    )
  }

  onFacetSelected = (facets, record, facet) => {
    const { definition, onChange, previewDefinition } = this.props
    const glob = Contribution.generateGlob(record)
    if (facets && facets.length > 0) {
      facets.forEach(facet => {
        const globs = Contribution.getValue(definition, previewDefinition, `described.facets.${facet}`)
        let newGlobs = [...globs]
        if (globs.indexOf(glob) === -1) newGlobs = [...globs, glob]
        onChange(`described.facets.${facet}`, newGlobs)
      })
      return
    }
    // remove glob from the list of globs for this facet
    const globs = Contribution.getValue(definition, previewDefinition, `described.facets.${facet}`)
    const matchingGlobs = globs.filter(glob => Contribution.folderMatchesGlob(record, glob))
    const newGlobs = globs.filter(g => !matchingGlobs.includes(g))
    onChange(`described.facets.${facet}`, newGlobs)
  }

  render() {
    const { onChange, definition, readOnly, component, previewDefinition } = this.props
    const { expandedRows, searchText, filteredFiles, files } = this.state

    const facets = Contribution.getValue(definition, previewDefinition, 'described.facets')
    const licenses = get(component.item, 'licensed.facets.core.discovered.expressions', [])
    const columns = [
      {
        title: 'Name',
        dataIndex: 'name',
        key: 'name',
        ...this.getColumnSearchProps('name'),
        render: (_, record) => this.getNameCellEntry(component.item, record),
        width: '40%',
        className: 'column-name'
      },
      {
        title: 'Facets',
        dataIndex: 'facets',
        key: 'facets',
        ...this.getColumnSearchProps('facets'),
        render: (value, record) => (
          <FacetsRenderer
            isFolder={(record.children && true) || false}
            onFacetSelected={this.onFacetSelected}
            facets={facets}
            key={record.id}
            record={record}
            values={value || []}
          />
        ),
        width: '20%',
        className: 'column-facets'
      },
      {
        title: 'Licenses',
        dataIndex: 'license',
        key: 'license',
        className: 'column-license',
        filters: licenses.map(license => {
          return { label: license, value: license }
        }),
        ...this.getLicenseColumnFilter('license'),
        filterIcon: filtered => <Icon type="search" style={{ color: filtered ? '#1890ff' : undefined }} />,
        render: (value, record) =>
          !record.children && (
            <LicensesRenderer
              revertable={false}
              field={`files[${record.id}].license`}
              readOnly={readOnly}
              initialValue={get(component.item, `files[${record.id}].license`)}
              value={Contribution.getValue(component.item, previewDefinition, `files[${record.id}].license`)}
              onChange={license => {
                onChange(`files[${record.id}]`, license, null, license => {
                  const attributions = Contribution.getValue(
                    component.item,
                    previewDefinition,
                    `files[${record.id}].attributions`
                  )
                  return {
                    path: record.path,
                    license,
                    ...(attributions ? { attributions } : {})
                  }
                })
              }}
            />
          ),
        width: '20%'
      },
      {
        title: 'Copyrights',
        dataIndex: 'attributions',
        key: 'attributions',
        className: 'column-copyrights',
        ...this.getColumnSearchProps('attributions'),
        render: (value, record) => {
          return (
            !record.children && (
              <CopyrightsRenderer
                field={record && `files[${record.id}].attributions`}
                initialValue={get(component.item, `files[${record.id}].attributions`, [])}
                item={
                  Contribution.getValue(component.item, previewDefinition, `files[${record.id}].attributions`) || []
                }
                readOnly={readOnly}
                selections={false}
                onSave={value => {
                  onChange(`files[${record.id}]`, value, null, value => {
                    return {
                      path: record.path,
                      license: Contribution.getValue(component.item, previewDefinition, `files[${record.id}].license`),
                      attributions: value
                    }
                  })
                }}
              />
            )
          )
        },
        width: '20%'
      }
    ]

    return (
      <Table
        className="file-list"
        columns={columns}
        dataSource={searchText ? filteredFiles : files}
        onChange={this.handleChange}
        expandedRowKeys={expandedRows}
        onExpandedRowsChange={expandedRows => expandedRows.length > 0 && this.setState({ expandedRows })}
        pagination={false}
        bordered={false}
        indentSize={8}
        scroll={{ y: 650 }}
      />
    )
  }
}
