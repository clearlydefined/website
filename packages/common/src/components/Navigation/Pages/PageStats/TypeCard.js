import React, { Component } from 'react'
import { UserCard } from 'react-ui-cards'
import { getStats } from '../../../../api/clearlyDefined'

export default class TypeCard extends Component {
  constructor(props) {
    super(props)
    this.state = {
      totalCount: 0,
      averageLicensed: 0,
      averageDescribed: 0
    }
  }

  async componentDidMount() {
    const data = await getStats(this.props.type)
    if (!data.value) return
    this.setState({
      totalCount: data.value.totalcount,
      averageLicensed: Math.round(data.value['avg_licensed.score.total'] * 100) / 100,
      averageDescribed: Math.round(data.value['avg_described.score.total'] * 100) / 100
    })
  }

  render() {
    return (
      <UserCard
        cardClass="float"
        header={this.props.image}
        name={this.props.type}
        positionName={`total count: ${this.state.totalCount}`}
        stats={[
          {
            name: 'average licensed score',
            value: this.state.averageLicensed
          },
          {
            name: 'average described score',
            value: this.state.averageDescribed
          }
        ]}
      />
    )
  }
}
