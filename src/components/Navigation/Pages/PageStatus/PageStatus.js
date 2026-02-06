// Copyright (c) Microsoft Corporation and others. Licensed under the MIT license.
// SPDX-License-Identifier: MIT

import React, { Component } from 'react'
import { Grid, Row, Table } from 'react-bootstrap'
import ColorScheme from 'color-scheme'
import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis
} from 'recharts'
import { getStatus } from '../../../../api/clearlyDefined'

const scheme = new ColorScheme()
scheme
  .from_hex('0064b5')
  .scheme('analogic')
  .variation('default')
const colors = scheme.colors()

export default class PageStatus extends Component {
  constructor(props) {
    super(props)
    this.state = {
      loaded: false,
      requestsPerDay: [],
      crawledPerDay: [],
      recentlyCrawled: []
    }
  }

  async componentDidMount() {
    const data = await Promise.all([
      this.fetchRequestsPerDay(),
      this.fetchCrawledPerDay(),
      this.fetchRecentlyCrawled(),
      this.fetchCrawlbreakdown(),
      this.fetchToolsRanPerDay()
    ])
    this.setState({
      loaded: true,
      requestsPerDay: data[0],
      crawledPerDay: data[1],
      recentlyCrawled: data[2],
      crawlbreakdown: data[3],
      toolsRanPerDay: data[4]
    })
  }

  async fetchRequestsPerDay() {
    const data = await getStatus('requestcount')
    return Object.keys(data).map(date => {
      return { date: new Date(date).toLocaleDateString(), count: data[date] }
    })
  }

  async fetchCrawledPerDay() {
    const data = await getStatus('processedperday')
    return data.map(entry => {
      entry.date = new Date(entry.date).toLocaleDateString()
      return entry
    })
  }

  async fetchRecentlyCrawled() {
    const data = await getStatus('recentlycrawled')
    return data.map(entry => {
      entry.timestamp = new Date(entry.timestamp).toLocaleString()
      return entry
    })
  }

  async fetchCrawlbreakdown() {
    const data = await getStatus('crawlbreakdown')
    return data.map(entry => {
      entry.date = new Date(entry.date).toLocaleDateString()
      return entry
    })
  }

  async fetchToolsRanPerDay() {
    const data = await getStatus('toolsranperday')
    return data.map(entry => {
      entry.date = new Date(entry.date).toLocaleDateString()
      return entry
    })
  }

  render() {
    return (
      <Grid className="main-container">
        {!this.state.loaded && (
          <h2>
            <i className="fas fa-spinner fa-spin" />
          </h2>
        )}
        {this.state.loaded && (
          <div>
            <Row>
              <h2>Requests / day</h2>
              {this.renderRequestsPerDay()}
            </Row>
            <hr />
            <Row>
              <h2>Components processed / day</h2>
              {this.renderComponentsProcessed()}
            </Row>
            <hr />
            <Row>
              <h2>Recently crawled components</h2>
              {this.renderRecentlyCrawled()}
            </Row>
            <hr />
            <Row>
              <h2>Types processed / day</h2>
              {this.renderCrawlbreakdown()}
            </Row>
            <hr />
            <Row>
              <h2>Tools ran per day</h2>
              {this.renderToolsRanPerDay()}
            </Row>
          </div>
        )}
      </Grid>
    )
  }

  renderRequestsPerDay() {
    return (
      <ResponsiveContainer height={500}>
        <LineChart data={this.state.requestsPerDay}>
          <XAxis dataKey="date" />
          <YAxis />
          <Tooltip />
          <Line type="monotone" dataKey="count" stroke={`#${colors[0]}`} />
        </LineChart>
      </ResponsiveContainer>
    )
  }

  renderComponentsProcessed() {
    return (
      <ResponsiveContainer height={500}>
        <BarChart data={this.state.crawledPerDay}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" />
          <YAxis />
          <Tooltip />
          <Legend />
          {Object.keys(
            this.state.crawledPerDay.reduce((result, entry) => {
              Object.keys(entry).forEach(x => {
                result[x] = 1
              })
              return result
            }, {})
          )
            .filter(x => x !== 'date')
            .map((host, index) => {
              return <Bar dataKey={host} key={host} fill={`#${colors[index % colors.length]}`} stackId="a" />
            })}
        </BarChart>
      </ResponsiveContainer>
    )
  }

  renderRecentlyCrawled() {
    return (
      <div>
        <Table>
          <tbody>
            {this.state.recentlyCrawled.map(entry => {
              return (
                <tr key={`${entry.timestamp}-${entry.coordinates}`}>
                  <td>{entry.timestamp}</td>
                  <td>
                    <a href={`/definitions/${entry.coordinates}`}>{entry.coordinates}</a>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </Table>
      </div>
    )
  }

  objectDeepKeys = obj => {
    return Object.keys(obj)
      .filter(key => obj[key] instanceof Object)
      .map(key => this.objectDeepKeys(obj[key]).map(k => `${key}.${k}`))
      .reduce((x, y) => x.concat(y), Object.keys(obj))
  }

  renderCrawlbreakdown() {
    const types = Object.keys(
      this.state.crawlbreakdown.reduce((result, entry) => {
        const entries = Object.keys(entry)
          .filter(key => entry[key] instanceof Object)
          .map(key => this.objectDeepKeys(entry[key]).map(k => `${key}.${k}`))
          .reduce((x, y) => x.concat(y), [])
        entries.forEach(x => {
          result[x] = 1
        })
        return result
      }, {})
    )
    return (
      <ResponsiveContainer height={500}>
        <BarChart data={this.state.crawlbreakdown}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" />
          <YAxis />
          <Tooltip />
          <Legend />
          {types.map((type, index) => {
            const tool = type.substr(0, type.indexOf('.'))
            return (
              <Bar dataKey={type} key={type} fill={`#${colors[index % colors.length]}`} stackId={tool} name={type} />
            )
          })}
        </BarChart>
      </ResponsiveContainer>
    )
  }

  renderToolsRanPerDay() {
    return (
      <ResponsiveContainer height={500}>
        <BarChart data={this.state.toolsRanPerDay}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" />
          <YAxis />
          <Tooltip />
          <Legend />
          {Object.keys(
            this.state.toolsRanPerDay.reduce((result, entry) => {
              Object.keys(entry).forEach(x => {
                result[x] = 1
              })
              return result
            }, {})
          )
            .filter(x => x !== 'date')
            .map((host, index) => {
              return <Bar dataKey={host} key={host} fill={`#${colors[index % colors.length]}`} stackId="a" />
            })}
        </BarChart>
      </ResponsiveContainer>
    )
  }

  renderPieLabel({ cx, cy, midAngle, innerRadius, outerRadius, percent }) {
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5
    const x = cx + radius * Math.cos(-midAngle * (Math.PI / 180))
    const y = cy + radius * Math.sin(-midAngle * (Math.PI / 180))

    return (
      <text x={x} y={y} fill="white" textAnchor={x > cx ? 'start' : 'end'} dominantBaseline="central">
        {`${(percent * 100).toFixed(0)}%`}
      </text>
    )
  }
}
