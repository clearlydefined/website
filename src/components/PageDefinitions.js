// Copyright (c) Microsoft Corporation and others. Licensed under the MIT license.
// SPDX-License-Identifier: MIT

import React from 'react'
import { connect } from 'react-redux'
import pako from 'pako'
import {
  Modal,
  FormGroup,
  InputGroup,
  FormControl,
  Grid,
  Button,
  DropdownButton,
  MenuItem,
  OverlayTrigger,
  Tooltip
} from 'react-bootstrap'
import base64js from 'base64-js'
import notification from 'antd/lib/notification'
import get from 'lodash/get'
import { uiNavigation, uiWarning } from '../actions/ui'
import { ROUTE_DEFINITIONS } from '../utils/routingConstants'
import AbstractPageDefinitions from './AbstractPageDefinitions'
import NotificationButtons from './Navigation/Ui/NotificationButtons'
import SearchBar from './Navigation/Ui/SearchBar'
import { ComponentList, Section, ContributePrompt } from './'
import FullDetailPage from './FullDetailView/FullDetailPage'
import SortList from './Navigation/Ui/SortList'
import { sorts, licenses, sources, releaseDates } from '../utils/utils'

export class PageDefinitions extends AbstractPageDefinitions {
  constructor(props) {
    super(props)
    this.onDrop = this.onDrop.bind(this)
    this.onAddComponent = this.onAddComponent.bind(this)
    this.doSave = this.doSave.bind(this)
    this.doSaveAsUrl = this.doSaveAsUrl.bind(this)
    this.revertAll = this.revertAll.bind(this)
    this.revertDefinition = this.revertDefinition.bind(this)
  }

  componentDidMount() {
    const { dispatch, path } = this.props
    if (path.length > 1) {
      try {
        const definitionSpec = pako.inflate(base64js.toByteArray(path), { to: 'string' })
        this.loadFromListSpec(JSON.parse(definitionSpec))
      } catch (e) {
        uiWarning(dispatch, 'Loading components from URL failed')
      }
    }
    dispatch(uiNavigation({ to: ROUTE_DEFINITIONS }))
  }

  tableTitle() {
    return 'Available definitions'
  }

  doRefreshAll = () => {
    if (this.hasChanges()) {
      const key = `open${Date.now()}`
      notification.open({
        message: 'Unsaved Changes',
        description: 'Some information has been changed and is currently unsaved. Are you sure to continue?',
        btn: (
          <NotificationButtons
            onClick={() => {
              this.refresh()
              notification.close(key)
            }}
            onClose={() => notification.close(key)}
            confirmText="Refresh"
            dismissText="Dismiss"
          />
        ),
        key,
        onClose: notification.close(key),
        duration: 0
      })
    } else {
      this.refresh()
    }
  }

  tooltip(text) {
    return <Tooltip id="tooltip">{text}</Tooltip>
  }

  renderButtonWithTip(button, tip) {
    const toolTip = <Tooltip id="tooltip">{tip}</Tooltip>
    return (
      <OverlayTrigger placement="top" overlay={toolTip}>
        {button}
      </OverlayTrigger>
    )
  }

  renderButtons() {
    return (
      <div className="pull-right">
        {this.renderButtonWithTip(
          <Button bsStyle="danger" disabled={!this.hasChanges()} onClick={this.revertAll}>
            <i className="fas fa-undo" />
            <span>&nbsp;Revert Changes</span>
          </Button>,
          'Revert all changes of all the definitions'
        )}
        <Button bsStyle="default" disabled={!this.hasComponents()} onClick={this.doRefreshAll}>
          Refresh
        </Button>
        &nbsp;
        <Button bsStyle="default" disabled={!this.hasComponents()} onClick={this.collapseAll}>
          Collapse All
        </Button>
        &nbsp;
        <Button bsStyle="danger" disabled={!this.hasComponents()} onClick={this.onRemoveAll}>
          Clear All
        </Button>
        &nbsp;
        {this.renderShareButton()}
        &nbsp;
        <Button bsStyle="success" disabled={!this.hasChanges()} onClick={this.doPromptContribute}>
          Contribute
        </Button>
      </div>
    )
  }

  renderShareButton() {
    const { components } = this.props
    const disabled = components.list.length === 0
    return (
      <DropdownButton disabled={disabled} id={'sharedropdown'} title="Share" bsStyle="success">
        <MenuItem eventKey="1" onSelect={this.doSaveAsUrl}>
          URL
        </MenuItem>
        <MenuItem eventKey="2" onSelect={() => this.setState({ showSavePopup: true })}>
          File
        </MenuItem>
        <MenuItem eventKey="3" onSelect={() => this.setState({ showSavePopup: true, saveType: 'gist' })}>
          Gist
        </MenuItem>
        <MenuItem divider />
        <MenuItem disabled>Definitions (Not implemented)</MenuItem>
        <MenuItem disabled>SPDX (Not implemented)</MenuItem>
      </DropdownButton>
    )
  }

