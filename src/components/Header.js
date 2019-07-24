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
    Auth.doLogin((token, permissions, username, publicEmails) => {
      this.props.dispatch(login(token, permissions, username, publicEmails))
    })
  }

  gotoDocs() {
    window.open('https://docs.clearlydefined.io', '_blank')
  }

  renderDocs() {
    return (
      <NavItem eventKey={1} onClick={this.gotoDocs}>
        Docs
      </NavItem>
    )
  }

  renderLogin() {
    const { session } = this.props
    if (session.isAnonymous && !session.isFetching)
      return (
        <NavItem eventKey={1} onClick={this.handleLogin}>
          Login
        </NavItem>
      )
    return (
      <NavItem eventKey={1} onClick={this.doLogout}>
        Logout
      </NavItem>
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
      <Navbar inverse={true} collapseOnSelect>
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
          <Nav activeKey="0" pullRight={true}>
            {this.renderDocs()}
            {this.renderLogin()}
          </Nav>
        </Navbar.Collapse>
      </Navbar>
    )
  }
}

function mapStateToProps(state) {
  return {
    navigation: state.navigation,
    session: state.session,
    ui: state.ui.header
  }
}

export default withRouter(connect(mapStateToProps)(Header))
