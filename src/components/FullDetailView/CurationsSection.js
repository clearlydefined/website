import React, { Component } from 'react'
import PropTypes from 'prop-types'
import LabelRenderer from '../Renderers/LabelRenderer'
import { ROUTE_CURATIONS } from '../../utils/routingConstants'
import CurationRenderer from '../Renderers/CurationRenderer'

class CurationsSection extends Component {
  static propTypes = {
    curations: PropTypes.array,
    onClick: PropTypes.func
  }

  goToCuration = id => {
    const win = window.open(`${ROUTE_CURATIONS}/${id}`, '_blank')
    win.focus()
  }

  render() {
    const { curations } = this.props
    return (
      <div>
        <LabelRenderer text={'Curations'} />
        <div className="curationSection">
          {curations ? (
            curations.map(curation => (
              <CurationRenderer key={`curation-${curation.number}`} curation={curation} onClick={this.goToCuration} />
            ))
          ) : (
            <p>No curations found for this component</p>
          )}
        </div>
      </div>
    )
  }
}

export default CurationsSection