  renderFilter(list, title, id) {
    return (
      <DropdownButton
        className="list-button"
        bsStyle="default"
        pullRight
        title={title}
        disabled={!this.hasComponents()}
        id={id}
      >
        {list.map((filterType, index) => {
          return (
            <MenuItem
              className="page-definitions__menu-item"
              key={index}
              onSelect={this.onFilter}
              eventKey={{ type: id, value: filterType.value }}
            >
              <span>{filterType.label}</span>
              {this.checkFilter(filterType, id) && <i className="fas fa-check" />}
            </MenuItem>
          )
        })}
      </DropdownButton>
    )
  }

  renderFilterBar() {
    return (
      <div className="list-filter" align="right">
        <SortList
          list={sorts}
          title={'Sort By'}
          id={'sort'}
          disabled={!this.hasComponents()}
          value={this.state.activeSort}
          onSort={this.onSort}
        />
        {this.renderFilter(licenses, 'License', 'licensed.declared')}
        {this.renderFilter(sources, 'Source', 'described.sourceLocation')}
        {this.renderFilter(releaseDates, 'Release Date', 'described.releaseDate')}
      </div>
    )
  }

  noRowsRenderer() {
    return (
      <div className="list-noRows">
        <div>
          <p>Search for components in the above search bar or drag and drop...</p>
          <ul>
            <li>the URL for a component version/commit from nuget.org, github.com, npmjs.com, ... </li>
            <li>
              the URL for curation PR from{' '}
              <a href="https://github.com/clearlydefined/curated-data">
                https://github.com/clearlydefined/curated-data
              </a>
              , ...{' '}
            </li>
            <li>a saved ClearlyDefined component list, package-lock.json, project-log.json, ... </li>
          </ul>
        </div>
      </div>
    )
  }

  readOnly() {
    return false
  }

  renderSavePopup() {
    return (
      <Modal show={this.state.showSavePopup} onHide={() => this.setState({ showSavePopup: false })}>
        <Modal.Header closeButton>
          <Modal.Title>Save the file with a name</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <FormGroup>
            <InputGroup>
              <FormControl
                type="text"
                placeholder="Type a name to apply to the file that is going to be saved"
                onChange={e => this.setState({ fileName: e.target.value })}
              />
              <InputGroup.Addon>.json</InputGroup.Addon>
            </InputGroup>
          </FormGroup>
        </Modal.Body>
        <Modal.Footer>
          <div>
            <FormGroup className="pull-right">
              <Button onClick={() => this.setState({ showSavePopup: false })}>Cancel</Button>
              <Button bsStyle="success" disabled={!this.state.fileName} type="button" onClick={() => this.doSave()}>
                OK
              </Button>
            </FormGroup>
          </div>
        </Modal.Footer>
      </Modal>
    )
  }

  render() {
    const { components, definitions, session, filterOptions } = this.props
    const { sequence, showFullDetail, path, currentComponent, currentDefinition } = this.state
    return (
      <Grid className="main-container">
        <ContributePrompt
          ref={this.contributeModal}
          session={session}
          onLogin={this.handleLogin}
          actionHandler={this.doContribute}
        />
        <SearchBar filterOptions={filterOptions} onChange={this.onAddComponent} onSearch={this.onSearch} />
        <Section name={this.tableTitle()} actionButton={this.renderButtons()}>
          {this.dropZone(
            <div className="section-body">
              <ComponentList
                readOnly={this.readOnly()}
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
                showVersionSelectorPopup={this.showVersionSelectorPopup}
              />
            </div>
          )}
        </Section>
        {currentDefinition && (
          <FullDetailPage
            modalView
            visible={showFullDetail}
            onClose={this.onInspectClose}
            onSave={this.onChangeComponent}
            path={path}
            currentDefinition={currentDefinition}
            component={currentComponent}
            readOnly={this.readOnly()}
          />
        )}
        {this.renderSavePopup()}
        {this.renderVersionSelectopPopup()}
      </Grid>
    )
  }
}

function mapStateToProps(state, ownProps) {
  return {
    token: state.session.token,
    filterValue: state.ui.browse.filter,
    path: ownProps.location.pathname.slice(ownProps.match.url.length + 1),
    filterOptions: state.ui.browse.filterList,
    components: state.ui.browse.componentList,
    definitions: state.definition.bodies,
    session: state.session
  }
}
export default connect(mapStateToProps)(PageDefinitions)
