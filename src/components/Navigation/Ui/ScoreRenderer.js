import React, { Component, Fragment } from 'react'
import PropTypes from 'prop-types'
import get from 'lodash/get'
import isNumber from 'lodash/isNumber'
import Tooltip from 'antd/lib/tooltip'
import { getBadgeUrl } from '../../../api/clearlyDefined'

const maxScores = {
  date: 30,
  source: 70,
  consistency: 15,
  declared: 30,
  discovered: 25,
  spdx: 15,
  texts: 15
}

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
      {this.renderScoreEntry(score, 'date', 'Date')}
      {this.renderScoreEntry(score, 'source', 'Source')}
      {this.renderScoreEntry(score, 'consistency', 'Consistency')}
      {this.renderScoreEntry(score, 'declared', 'Declared')}
      {this.renderScoreEntry(score, 'discovered', 'Discovered')}
      {this.renderScoreEntry(score, 'spdx', 'SPDX')}
      {this.renderScoreEntry(score, 'textes', 'License texts')}
    </Fragment>
  )

  renderScoreEntry(score, name, label) {
    if (!Object.keys(score).includes(name)) return
    const value = score[name] / maxScores[name]
    const colors = ['red', 'yellow', 'inherit']
    const bucket = Math.floor(value * colors.length)
    const color = colors[Math.min(colors.length - 1, bucket)]
    return (
      <p style={{ color, fontWeight: color === 'inherit' ? 'inherit' : 800 }}>
        {label}: {score[name]}
      </p>
    )
  }

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
          <h2>{`Effective: ${isNumber(effective.total) ? effective.total : effective}`}</h2>
          {this.renderScore(effective)}
        </div>
        <div className="ScoreRenderer__domain__section">
          <h2>{`Tools: ${isNumber(tools.total) ? tools.total : tools}`}</h2>
          {this.renderScore(tools)}
        </div>
      </div>
    )
  }

  render() {
    const { domain, scores } = this.props
    if (!domain && !scores) return null
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
