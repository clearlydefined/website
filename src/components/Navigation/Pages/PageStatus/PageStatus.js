// Copyright (c) Microsoft Corporation and others. Licensed under the MIT license.
// SPDX-License-Identifier: MIT

import React, { Component } from 'react'
import { Grid, Row, Col, Table } from 'react-bootstrap'
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis
} from 'recharts'
import { primaryColor, secondaryColor, describedColor, secureColor } from '../../../Clearly'
import { getStatus } from '../../../../api/clearlyDefined'

const colors = [primaryColor.color, secondaryColor.color, describedColor.color, secureColor.color]

export default class PageStatus extends Component {
  constructor(props) {
    super(props)
    this.state = {
      loaded: false,
      requestsPerDay: [],
      definitionAvailability: [],
      crawledPerDay: [],
      recentlyCrawled: []
    }
  }

  async componentDidMount() {
    const data = await Promise.all([
      this.fetchRequestsPerDay(),
      this.fetchDefinitionAvailability(),
      this.fetchCrawledPerDay(),
      this.fetchRecentlyCrawled()
    ])
    this.setState({
      loaded: true,
      requestsPerDay: data[0],
      definitionAvailability: data[1],
      crawledPerDay: data[2],
      recentlyCrawled: data[3]
    })
  }

  async fetchRequestsPerDay() {
    const data = await getStatus('requestcount')
    return Object.keys(data).map(date => {
      return { date: new Date(date).toLocaleDateString(), count: data[date] }
    })
  }

  async fetchDefinitionAvailability() {
    const data = await getStatus('definitionavailability')
    return Object.keys(data).map(name => {
      return { name, value: data[name] }
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
              <Col md={6}>
                <h2>Definition availability</h2>
                {this.renderDefinitionAvailabilityTable()}
              </Col>
              <Col md={6}>{this.renderDefinitionAvailabilityChart()}</Col>
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
          <Line type="monotone" dataKey="count" stroke={colors[0]} />
        </LineChart>
      </ResponsiveContainer>
    )
  }

  renderDefinitionAvailabilityTable() {
    return (
      <table style={{ margin: '60px' }}>
        <tbody>
          {this.state.definitionAvailability.map((entry, index) => {
            return (
              <tr>
                <td>
                  <span
                    style={{
                      backgroundColor: colors[index % colors.length],
                      height: '20px',
                      width: '20px',
                      marginRight: '10px',
                      display: 'inline-block'
                    }}
                  />
                </td>
                <td>
                  <h3>{entry.name}</h3>
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
    )
  }

  renderDefinitionAvailabilityChart() {
    return (
      <ResponsiveContainer height={500}>
        <PieChart>
          <Pie
            nameKey="name"
            dataKey="value"
            data={this.state.definitionAvailability}
            labelLine={false}
            label={this.renderPieLabel}
            outerRadius={200}
            fill="#8884d8"
          >
            {this.state.definitionAvailability.map((entry, index) => (
              <Cell fill={colors[index % colors.length]} />
            ))}
          </Pie>
        </PieChart>
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
              return <Bar dataKey={host} fill={colors[index % colors.length]} stackId="a" />
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
                <tr>
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
