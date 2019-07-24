import React, { Component, Fragment } from 'react'
import PropTypes from 'prop-types'
import get from 'lodash/get'
import isNumber from 'lodash/isNumber'
import Tooltip from 'antd/lib/tooltip'
import { Tag } from 'antd'

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
      {this.renderScoreEntry(score, 'texts', 'License texts')}
    </Fragment>
  )

  getColor(score, topScore = 100, customColors) {
    const colors = customColors || ['#cb2431', '#d6af22', '#2cbe4e']
    const percentScore = score / topScore
    const bucket = Math.floor(percentScore * colors.length)
    return colors[Math.min(colors.length - 1, bucket)]
  }

  renderScoreEntry(score, name, label) {
    if (!Object.keys(score).includes(name)) return
    const color = this.getColor(score[name], maxScores[name] || 100, ['#d6af22', '#2cbe4e'])
    return (
      <p style={{ color }}>
        {label}: {score[name]}
        {this.renderUnit(maxScores[name])}
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
          {this.renderScoreInfo()}
        </div>
      )
    } else {
      return (
        <div className="ScoreRenderer">
          {this.renderScores(get(domain, 'score'), get(domain, 'toolScore'))} {this.renderScoreInfo()}
        </div>
      )
    }
  }

  renderScores(effective, tools) {
    return (
      <div className="ScoreRenderer__domain">
        <div className="ScoreRenderer__domain__section">
          <h2>
            {`Effective: ${isNumber(effective.total) ? effective.total : effective}`}
            {this.renderUnit()}
          </h2>
          {this.renderScore(effective)}
        </div>
        <div className="ScoreRenderer__domain__section">
          <h2>
            {`Tools: ${isNumber(tools.total) ? tools.total : tools}`}
            {this.renderUnit()}
          </h2>
          {this.renderScore(tools)}
        </div>
      </div>
    )
  }

  renderUnit = maxScore => <span>{`/${maxScore || 100}`}</span>

  renderScoreInfo = () => (
    <div className="ScoreInfo">
      <a
        href="https://github.com/clearlydefined/license-score/blob/master/ClearlyLicensedMetrics.md#clearlylicensed-scoring-formula"
        target="_blank"
        rel="noopener noreferrer"
      >
        Scoring Formula
      </a>
    </div>
  )

  render() {
    const { domain, scores } = this.props
    if (!domain && !scores) return null
    return (
      <Tooltip title={this.renderTooltipContent} key={this.renderTooltipContent} overlayStyle={{ width: '800px' }}>
        {domain ? (
          <Tag className="cd-badge" color={this.getColor(get(domain, 'score.total'))}>
            {get(domain, 'score.total')}
          </Tag>
        ) : (
          <Tag className="cd-badge" color={this.getColor(scores.effective)}>
            {scores.effective}
          </Tag>
        )}
      </Tooltip>
    )
  }
}

export default ScoreRenderer
