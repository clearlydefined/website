import React, { Component } from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import { uiNavigation } from '../../../actions/ui'
import { ROUTE_BROWSE } from '../../../utils/routingConstants'

class PageBrowse extends Component {
  componentDidMount() {
    uiNavigation({ to: ROUTE_BROWSE })
  }

  render() {
    return <div />
  }
}

PageBrowse.propTypes = {}

function mapStateToProps(state) {
  return {
    token: state.session.token
  }
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(
    {
      uiNavigation
    },
    dispatch
  )
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(PageBrowse)
