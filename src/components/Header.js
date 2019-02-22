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
import Auth from '../utils/auth'

class Header extends Component {
  constructor(props) {
    super(props)
    this.handleLogin = this.handleLogin.bind(this)
    this.doLogout = this.doLogout.bind(this)
  }

  doLogout(e) {
    e.preventDefault()
    this.props.dispatch(logout())
  }

  handleLogin(e) {
    e.preventDefault()
    Auth.doLogin((token, permissions, username) => {
      this.props.dispatch(login(token, permissions, username))
    })
  }

  gotoDocs() {
    window.open('https://docs.clearlydefined.io', '_blank')
  }

  renderDocs() {
    return (
      <Nav activeKey="0" pullRight={true}>
        <NavItem eventKey={1} onClick={this.gotoDocs}>
          Docs
        </NavItem>
      </Nav>
    )
  }

  renderLogin() {
    const { session } = this.props
    let navItem = (
      <NavItem eventKey={1} onClick={this.doLogout}>
        Logout
      </NavItem>
    )
    if (session.isAnonymous && !session.isFetching)
      navItem = (
        <NavItem eventKey={1} onClick={this.handleLogin}>
          Login
        </NavItem>
      )
    return (
      <Nav activeKey="0" pullRight={true}>
        {navItem}
      </Nav>
    )
  }

  renderNavigation(navigation, isAnonymous) {
    const filterExpr = isAnonymous
      ? o => o.protected !== 1
      : o => o.protected !== -1 && this.hasPermissions(o.permissions)
    return (
      <Nav>
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
      <Navbar inverse={true}>
        <Navbar.Header>
          <Navbar.Brand>
            <LinkContainer to={ROUTE_ROOT}>
              <img src={logo} className="App-logo" alt="logo" />
            </LinkContainer>
          </Navbar.Brand>
          <Navbar.Toggle />
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
