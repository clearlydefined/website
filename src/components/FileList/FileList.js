import React, { Component } from 'react'
import { Table, Input, Button, Icon } from 'antd'
import get from 'lodash/get'
import CopyrightsRenderer from '../../components/CopyrightsRenderer'
import LicensesRenderer from '../../components/LicensesRenderer'
import FacetsRenderer from '../../components/FacetsRenderer'
import Contribution from '../../utils/contribution'
import FileListSpec from '../../utils/filelist'
export default class FileList extends Component {
  state = {
    filteredInfo: {},
    sortedInfo: {},
    expandedRows: []
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
          onClick={() => this.handleSearch(selectedKeys, confirm)}
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
    onFilter: (value, record) => {
      return record[dataIndex]
        ? record[dataIndex]
            .toString()
            .toLowerCase()
            .includes(value.toLowerCase())
        : false
    },
    onFilterDropdownVisibleChange: visible => {
      if (visible) {
        setTimeout(() => this.searchInput.select())
      }
    }
  })

  handleSearch = (selectedKeys, confirm) => {
    confirm()
    this.setState({ searchText: selectedKeys[0] })
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
    const { readOnly, component, previewDefinition, files } = this.props
    let { expandedRows } = this.state

    const columns = [
      {
        title: 'Name',
        dataIndex: 'name',
        key: 'name',
        ...this.getColumnSearchProps('name'),
        render: text => <span>{text}</span>,
        width: '30%'
      },
      {
        title: 'Facets',
        dataIndex: 'facets',
        key: 'facets',
        ...this.getColumnSearchProps('facets'),
        render: (value, record) => !record.children && <FacetsRenderer key={record.id} values={value || []} />,
        width: '20%'
      },
      {
        title: 'Licenses',
        dataIndex: 'license',
        key: 'license',
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
        width: '25%'
      },
      {
        title: 'Copyrights',
        dataIndex: 'attributions',
        key: 'attributions',
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
        width: '25%'
      }
    ]
    return (
      <Table
        columns={columns}
        dataSource={FileListSpec.pathToTreeFolders(files, component.item, previewDefinition)}
        onChange={this.handleChange}
        expandedRowKeys={expandedRows}
        onExpandedRowsChange={expandedRows => this.setState({ expandedRows })}
        pagination={false}
      />
    )
  }
}
