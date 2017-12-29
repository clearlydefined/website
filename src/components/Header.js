// Copyright (c) Microsoft Corporation. All rights reserved.
// SPDX-License-Identifier: MIT

import React, { Component } from 'react'
import { connect } from 'react-redux'
import logo from '../images/logo.svg';
import { logout, login } from '../actions/sessionActions'
import { withRouter } from 'react-router-dom'
import { ROUTE_ROOT, ROUTE_CURATION } from '../utils/routingConstants'
import { Nav, Navbar, NavItem } from 'react-bootstrap'
import { LinkContainer, IndexLinkContainer } from 'react-router-bootstrap'
import { filter } from 'lodash'
import { LoginPrompt } from './'

class Header extends Component {

  constructor(props) {
    super(props)
    this.promptLogin = this.promptLogin.bind(this)
    this.doLogin = this.doLogin.bind(this)
    this.doLogout = this.doLogout.bind(this)
  }

  doLogout(e) {
    e.preventDefault()
    this.props.dispatch(logout())
  }

  doLogin(username, password) {
    this.props.dispatch(login(username, password))
  }

  promptLogin(e) {
    e.preventDefault()
    this.refs.loginModal.open()
  }

  renderLogin() {
    const { session } = this.props
    if (session.isAnonymous && !session.isFetching)
      return (
        <Nav id="nav_profile" bsStyle="pills" activeKey="0" pullRight={true}>
          <LoginPrompt ref="loginModal" loginHandler={this.doLogin} />
          <NavItem eventKey={1} onClick={this.promptLogin} >Login</NavItem>
        </Nav>)
    return (
      <Nav id="nav_profile" bsStyle="pills" activeKey="0" pullRight={true}>
        <NavItem eventKey={1} onClick={this.doLogout} >Logout</NavItem>
      </Nav>)
  }

  renderNavigation(navigation, isAnonymous) {
    const filterExpr = isAnonymous ? o => o.protected !== 1 : o => o.protected !== -1
    return (
      <Nav bsStyle="pills">
        {filter(navigation, filterExpr).map((navItem, i) => {
          return (
            <IndexLinkContainer active={navItem.isSelected} activeClassName='active' to={navItem.to} key={i}>
              <NavItem>
                <div>{navItem.title}</div>
              </NavItem>
            </IndexLinkContainer>
          )
        })}
      </Nav>
    )
  }

  render() {
    const { session, navigation } = this.props
    return (
      <Navbar inverse={true} id="nav_header">
        <Navbar.Header>
          <Navbar.Brand>
            <LinkContainer to={ROUTE_ROOT}>
              <img src={logo} className="app-header_logo-content" alt="logo" />
            </LinkContainer>
          </Navbar.Brand>
        </Navbar.Header>
        <Navbar.Collapse>
          {this.renderNavigation(navigation, session.isAnonymous)}
          {this.renderLogin()}
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
