import React, { Component, Fragment } from 'react'
import PropTypes from 'prop-types'
import get from 'lodash/get'
import Tooltip from 'antd/lib/tooltip'
import { getBadgeUrl } from '../../../api/clearlyDefined'

/**
 * Renders a badge image, with a tooltip containing all the details about the score
 */

class ScoreRenderer extends Component {
  static propTypes = {
    score: PropTypes.object,
    domain: PropTypes.object,
    definition: PropTypes.object
  }

  renderScore = score => (
    <Fragment>
      {Object.keys(score).includes('date') && <p>Date: {score.date}</p>}
      {Object.keys(score).includes('source') && <p>Source: {score.source}</p>}
      {Object.keys(score).includes('consistency') && <p>Consistency: {score.consistency}</p>}
      {Object.keys(score).includes('declared') && <p>Declared: {score.declared}</p>}
      {Object.keys(score).includes('discovered') && <p>Discovered: {score.discovered}</p>}
      {Object.keys(score).includes('spdx') && <p>SPDX: {score.spdx}</p>}
      {Object.keys(score).includes('texts') && <p>License Texts: {score.texts}</p>}
    </Fragment>
  )

  renderTooltipContent = () => {
    const { domain, definition, scores } = this.props
    if (!domain) {
      const describedScore = get(definition, 'described.score')
      const describedToolScore = get(definition, 'described.toolScore')
      const licensedScore = get(definition, 'licensed.score')
      const licensedToolScore = get(definition, 'licensed.toolScore')
      return (
        <div className="ScoreRenderer">
          <h2>Overall</h2>
          {this.renderScores(scores.effective, scores.tool)}

          <h2>Described</h2>
          {this.renderScores(describedScore, describedToolScore)}

          <h2>Licensed</h2>
          {this.renderScores(licensedScore, licensedToolScore)}
        </div>
      )
    } else {
      return <div className="ScoreRenderer">{this.renderScores(get(domain, 'score'), get(domain, 'toolScore'))}</div>
    }
  }

  renderScores(effective, tools) {
    return (
      <div className="ScoreRenderer__domain">
        <div className="ScoreRenderer__domain__section">
          <h2>{`Effective: ${effective.total || effective}`}</h2>
          {this.renderScore(effective)}
        </div>
        <div className="ScoreRenderer__domain__section">
          <h2>{`Tools: ${tools.total || tools}`}</h2>
          {this.renderScore(tools)}
        </div>
      </div>
    )
  }

  render() {
    const { domain, scores } = this.props
    if (!domain && !scores) return null
    console.log(JSON.stringify(this.props.domain))
    return (
      <Tooltip title={this.renderTooltipContent} key={this.renderTooltipContent} overlayStyle={{ width: '800px' }}>
        <img
          className="list-buttons"
          src={
            domain
              ? getBadgeUrl(get(domain, 'score.total'), get(domain, 'toolScore.total'))
              : getBadgeUrl(scores.effective, scores.tool)
          }
          alt="score"
        />
      </Tooltip>
    )
  }
}

export default ScoreRenderer
