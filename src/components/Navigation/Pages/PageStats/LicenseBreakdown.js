// Copyright (c) Microsoft Corporation and others. Licensed under the MIT license.
// SPDX-License-Identifier: MIT

import React, { Component } from 'react'
import { Row, Col } from 'react-bootstrap'
import { Bar, BarChart, CartesianGrid, Cell, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import { primaryColor, secondaryColor, describedColor, secureColor } from '../../../Clearly'
const colors = [primaryColor.color, secondaryColor.color, describedColor.color, secureColor.color]

export default class LicenseBreakdown extends Component {
  static defaultProps = {
    stats: {
      totalCount: 0,
      declaredLicenseBreakdown: []
    }
  }

  render() {
    const { stats } = this.props

    return (
      <Row>
        <Col md={6}>
          <table style={{ margin: '60px' }}>
            <tbody>
              {stats.declaredLicenseBreakdown.map((entry, index) => {
                return (
                  <tr key={index}>
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
                    <td width="250">
                      <h4>{entry.value}</h4>
                    </td>
                    <td>
                      <h4>{((entry.count * 100) / stats.totalCount).toFixed(2)}%</h4>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </Col>
        <Col md={6}>
          <ResponsiveContainer height={500}>
            <BarChart
              width={900}
              height={260}
              data={stats.declaredLicenseBreakdown}
              margin={{ top: 5, right: 0, left: 0, bottom: 25 }}
            >
              <XAxis dataKey="value" tickSize={10} dy={5} />
              <YAxis hide />
              <Tooltip />
              <CartesianGrid vertical={false} stroke="#ebf3f0" />
              <Bar dataKey="count" barSize={170}>
                {stats.declaredLicenseBreakdown.map((entry, index) => (
                  <Cell fill={colors[index % colors.length]} key={index} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </Col>
      </Row>
    )
  }
}
