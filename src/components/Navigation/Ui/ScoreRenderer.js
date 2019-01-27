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
      <p>Total: {score.total}</p>
      {Object.keys(score).includes('date') && <p>Date: {score.date}</p>}
      {Object.keys(score).includes('source') && <p>Source: {score.source}</p>}
      {Object.keys(score).includes('consistency') && <p>Consistency: {score.consistency}</p>}
      {Object.keys(score).includes('declared') && <p>Declared: {score.declared}</p>}
      {Object.keys(score).includes('discovered') && <p>Discovered: {score.discovered}</p>}
      {Object.keys(score).includes('spdx') && <p>Spdx: {score.spdx}</p>}
      {Object.keys(score).includes('texts') && <p>Texts: {score.texts}</p>}
    </Fragment>
  )

  renderTooltipContent = () => {
    const { domain, definition } = this.props
    if (!domain) {
      const describedScore = get(definition, 'described.score')
      const describedToolScore = get(definition, 'described.toolScore')
      const licensedScore = get(definition, 'licensed.score')
      const licensedToolScore = get(definition, 'licensed.toolScore')
      return (
        <div className="ScoreRenderer">
          <h2>Described</h2>
          <div className="ScoreRenderer__domain">
            <div className="ScoreRenderer__domain__section">
              <h2>Score</h2>
              {this.renderScore(describedScore)}
            </div>
            <div className="ScoreRenderer__domain__section">
              <h2>Toolscore:</h2>
              {this.renderScore(describedToolScore)}
            </div>
          </div>

          <h2>Licensed</h2>
          <div className="ScoreRenderer__domain">
            <div className="ScoreRenderer__domain__section">
              <h2>Score</h2>
              {this.renderScore(licensedScore)}
            </div>
            <div className="ScoreRenderer__domain__section">
              <h2>Toolscore</h2>
              {this.renderScore(licensedToolScore)}
            </div>
          </div>
        </div>
      )
    } else {
      return (
        <div className="ScoreRenderer">
          <div className="ScoreRenderer__domain">
            <div className="ScoreRenderer__domain__section">
              <h2>Score</h2>
              {this.renderScore(get(domain, 'score'))}
            </div>
            <div className="ScoreRenderer__domain__section">
              <h2>Toolscore:</h2>
              {this.renderScore(get(domain, 'toolScore'))}
            </div>
          </div>
        </div>
      )
    }
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
              ? getBadgeUrl(get(domain, 'toolScore.total'), get(domain, 'score.total'))
              : getBadgeUrl(scores.tool, scores.effective)
          }
          alt="score"
        />
      </Tooltip>
    )
  }
}

export default ScoreRenderer
