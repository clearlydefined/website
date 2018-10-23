import React, { Component } from 'react'
import PropTypes from 'prop-types'
import Collapse from 'antd/lib/collapse'
import isEqual from 'lodash/isEqual'
import CurationRenderer from './CurationRenderer'
import RawDataRenderer from './RawDataRenderer'

const Panel = Collapse.Panel
class CurationData extends Component {
  static propTypes = {
    curations: PropTypes.array,
    onChange: PropTypes.func
  }

  constructor(props) {
    super(props)
    this.state = {
      curationsData: {},
      activeCuration: {}
    }
  }

  componentDidUpdate() {
    const { curationsData, requestedPr } = this.state
    if (!isEqual(this.state.activeCuration, this.props.inspectedCuration))
      this.setState({
        activeCuration: this.props.inspectedCuration,
        curationsData: { ...curationsData, [requestedPr]: this.props.inspectedCuration }
      })
  }

  onChange = value => {
    const { onChange } = this.props
    const { curationsData } = this.state
    if (curationsData[value]) this.setState({ activeCuration: curationsData[value] })
    else this.setState({ requestedPr: value }, () => onChange(value))
  }

  render() {
    const { curations } = this.props
    const { activeCuration } = this.state
    return (
      <div style={{ height: '400px', overflowY: 'auto' }}>
        {curations ? (
          <Collapse bordered={false} accordion onChange={this.onChange}>
            {curations.map(curation => (
              <Panel key={curation.number} header={<CurationRenderer curation={curation} />}>
                <RawDataRenderer value={activeCuration} name={'Curations'} type={'json'} />
              </Panel>
            ))}
          </Collapse>
        ) : (
          <p>No curations found for this component</p>
        )}
      </div>
    )
  }
}

export default CurationData
