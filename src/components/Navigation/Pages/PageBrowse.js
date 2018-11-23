import React from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { uiNavigation } from '../../../actions/ui'
import { ROUTE_BROWSE } from '../../../utils/routingConstants'
import AbstractPageDefinitions from '../../AbstractPageDefinitions'

class PageBrowse extends AbstractPageDefinitions {
  constructor(props) {
    super(props)
  }

  componentDidMount() {
    uiNavigation({ to: ROUTE_BROWSE })
  }
}

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
