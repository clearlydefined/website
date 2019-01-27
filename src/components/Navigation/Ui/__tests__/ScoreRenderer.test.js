import React from 'react'
import { shallow } from 'enzyme'
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
    shallow(<ScoreRenderer />)
  })
  it('renders with scores and definition', () => {
    shallow(<ScoreRenderer scores={scores} definition={definition} />)
  })
  it('renders with domain', () => {
    shallow(<ScoreRenderer domain={domain} />)
  })
})
