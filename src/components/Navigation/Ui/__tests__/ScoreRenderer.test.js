import React from 'react'
import { render } from '@testing-library/react'
import ScoreRenderer from '../ScoreRenderer'

const definition = {
  described: {
    toolScore: { total: 100, date: 30, source: 70 },
    score: { total: 100, date: 30, source: 70 }
  },
  licensed: {
    toolScore: { total: 68, declared: 30, discovered: 8, consistency: 15, spdx: 15, texts: 0 },
    score: { total: 53, declared: 30, discovered: 8, consistency: 0, spdx: 15, texts: 0 }
  }
}

const scores = { tool: 84, effective: 77 }

const domain = {
  toolScore: { total: 100, date: 30, source: 70 },
  score: { total: 100, date: 30, source: 70 }
}

describe('ScoreRenderer', () => {
  it('renders without crashing', () => {
    render(<ScoreRenderer />)
  })

  it('renders with scores and definition', () => {
    render(<ScoreRenderer scores={scores} definition={definition} />)
  })

  it('renders with domain', () => {
    render(<ScoreRenderer domain={domain} />)
  })

  it('renders with 0 scores', () => {
    const customDefinition = {
      described: {
        toolScore: { total: 30, date: 30, source: 0 },
        score: { total: 30, date: 30, source: 0 }
      },
      licensed: {
        toolScore: { total: 0, declared: 0, discovered: 0, consistency: 0, spdx: 0, texts: 0 },
        score: { total: 0, declared: 0, discovered: 0, consistency: 0, spdx: 0, texts: 0 }
      }
    }
    render(<ScoreRenderer scores={scores} definition={customDefinition} />)
  })
})
