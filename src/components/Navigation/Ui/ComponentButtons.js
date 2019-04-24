import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { get } from 'lodash'
import { Button, ButtonGroup, ButtonToolbar, Dropdown as BSDropdown } from 'react-bootstrap'
import { Menu, Dropdown, Icon } from 'antd'
import EntitySpec from '../../../utils/entitySpec'
import Definition from '../../../utils/definition'
import { ROUTE_DEFINITIONS } from '../../../utils/routingConstants'
import { withResize } from '../../../utils/WindowProvider'
import ButtonWithTooltip from './ButtonWithTooltip'

class ComponentButtons extends Component {
  static propTypes = {
    definition: PropTypes.object,
    currentComponent: PropTypes.object,
    readOnly: PropTypes.bool,
    hasChange: PropTypes.func,
    onAddComponent: PropTypes.func,
    onInspect: PropTypes.func,
    onRemove: PropTypes.func,
    onRevert: PropTypes.func
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
    const sourceEntity = sourceLocation && EntitySpec.fromObject(sourceLocation)
    const action = this.props.onAddComponent
    action && sourceEntity && action(sourceEntity, component)
  }

  showVersionSelectorPopup(component, multiple, event) {
    event.domEvent.stopPropagation()
    this.props.showVersionSelectorPopup(component, multiple)
  }

  renderMobileButtonGroup() {
    return (
      <ButtonToolbar>
        <BSDropdown id="split-button-pull-right" onClick={event => event.stopPropagation()}>
          <BSDropdown.Toggle>
            <span className="sr-only">Toggle navigation</span>
            <span className="icon-bar" />
            <span className="icon-bar" />
            <span className="icon-bar" />
          </BSDropdown.Toggle>
          <BSDropdown.Menu className="dropdown-menu-right">{this.renderButtonGroup()}</BSDropdown.Menu>
        </BSDropdown>
      </ButtonToolbar>
    )
  }

  renderButtonGroup() {
    const { definition, currentComponent, readOnly, hasChange, hideVersionSelector } = this.props
    const component = EntitySpec.fromObject(currentComponent)
    const isSourceComponent = this.isSourceComponent(component)
    const isSourceEmpty = Definition.isSourceEmpty(definition)
    const isDefinitionEmpty = Definition.isDefinitionEmpty(definition)
    return (
      <ButtonGroup>
        {!isSourceComponent && !readOnly && !isSourceEmpty && (
          <ButtonWithTooltip tip="Add the definition for source that matches this package">
            <Button className="list-fa-button" onClick={this.addSourceForComponent.bind(this, component)}>
              <i className="fas fa-code" />
            </Button>
          </ButtonWithTooltip>
        )}
        {!isDefinitionEmpty && (
          <ButtonWithTooltip tip="Dig into this definition">
            <Button className="list-fa-button" onClick={this.inspectComponent.bind(this, currentComponent, definition)}>
              <i className="fas fa-search" />
            </Button>
          </ButtonWithTooltip>
        )}
        <a
          href={`${window.location.origin}${ROUTE_DEFINITIONS}/${component.toPath()}`}
          className="list-fa-button"
          target="_blank"
          rel="noopener noreferrer"
          onClick={event => event.stopPropagation()}
        >
          <i className="fas fa-external-link-alt" />
        </a>
        {!hideVersionSelector && (
          <ButtonWithTooltip tip="Switch or add other versions of this definition">
            <>
              <Dropdown
                trigger={['click']}
                overlay={
                  <Menu>
                    <Menu.Item
                      data-test-id="switch-component-version"
                      onClick={this.showVersionSelectorPopup.bind(this, currentComponent, false)}
                    >
                      Switch version
                    </Menu.Item>
                    <Menu.Item
                      data-test-id="add-component-version"
                      onClick={this.showVersionSelectorPopup.bind(this, currentComponent, true)}
                    >
                      Add more versions
                    </Menu.Item>
                  </Menu>
                }
              >
                <Button className="list-fa-button" onClick={event => event.stopPropagation()}>
                  <i className="fas fa-exchange-alt" /> <Icon type="down" />
                </Button>
              </Dropdown>
            </>
          </ButtonWithTooltip>
        )}
        {!readOnly && !isDefinitionEmpty && (
          <ButtonWithTooltip tip="Revert Changes of this Definition">
            <Button
              className="list-fa-button"
              onClick={() => this.revertComponent(component)}
              disabled={!hasChange(component)}
            >
              <i className="fas fa-undo" />
            </Button>
          </ButtonWithTooltip>
        )}
      </ButtonGroup>
    )
  }

  render() {
    const { currentComponent, readOnly, isMobile, hideRemoveButton } = this.props
    const component = EntitySpec.fromObject(currentComponent)
    return (
      <div className="list-activity-area">
        {isMobile ? this.renderMobileButtonGroup() : this.renderButtonGroup()}

        {!readOnly && !hideRemoveButton && (
          <Button bsStyle="link" onClick={this.removeComponent.bind(this, component)}>
            <i className="fas fa-times list-remove" />
          </Button>
        )}
      </div>
    )
  }
}

export default withResize(ComponentButtons)
