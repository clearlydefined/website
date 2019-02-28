import React, { Component } from 'react'
import { Table, Input, Button, Icon } from 'antd'
import get from 'lodash/get'
import isArray from 'lodash/isArray'
import CopyrightsRenderer from '../../components/CopyrightsRenderer'
import LicensesRenderer from '../../components/LicensesRenderer'
import FacetsRenderer from '../../components/FacetsRenderer'
import Contribution from '../../utils/contribution'
import FileListSpec from '../../utils/filelist'
export default class FileList extends Component {
  state = {
    files: [],
    filteredFiles: [],
    filteredInfo: {},
    sortedInfo: {},
    expandedRows: [],
    searchText: null
  }

  componentWillReceiveProps(nextProps) {
    this.setState({
      files: FileListSpec.pathToTreeFolders(nextProps.files, nextProps.component.item, nextProps.previewDefinition)
    })
  }

  filterFiles = (files, dataIndex, value) => {
    return files.map(record => this.filterValues(record, dataIndex, value)).filter(x => x)
  }

  filterValues = (record, dataIndex, value) => {
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

  handleSearch = (dataIndex, selectedKeys, confirm) => {
    confirm()
    const filteredFiles = this.filterFiles(this.state.files, dataIndex, selectedKeys[0])
    this.setState({ searchText: selectedKeys[0], filteredFiles })
  }

  handleReset = clearFilters => {
    clearFilters()
    this.setState({ searchText: '' })
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

  render() {
    const { readOnly, component, previewDefinition } = this.props
    let { expandedRows, searchText, filteredFiles, files } = this.state

    const columns = [
      {
        title: 'Name',
        dataIndex: 'name',
        key: 'name',
        ...this.getColumnSearchProps('name'),
        render: text => <span>{text}</span>,
        width: '40%',
        className: 'column-name'
      },
      {
        title: 'Facets',
        dataIndex: 'facets',
        key: 'facets',
        ...this.getColumnSearchProps('facets'),
        render: (value, record) => !record.children && <FacetsRenderer key={record.id} values={value || []} />,
        width: '20%',
        className: 'column-facets'
      },
      {
        title: 'Licenses',
        dataIndex: 'license',
        key: 'license',
        className: 'column-license',
        ...this.getColumnSearchProps('license'),
        render: (value, record) =>
          !record.children && (
            <LicensesRenderer
              revertable={false}
              field={`files[${record.id}].license`}
              readOnly={readOnly}
              initialValue={get(component.item, `files[${record.id}].license`)}
              value={Contribution.getValue(component.item, previewDefinition, `files[${record.id}].license`)}
              onChange={license => {
                this.props.onChange(`files[${record.id}]`, license, null, license => {
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
                item={
                  Contribution.getValue(component.item, previewDefinition, `files[${record.id}].attributions`) || []
                }
                readOnly={readOnly}
                selections={false}
                onSave={value => {
                  this.props.onChange(`files[${record.id}]`, value, null, value => {
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
        onExpandedRowsChange={expandedRows => this.setState({ expandedRows })}
        pagination={false}
        bordered={false}
        indentSize={30}
      />
    )
  }
}
