// Copyright (c) Amazon.com, Inc. and others. Licensed under the MIT license.
// SPDX-License-Identifier: MIT

import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Grid, Row, Col, Button, Panel, Dropdown, MenuItem, Table } from 'react-bootstrap'
import { ROUTE_DEFINITIONS2, ROUTE_INSPECT, ROUTE_CURATE } from '../utils/routingConstants'
import { getDefinitionListAction, getDefinitionsAction } from '../actions/definitionActions'
import { FilterBar, ComponentList, Section, FacetSelect, EditableComponent } from './'
import { uiNavigation, uiBrowseUpdateList } from '../actions/ui'
import EntitySpec from '../utils/entitySpec'
import { PropTypes } from 'react-bs-notifier/lib/container'

const defaultFacets = [{ value: 'core', label: 'Core' }]

const sortOptions = {
  name: 'Component Name',
  date: 'Date',
  source: 'Source',
  'release-date': 'Release Date',
  'license-declared': 'Declared License',
  'license-discovered': 'Discovered License',
  'modified-by': 'Modified By'
}

class PageDefinitions extends Component {
  static propTypes = {
    token: PropTypes.string,
    components: PropTypes.any,
    definitions: PropTypes.any,
    filterOptions: PropTypes.any
  }

  constructor(props) {
    super(props)
    this.state = {
      activeFacets: defaultFacets.map(x => x.value),
      sortBy: 'date',
      sortAsc: false,
      changes: {},
      showChanges: false
    }
  }

  componentDidMount() {
    const { dispatch, token } = this.props
    dispatch(uiNavigation({ to: ROUTE_DEFINITIONS2 }))
    dispatch(getDefinitionListAction(token))

    window.addEventListener('beforeunload', this.onBeforeUnload)
  }

  componentWillUnmount() {
    window.removeEventListener('beforeunload', this.onBeforeUnload)
  }

  onBeforeUnload = event => {
    if (this.state.changes.length > 0) {
      event.returnValue = 'You have unsaved changes.'
      return event.returnValue
    }
  }

  onAddComponent = (value, after = null) => {
    const { dispatch, token, definitions } = this.props
    const component = typeof value === 'string' ? EntitySpec.fromPath(value) : value
    const path = component.toPath()
    component.definition = !!definitions.entries[path]
    !component.definition && dispatch(getDefinitionsAction(token, [path]))
    dispatch(uiBrowseUpdateList({ add: component }))
  }

  facetChange = value => {
    const activeFacets = (value || []).map(facet => facet.value)
    this.setState({ activeFacets })
  }

  changeSort = sortBy => {
    this.setState({ sortBy })
  }

  reverseSort = () => {
    this.setState({ sortAsc: !this.state.sortAsc })
  }

  setComponentChange = (component, newChanges) => {
    const { changes } = this.state
    const path = component.toPath()
    this.setState({
      changes: {
        ...this.state.changes,
        [path]: newChanges
      }
    })
  }

  render() {
    const { components, filterOptions, definitions, token } = this.props
    const { activeFacets, sortBy, sortAsc, changes, showChanges } = this.state

    const numChanges = Object.keys(changes).length

    return (
      <Grid className="main-container">
        <Row className="show-grid spacer">
          <Col md={5}>
            <FacetSelect name="facets" onChange={this.facetChange} defaultFacets={defaultFacets} />
          </Col>
          <Col md={7}>
            <FilterBar options={filterOptions} onChange={this.onAddComponent} clearOnChange />
          </Col>
        </Row>

        <Row>
          <Col md={12}>
            <Panel bsStyle={showChanges ? 'primary' : undefined}>
              <Panel.Heading>
                <div className="pull-right">
                  <Dropdown id="dropdown-custom-2" pullRight>
                    <Dropdown.Toggle noCaret bsSize="xsmall">
                      <i className={`fas fa-arrow-${sortAsc ? 'up' : 'down'}`} /> {sortOptions[sortBy]}
                    </Dropdown.Toggle>
                    <Dropdown.Menu>
                      <MenuItem onSelect={this.reverseSort}>
                        <i className={`fas fa-arrow-${sortAsc ? 'down' : 'up'}`} /> {sortOptions[sortBy]} (reverse)
                      </MenuItem>
                      <MenuItem divider />
                      {Object.keys(sortOptions)
                        .sort()
                        .map(opt => (
                          <MenuItem key={opt} eventKey={opt} onSelect={this.changeSort}>
                            {sortOptions[opt]}
                          </MenuItem>
                        ))}
                    </Dropdown.Menu>
                  </Dropdown>
                </div>

                <Panel.Title>
                  Components{' '}
                  {numChanges > 0 &&
                    !showChanges && (
                      <Button bsStyle="link" bsSize="xsmall" onClick={() => this.setState({ showChanges: true })}>
                        ({numChanges} pending changes)
                      </Button>
                    )}
                  {showChanges && (
                    <Button bsStyle="info" bsSize="xsmall" onClick={() => this.setState({ showChanges: false })}>
                      Return to search
                    </Button>
                  )}
                </Panel.Title>
              </Panel.Heading>

              <Table condensed className="component-list">
                {/* Search results: factor out into component */}
                <tbody>
                  {components.list.map(c => (
                    <EditableComponent
                      key={c.toPath()}
                      component={c}
                      sortColumn={sortBy}
                      onChange={changes => this.setComponentChange(c, changes)}
                    />
                  ))}
                </tbody>
              </Table>
            </Panel>
          </Col>
        </Row>

        <Row>
          <Col md={12}>
            {showChanges ? (
              <Button className="pull-right" bsStyle="primary" bsSize="large">
                Submit change request
              </Button>
            ) : (
              <Button
                className="pull-right"
                bsStyle="info"
                bsSize="large"
                onClick={() => this.setState({ showChanges: true })}
              >
                Review changes
              </Button>
            )}
          </Col>
        </Row>
      </Grid>
    )
  }
}

function mapStateToProps(state, ownProps) {
  return {
    token: state.session.token,
    components: state.ui.browse.componentList,
    definitions: state.definition.bodies,
    filterOptions: state.definition.list
  }
}
export default connect(mapStateToProps)(PageDefinitions)
