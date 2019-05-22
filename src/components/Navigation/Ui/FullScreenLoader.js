import React, { Component } from 'react'
import ReactDOM from 'react-dom'
import { Spin, Icon } from 'antd'
import { connect } from 'react-redux'
import { getLoadingStatus } from '../../../reducers/loaderReducer'

export class FullScreenLoader extends Component {
  render() {
    const { loadingStatus } = this.props
    return loadingStatus
      ? ReactDOM.createPortal(
          <div className="fullscreen-loader">
            <Spin indicator={<Icon type="loading" style={{ fontSize: 80 }} spin />} />
          </div>,
          document.body
        )
      : null
  }
}

const mapStateToProps = state => ({
  loadingStatus: getLoadingStatus(state)
})

export default connect(mapStateToProps)(FullScreenLoader)
