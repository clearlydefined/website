// Copyright (c) Microsoft Corporation and others. Licensed under the MIT license.
// SPDX-License-Identifier: MIT

import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import { Table, Input, Button, Icon, Checkbox } from 'antd'
import { Paper } from '@material-ui/core'
import get from 'lodash/get'
import isArray from 'lodash/isArray'
import FacetsDropdown from '../../components/FacetsDropdown'
import Contribution from '../../utils/contribution'
import FileListSpec from '../../utils/filelist'
import Attachments from '../../utils/attachments'
import ModalEditor from '../ModalEditor'
import EnhancedLicensePicker from '../../utils/EnhancedLicensePicker'
import folderIcon from '../../images/icons/folder.svg'
import fileIcon from '../../images/icons/file.svg'
import FolderOpenIcon from '@material-ui/icons/FolderOpen'
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
    searchText: null,
    selectedDirectory: null,
    breadcrumbs: []
  }

  componentDidMount() {
    this.updateFileList(this.props)
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
      <span>
        <img src={fileIcon} alt="folder-icon" className="directory-folder-icon" />
        <a href={url} target="_blank" rel="noopener noreferrer">
          {row.name}
        </a>
      </span>
    ) : (
      <span>
        <img src={folderIcon} alt="folder-icon" className="directory-folder-icon" />
        {row.name}
      </span>
    )
  }

  renderCopyrightCell = (record, component, previewDefinition) => {
    let copyrights = Contribution.getValue(
      component.item,
      previewDefinition,
      `files[${record.id}].attributions`
    ).toString()
    const haveLongText = copyrights.length && copyrights.length > 42 ? true : false
    // console.log('copyrights', copyrights.toString())
    var showFulltext = false
    return (
      !record.children &&
      (copyrights ? (
        <div>
          <p className="text-black">{copyrights.slice(0, showFulltext ? copyrights.length : 42)}</p>
          {haveLongText && <div onClick={e => (showFulltext = true)}>More</div>}
        </div>
      ) : (
        <p className="text-gray"></p>
      ))
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

  onLicenseChange(record, license) {
    const { onChange, component, previewDefinition } = this.props
    const attributions = Contribution.getValue(component.item, previewDefinition, `files[${record.id}].attributions`)
    onChange(`files[${record.id}]`, license, null, license => ({
      path: record.path,
      license,
      ...(attributions ? { attributions } : {})
    }))
  }

  onDirectorySelect = e => {
    let tempdata = this.state.breadcrumbs
    tempdata.push(e)
    this.setState({ files: e.children, breadcrumbs: tempdata })
    tempdata = []
  }

  onBreadcrumbSelect(item, index) {
    const { breadcrumbs } = this.state
    if (breadcrumbs.length !== index) {
      this.setState({ files: item.children })
      breadcrumbs.length = index + 1
    }
  }

  renderBreadcrumbs() {
    const { coordinates } = this.props
    const { breadcrumbs } = this.state
    return (
      <div className="breadcrumbs-container">
        <div
          className="breadcrumb-item"
          onClick={e => {
            this.updateFileList(this.props)
            this.setState({ breadcrumbs: [] })
          }}
        >
          {coordinates?.name}-{coordinates?.revision}
        </div>
        {breadcrumbs.map((item, index) => {
          return (
            <div
              className={`${
                breadcrumbs.length - 1 === index ? 'breadcrumb-item breadcrumb-last-item' : 'breadcrumb-item'
              }`}
              key={index}
              onClick={e => this.onBreadcrumbSelect(item, index)}
            >
              {item.name}
            </div>
          )
        })}
      </div>
    )
  }

  renderLicenseCell(record) {
    const { readOnly, component, previewDefinition } = this.props
    const field = `files[${record.id}].license`
    const editor = EnhancedLicensePicker
    return (
      !record.children && (
        <ModalEditor
          revertable={false}
          field={field}
          readOnly={readOnly}
          initialValue={get(component.item, field)}
          value={Contribution.getValue(component.item, previewDefinition, field)}
          placeholder={'SPDX license'}
          editor={editor}
          onChange={license => this.onLicenseChange(record, license)} />
      )
    )
  }

  render() {
    const { definition, component, previewDefinition } = this.props
    const { expandedRows, searchText, filteredFiles, files } = this.state

    const facets = Contribution.getValue(definition, previewDefinition, 'described.facets')
    const licenses = get(component.item, 'licensed.facets.core.discovered.expressions', [])
    const columns = [
      {
        title: 'Name',
        dataIndex: 'name',
        key: 'name',
        // ...this.getColumnSearchProps('name'),
        render: (_, record) => {
          return (
            <div onClick={e => (record.children ? this.onDirectorySelect(record) : null)}>
              {this.getNameCellEntry(component.item, record)}
            </div>
          )
        },
        width: '25%',
        className: 'column-name'
      },
      {
        title: 'Facets',
        dataIndex: 'facets',
        key: 'facets',
        // ...this.getColumnSearchProps('facets'),
        render: (value, record) => (
          <FacetsDropdown
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
          return { text: license, value: license }
        }),
        onFilter: (value, record) => {
          const license = Contribution.getValue(component.item, previewDefinition, `files[${record.id}].license`)
          return license === value
        },
        // ...this.getLicenseColumnFilter('license'),
        filterIcon: filtered => <Icon type="search" style={{ color: filtered ? '#1890ff' : undefined }} />,
        // render: (value, record) =>
        //   !record.children && (
        //     <LicensesRenderer
        //       revertable={false}
        //       field={`files[${record.id}].license`}
        //       readOnly={readOnly}
        //       initialValue={get(component.item, `files[${record.id}].license`)}
        //       value={Contribution.getValue(component.item, previewDefinition, `files[${record.id}].license`)}
        //       onChange={license => {
        //         onChange(`files[${record.id}]`, license, null, license => {
        //           const attributions = Contribution.getValue(
        //             component.item,
        //             previewDefinition,
        //             `files[${record.id}].attributions`
        //           )
        //           return {
        //             path: record.path,
        //             license,
        //             ...(attributions ? { attributions } : {})
        //           }
        //         })
        //       }}
        //     />
        //   ),
        render: (value, record) => this.renderLicenseCell(record),
        width: '20%'
      },
      {
        title: 'Copyrights',
        dataIndex: 'attributions',
        key: 'attributions',
        className: 'column-copyrights',
        // ...this.getColumnSearchProps('attributions'),
        render: (value, record) => this.renderCopyrightCell(record, component, previewDefinition),
        width: '25%'
      }
    ]

    return (
      <div className="diractry-viewer">
        {this.renderBreadcrumbs()}
        <Paper className="w-100 rounded">
          <Table
            columns={columns}
            dataSource={searchText ? filteredFiles : files}
            expandableRowIcon={<FolderOpenIcon />}
            onChange={this.handleChange}
            expandedRowKeys={expandedRows}
            onExpandedRowsChange={expandedRows => expandedRows.length > 0 && this.setState({ expandedRows })}
            pagination={false}
          />
        </Paper>
      </div>
    )
  }
}
