// Copyright (c) Microsoft Corporation and others. Licensed under the MIT license.
// SPDX-License-Identifier: MIT

import React, { Component } from 'react'
import { connect } from 'react-redux'
import logo from '../images/web/logo.svg'
import { logout, login } from '../actions/sessionActions'
import { withRouter } from 'react-router-dom'
import { ROUTE_ROOT } from '../utils/routingConstants'
import { NavItem } from 'react-bootstrap'
import { LinkContainer, IndexLinkContainer } from 'react-router-bootstrap'
import { filter, intersection } from 'lodash'
import Auth from '../utils/auth'
import AccountCircleIcon from '@material-ui/icons/AccountCircle'
import ExitToAppIcon from '@material-ui/icons/ExitToApp'
import MenuIcon from '@material-ui/icons/Menu'
import CloseIcon from '@material-ui/icons/Close'
import { Button } from '@material-ui/core'

class Header extends Component {
  constructor(props) {
    super(props)
    this.handleLogin = this.handleLogin.bind(this)
    this.doLogout = this.doLogout.bind(this)
    this.checkNav = this.checkNav.bind(this)
    this.state = {
      menuOpen: true
    }
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
        Documentation
      </NavItem>
    )
  }

  renderLogin() {
    const { session } = this.props

    if (session?.isAnonymous && !session?.isFetching)
      return (
        <NavItem eventKey={1} onClick={this.handleLogin}>
          <AccountCircleIcon />
          Login
        </NavItem>
      )
    return (
      <>
        <NavItem eventKey={1} onClick={this.doLogout}>
          <ExitToAppIcon />
          Logout
        </NavItem>
      </>
    )
  }

  renderNavigation(navigation, isAnonymous) {
    const filterExpr = isAnonymous
      ? o => o.protected !== 1
      : o => o.protected !== -1 && this.hasPermissions(o.permissions)
    return filter(navigation, filterExpr).map((navItem, i) => {
      return (
        <IndexLinkContainer active={navItem.isSelected} activeClassName="active" to={navItem.to} key={i}>
          <NavItem role="button" onClick={() => (navItem.customUrl ? this.gotoDocs() : null)}>
            {navItem.title}
          </NavItem>
        </IndexLinkContainer>
      )
    })
  }

  hasPermissions(permissions) {
    if (!permissions) return true
    return intersection(this.props.session.permissions, permissions).length > 0
  }

  checkNav() {
    let width = window.innerWidth
    if (width > 768) this.setState({ menuOpen: true })
    else this.setState({ menuOpen: false })
  }

  componentDidMount() {
    window.addEventListener('resize', this.checkNav)
    if (window.innerWidth < 768) {
      this.setState({ menuOpen: false })
    }
    return () => {
      window.removeEventListener('resize', this.checkNav)
    }
  }

  render() {
    const { session, navigation } = this.props
    return (
      <header className="app-header w-100">
        <div className="top-header">
          <div className="container">
            <div className="d-flex justify-content-end align-items-center">
              <nav className="top-nav px-2 d-flex justify-content-center align-items-center">
                <ul role="group">
                  <NavItem href="/get-involved">Get Involved</NavItem>
                  {this.renderLogin()}
                </ul>
              </nav>
            </div>
          </div>
        </div>
        <div className="nav-bar-wrapper w-100">
          <div className="container">
            <div className="d-flex py-4 px-2 justify-content-between align-items-center">
              <div className="clearly-logo">
                <LinkContainer to={ROUTE_ROOT}>
                  <img src={logo} alt="ClearlyDefine" />
                </LinkContainer>
              </div>
              <nav className="clearly-nav d-flex justify-content-end align-items-center">
                {this.state.menuOpen && (
                  <ul role="group">
                    {/* {this.renderDocs()} */}
                    {/* {this.renderLogin()} */}
                    {this.renderNavigation(navigation, session?.isAnonymous)}
                  </ul>
                )}

                <Button
                  variant="outlined"
                  classes={{ root: 'menu-btn' }}
                  className="d-md-none d-block"
                  onClick={() => this.setState({ menuOpen: !this.state.menuOpen })}
                >
                  {this.state.menuOpen ? <CloseIcon /> : <MenuIcon />}
                </Button>
              </nav>
            </div>
          </div>
        </div>
      </header>
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
