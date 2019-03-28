import React, { Component } from 'react'
import PropTypes from 'prop-types'
import LabelRenderer from '../Ui/LabelRenderer'
import { ROUTE_CURATIONS } from '../../../utils/routingConstants'
import CurationRenderer from '../Ui/CurationRenderer'
import get from 'lodash/get'

class CurationsSection extends Component {
  static propTypes = {
    curations: PropTypes.object,
    contributions: PropTypes.array,
    // Callback function called when expanding a curation
    onClick: PropTypes.func
  }

  goToCuration = id => {
    const win = window.open(`${ROUTE_CURATIONS}/${id}`, '_blank')
    win.focus()
  }

  render() {
    const { curations } = this.props
    const contributions = get(curations, 'item.contributions')
    return (
      <div>
        <LabelRenderer text={'Curations'} />
        {curations.isFetched && (
          <div className="curationSection">
            {contributions ? (
              contributions.map(contribution => (
                <CurationRenderer
                  key={`curation-${contribution.pr.number}`}
                  contribution={contribution}
                  onClick={this.goToCuration}
                />
              ))
            ) : (
              <p>No curations found for this component</p>
            )}
          </div>
        )}
      </div>
    )
  }
}

export default CurationsSection
