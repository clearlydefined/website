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
      requestsPerDay: [],
      definitionAvailability: [],
      crawledPerDay: [],
      recentlyCrawled: []
    }
  }

  async componentDidMount() {
    const requestsPerDayData = await getStatus('requestcount')
    const requestsPerDay = Object.keys(requestsPerDayData).map(date => {
      return { date: new Date(date).toLocaleDateString(), count: requestsPerDayData[date] }
    })

    const definitionAvailabilityData = await getStatus('definitionavailability')
    const definitionAvailability = Object.keys(definitionAvailabilityData).map(name => {
      return { name, value: definitionAvailabilityData[name] }
    })

    const crawledPerDayData = await getStatus('processedperday')
    const crawledPerDay = crawledPerDayData.map(entry => {
      entry.date = new Date(entry.date).toLocaleDateString()
      return entry
    })

    const recentlyCrawledData = await getStatus('recentlycrawled')
    const recentlyCrawled = recentlyCrawledData.map(entry => {
      entry.timestamp = new Date(entry.timestamp).toLocaleString()
      return entry
    })

    this.setState({ requestsPerDay, definitionAvailability, crawledPerDay, recentlyCrawled })
  }

  render() {
    return (
      <Grid className="main-container">
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
      <table>
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
            label
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
