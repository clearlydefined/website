import React, { Component } from 'react'
import { Dropdown, Menu } from 'antd'
import { Button } from 'react-bootstrap'
import get from 'lodash/get'
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
    return ['github', 'sourcearchive', 'debsrc'].includes(component.provider)
  }

  openSourceForComponent = definition => {
    const sourceLocation = get(definition, 'described.sourceLocation')
    const sourceEntity = sourceLocation && EntitySpec.fromObject(sourceLocation)
    const path = `${ROUTE_DEFINITIONS}/${EntitySpec.fromObject(sourceEntity).toPath()}`
    window.open(`${window.location.origin}${path}`)
  }

  openRelatedComponents = definition => {
    const path = `/?type=${get(definition, 'coordinates.type')}&name=${get(
      definition,
      'coordinates.name'
    )}&sortDesc=true&sort=releaseDate`
    window.open(`${window.location.origin}${path}`)
  }

  renderUrl() {
    const { item } = this.props
    return `${window.location.origin}${ROUTE_DEFINITIONS}/${EntitySpec.fromObject(get(item, 'coordinates')).toPath()}`
  }

  copyToClipboard = str => {
    const el = document.createElement('textarea')
    el.value = str
    el.setAttribute('readonly', '')
    el.style.position = 'absolute'
    el.style.left = '-9999px'
    document.body.appendChild(el)
    const selected = document.getSelection().rangeCount > 0 ? document.getSelection().getRangeAt(0) : false
    el.select()
    document.execCommand('copy')
    document.body.removeChild(el)
    if (selected) {
      document.getSelection().removeAllRanges()
      document.getSelection().addRange(selected)
    }
  }

  openRegistryURL = item => {
    window.open(get(item, 'described.urls.registry'))
  }

  render() {
    const { item } = this.props
    const isSourceComponent = this.isSourceComponent(item.coordinates)
    const isSourceEmpty = Definition.isSourceEmpty(item)
    const menu = (
      <Menu>
        <Menu.Item key="1" onClick={() => this.copyToClipboard(this.renderUrl())}>
          Copy component URL{' '}
          <ButtonWithTooltip tip="Copy URL to clipboard" placement="bottom">
            <Button className="list-fa-button">
              <i className="fas fa-copy" />
            </Button>
          </ButtonWithTooltip>
        </Menu.Item>
        {!isSourceComponent && !isSourceEmpty && (
          <Menu.Item key="2" onClick={() => this.openSourceForComponent(item)}>
            Open the definition for source{' '}
            <ButtonWithTooltip tip="Open the definition for source that matches this package" placement="bottom">
              <Button className="list-fa-button">
                <i className="fas fa-code" />
              </Button>
            </ButtonWithTooltip>
          </Menu.Item>
        )}
        <Menu.Item key="3" onClick={() => this.openRelatedComponents(item)}>
          List other versions of this component{' '}
          <Button className="list-fa-button">
            <i class="fas fa-list" />
          </Button>
        </Menu.Item>
        <Menu.Item key="4" onClick={() => this.openRegistryURL(item)}>
          Open package URL{' '}
          <ButtonWithTooltip tip="Open package URL" placement="bottom">
            <Button className="list-fa-button">
              <i className="fas fa-external-link-alt" />
            </Button>
          </ButtonWithTooltip>
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
