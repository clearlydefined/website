import React, { Component } from 'react'
import { Dropdown, Menu } from 'antd'
import { Button } from 'react-bootstrap'
import get from 'lodash/get'
import CopyUrlButton from '../../CopyUrlButton'
import ButtonWithTooltip from '../Ui/ButtonWithTooltip'
import { ROUTE_DEFINITIONS } from '../../../utils/routingConstants'
import EntitySpec from '../../../utils/entitySpec'
import Definition from '../../../utils/definition'

class ComponentDetailsButtons extends Component {
  constructor(props) {
    super(props)
    this.copyUrlButton = React.createRef()
  }

  isSourceComponent(component) {
    return ['github', 'sourcearchive'].includes(component.provider)
  }

  openSourceForComponent = definition => {
    const sourceLocation = get(definition, 'described.sourceLocation')
    const sourceEntity = sourceLocation && EntitySpec.fromObject(sourceLocation)
    const path = `${ROUTE_DEFINITIONS}/${EntitySpec.fromObject(sourceEntity).toPath()}`
    window.open(`${window.location.origin}${path}`)
  }
  render() {
    const { item } = this.props
    const isSourceComponent = this.isSourceComponent(item.coordinates)
    const isSourceEmpty = Definition.isSourceEmpty(item)
    const menu = (
      <Menu>
        <Menu.Item key="1" onClick={() => this.copyUrlButton.current.onCopy()}>
          Copy Component Url{' '}
          <CopyUrlButton
            ref={this.copyUrlButton}
            className="list-fa-button"
            path={`${ROUTE_DEFINITIONS}/${EntitySpec.fromObject(get(item, 'coordinates')).toPath()}`}
          />
        </Menu.Item>
        {!isSourceComponent && !isSourceEmpty && (
          <Menu.Item key="2" onClick={() => this.openSourceForComponent(item)}>
            Open Source Definition{' '}
            <ButtonWithTooltip tip="Open the definition for source that matches this package" placement="bottom">
              <Button className="list-fa-button">
                <i className="fas fa-code" />
              </Button>
            </ButtonWithTooltip>
          </Menu.Item>
        )}
        <Menu.Item key="3">
          List other version of this component{' '}
          <Button className="list-fa-button">
            <i class="fas fa-list" />
          </Button>
        </Menu.Item>
      </Menu>
    )
    return (
      <Dropdown overlay={menu} trigger="hover">
        <Button bsStyle="info">
          <i class="fas fa-ellipsis-v" />
        </Button>
      </Dropdown>
    )
  }
}

export default ComponentDetailsButtons
