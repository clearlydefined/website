import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Tag } from 'antd'
import { get } from 'lodash'
import { Button, ButtonGroup } from 'react-bootstrap'
import { Menu, Dropdown, Icon } from 'antd'
import { CopyUrlButton } from '../../'
import EntitySpec from '../../../utils/entitySpec'
import Definition from '../../../utils/definition'
import { getBadgeUrl } from '../../../api/clearlyDefined'
import { ROUTE_DEFINITIONS } from '../../../utils/routingConstants'
import ButtonWithTooltip from './ButtonWithTooltip'

export default class ComponentButtons extends Component {
  static propTypes = {
    definitions: PropTypes.object,
    currentComponent: PropTypes.object,
    readOnly: PropTypes.bool,
    hasChange: PropTypes.func,
    onAddComponent: PropTypes.func,
    onInspect: PropTypes.func,
    onRemove: PropTypes.func,
    onRevert: PropTypes.func
  }

  constructor(props) {
    super(props)
  }

  isSourceComponent(component) {
    return ['github', 'sourcearchive'].includes(component.provider)
  }

  removeComponent(component, event) {
    event.stopPropagation()
    const { onRemove } = this.props
    onRemove && onRemove(component)
  }

  revertComponent(component, param) {
    const { onRevert } = this.props
    onRevert && onRevert(component, param)
  }

  inspectComponent(component, definition, event) {
    event.stopPropagation()
    const action = this.props.onInspect
    action && action(component, definition)
  }

  addSourceForComponent(component, event) {
    event.stopPropagation()
    const definition = this.props.getDefinition(component)
    const sourceLocation = get(definition, 'described.sourceLocation')
    const sourceEntity = sourceLocation && EntitySpec.fromCoordinates(sourceLocation)
    const action = this.props.onAddComponent
    action && sourceEntity && action(sourceEntity, component)
  }

  render() {
    const { definition, currentComponent, readOnly, hasChange, showVersionSelectorPopup } = this.props
    const component = EntitySpec.fromCoordinates(currentComponent)
    const isSourceComponent = this.isSourceComponent(component)
    const scores = Definition.computeScores(definition)
    const isDefinitionEmpty = Definition.isDefinitionEmpty(definition)
    const isSourceEmpty = Definition.isSourceEmpty(definition)
    const isCurated = Definition.isCurated(definition)
    const hasPendingCurations = Definition.hasPendingCurations(definition)
    return (
      <div className="list-activity-area">
        {scores && <img className="list-buttons" src={getBadgeUrl(scores.tool, scores.effective)} alt="score" />}
        {isCurated && <Tag color="green">Curated</Tag>}
        {hasPendingCurations && <Tag color="gold">Pending Curations</Tag>}
        <ButtonGroup>
          {!isSourceComponent &&
            !readOnly &&
            !isSourceEmpty && (
              <ButtonWithTooltip
                name="addSourceComponent"
                tip={'Add the definition for source that matches this package'}
                button={
                  <Button className="list-fa-button" onClick={this.addSourceForComponent.bind(this, component)}>
                    <i className="fas fa-code" />
                  </Button>
                }
              />
            )}
          {!isDefinitionEmpty && (
            <ButtonWithTooltip
              tip={'Dig into this definition'}
              button={
                <Button
                  className="list-fa-button"
                  onClick={this.inspectComponent.bind(this, currentComponent, definition)}
                >
                  <i className="fas fa-search" />
                </Button>
              }
            />
          )}
          <CopyUrlButton
            route={ROUTE_DEFINITIONS}
            path={component.toPath()}
            bsStyle="default"
            className="list-fa-button"
          />
          <ButtonWithTooltip
            tip={'Switch or add other versions of this definition'}
            button={
              <Dropdown
                overlay={
                  <Menu>
                    <Menu.Item onClick={() => showVersionSelectorPopup(currentComponent, false)}>
                      Switch Version
                    </Menu.Item>
                    <Menu.Item onClick={() => showVersionSelectorPopup(currentComponent, true)}>
                      Add more Versions
                    </Menu.Item>
                  </Menu>
                }
              >
                <Button className="list-fa-button">
                  <i className="fas fa-exchange-alt" /> <Icon type="down" />
                </Button>
              </Dropdown>
            }
          />
          {!readOnly &&
            !isDefinitionEmpty && (
              <ButtonWithTooltip
                tip={'Revert Changes of this Definition'}
                button={
                  <Button
                    className="list-fa-button"
                    onClick={() => this.revertComponent(component)}
                    disabled={!hasChange(component)}
                  >
                    <i className="fas fa-undo" />
                  </Button>
                }
              />
            )}
        </ButtonGroup>
        {!readOnly && (
          <Button bsStyle="link" onClick={this.removeComponent.bind(this, component)}>
            <i className="fas fa-times list-remove" />
          </Button>
        )}
      </div>
    )
  }
}
