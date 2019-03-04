import React, { Component } from 'react'
import PropTypes from 'prop-types'
import Button from 'antd/lib/button'
import Dropdown from 'antd/lib/dropdown'
import Icon from 'antd/lib/icon'
import Menu from 'antd/lib/menu'

const { Item } = Menu

export default class ShareButton extends Component {
  static propTypes = {
    components: PropTypes.object,
    onSelect: PropTypes.func.isRequired
  }

  render() {
    const { components, onSelect } = this.props
    return (
      <Dropdown
        trigger={['click', 'hover']}
        disabled={!components || components.list.length === 0}
        overlay={
          <Menu onClick={onSelect}>
            <Item eventKey="1" key="url">
              URL
            </Item>
            <Item eventKey="2" key="file">
              Coordinate list (JSON)
            </Item>
            <Item eventKey="3" key="notice">
              Notice file
            </Item>
            <Menu.Divider />
            <Item disabled eventKey="4">
              Gist
            </Item>
            <Item disabled>Definitions (Not implemented)</Item>
            <Item disabled>SPDX (Not implemented)</Item>
          </Menu>
        }
      >
        <Button type="primary">
          Share <Icon type="down" />
        </Button>
      </Dropdown>
    )
  }
}
