// Copyright (c) Microsoft Corporation and others. Licensed under the MIT license.
// SPDX-License-Identifier: MIT

import React, { Component } from 'react'
import { connect } from 'react-redux'
import logo from '../images/logo-text.svg'
import { logout, login } from '../actions/sessionActions'
import { withRouter } from 'react-router-dom'
import { ROUTE_ROOT } from '../utils/routingConstants'
import { Nav, Navbar, NavItem } from 'react-bootstrap'
import { LinkContainer, IndexLinkContainer } from 'react-router-bootstrap'
import { filter, intersection } from 'lodash'
import { url } from '../api/clearlyDefined'

class Header extends Component {
  constructor(props) {
    super(props)
    this.doLogin = this.doLogin.bind(this)
    this.doLogout = this.doLogout.bind(this)
  }

  doLogout(e) {
    e.preventDefault()
    this.props.dispatch(logout())
  }

  doLogin(e) {
    e.preventDefault()
    window.open(url('auth/github'))
    const tokenListener = e => {
      if (e.data.type === 'github-token') {
        this.props.dispatch(login(e.data.token, e.data.permissions))
        window.removeEventListener('message', tokenListener)
      }
    }
    window.addEventListener('message', tokenListener)
  }

  gotoDocs() {
    window.open('https://docs.clearlydefined.io', '_blank')
  }

  renderDocs() {
    return (
      <Nav id="nav_profile" bsStyle="pills" activeKey="0" pullRight={true}>
        <NavItem eventKey={1} onClick={this.gotoDocs}>
          Docs
        </NavItem>
      </Nav>
    )
  }

  renderLogin() {
    const { session } = this.props
    if (session.isAnonymous && !session.isFetching)
      return (
        <Nav id="nav_profile" bsStyle="pills" activeKey="0" pullRight={true}>
          <NavItem eventKey={1} onClick={this.doLogin}>
            Login
          </NavItem>
        </Nav>
      )
    return (
      <Nav id="nav_profile" bsStyle="pills" activeKey="0" pullRight={true}>
        <NavItem eventKey={1} onClick={this.doLogout}>
          Logout
        </NavItem>
      </Nav>
    )
  }

  renderNavigation(navigation, isAnonymous) {
    const filterExpr = isAnonymous
      ? o => o.protected !== 1
      : o => o.protected !== -1 && this.hasPermissions(o.permissions)
    return (
      <Nav bsStyle="pills">
        {filter(navigation, filterExpr).map((navItem, i) => {
          return (
            <IndexLinkContainer active={navItem.isSelected} activeClassName="active" to={navItem.to} key={i}>
              <NavItem>
                <div>{navItem.title}</div>
              </NavItem>
            </IndexLinkContainer>
          )
        })}
      </Nav>
    )
  }

  hasPermissions(permissions) {
    if (!permissions) return true
    return intersection(this.props.session.permissions, permissions).length > 0
  }

  render() {
    const { session, navigation } = this.props
    return (
      <Navbar inverse={true} id="nav_header">
        <Navbar.Header>
          <Navbar.Brand>
            <LinkContainer to={ROUTE_ROOT}>
              <img src={logo} className="App-logo" alt="logo" />
            </LinkContainer>
          </Navbar.Brand>
        </Navbar.Header>
        <Navbar.Collapse>
          {this.renderNavigation(navigation, session.isAnonymous)}
          {this.renderLogin()}
          {this.renderDocs()}
        </Navbar.Collapse>
      </Navbar>
    )
  }
}

function mapStateToProps(state, ownProps) {
  return {
    navigation: state.ui.navigation,
    session: state.session,
    ui: state.ui.header
  }
}

export default withRouter(connect(mapStateToProps)(Header))
