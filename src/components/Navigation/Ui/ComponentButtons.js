import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { get } from 'lodash'
import { Button, ButtonGroup, ButtonToolbar, Dropdown as BSDropdown } from 'react-bootstrap'
import EntitySpec from '../../../utils/entitySpec'
import { ROUTE_DEFINITIONS } from '../../../utils/routingConstants'
import { withResize } from '../../../utils/WindowProvider'
import Definition from '../../../utils/definition'
import { ORIGINS } from '../../../api/clearlyDefined'
import MoreVertIcon from '@material-ui/icons/MoreVert'
import { IconButton } from '@material-ui/core'
import ButtonWithTooltip from './ButtonWithTooltip'
import { Menu, Dropdown, Icon } from 'antd'

class ComponentButtons extends Component {
  constructor(props) {
    super(props)
    this.handleMenu = this.handleMenu.bind(this)
    this.state = {
      menuOpen: false
    }
  }
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
    return ['github', 'sourcearchive', 'debsrc', 'condasrc'].includes(component.provider)
  }

  _isProviderSupported(component) {
    return !!get(ORIGINS, component.provider)
  }

  removeComponent(component, event) {
    event.stopPropagation()
    this.handleMenu()
    const { onRemove } = this.props
    onRemove && onRemove(component)
  }

  revertComponent(component, param) {
    this.handleMenu()
    const { onRevert } = this.props
    onRevert && onRevert(component, param)
  }

  inspectComponent(component, definition, event) {
    event.stopPropagation()
    this.handleMenu()
    const action = this.props.onInspect
    action && action(component, definition)
  }

  addSourceForComponent(component, event) {
    event.stopPropagation()
    this.handleMenu()
    const definition = this.props.getDefinition(component)
    const sourceLocation = get(definition, 'described.sourceLocation')
    const sourceEntity = sourceLocation && EntitySpec.fromObject(sourceLocation)
    const action = this.props.onAddComponent
    action && sourceEntity && action(sourceEntity, component)
  }

  showVersionSelectorPopup(component, multiple, event) {
    event.domEvent.stopPropagation()
    this.handleMenu()
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

  renderDropdown(currentComponent) {
    return (
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
    )
  }

  renderButtonGroup() {
    const {
      definition,
      currentComponent,
      hasChange,
      readOnly,
      onAddComponent,
      onInspect,
      onRemove,
      hideVersionSelector
    } = this.props
    const component = EntitySpec.fromObject(currentComponent)

    const isSourceComponent = this.isSourceComponent(component)
    const isSourceEmpty = Definition.isSourceEmpty(definition)
    const isDefinitionEmpty = Definition.isDefinitionEmpty(definition)
    const isProviderSupported = this._isProviderSupported(component)
    return (
      <>
        <IconButton className="menuOpenBtn" onClick={this.handleMenu} aria-label="button">
          <MoreVertIcon fontSize="large" />
        </IconButton>
        <div className={`clearly-menu ${this.state.menuOpen ? 'opened' : 'closed'}`}>
          <ButtonGroup>
            {!isSourceComponent && !readOnly && !isSourceEmpty && onAddComponent && (
              <ButtonWithTooltip tip="Add the definition for source that matches this package">
                <Button className="list-fa-button" onClick={this.addSourceForComponent.bind(this, component)}>
                  <i className="fas fa-code" />
                </Button>
              </ButtonWithTooltip>
            )}
            {!isDefinitionEmpty && onInspect && (
              <ButtonWithTooltip tip="Dig into this definition">
                <Button className="list-fa-button" onClick={this.inspectComponent.bind(this, currentComponent, definition)}>
                  <i className="fas fa-search" />
                </Button>
              </ButtonWithTooltip>
            )}
            <a
              href={`${window.location.origin}${ROUTE_DEFINITIONS}/${component.toPath()}`}
              className="list-fa-button btn btn-default"
              target="_blank"
              rel="noopener noreferrer"
              onClick={event => {
                this.handleMenu()
                event.stopPropagation()
              }}
            >
              <i className="fas fa-external-link-alt" />
            </a>
            {!hideVersionSelector && isProviderSupported && (
              <ButtonWithTooltip tip="Switch or add other versions of this definition">
                {this.renderDropdown(currentComponent)}
              </ButtonWithTooltip>
            )}
            {!readOnly && onRemove && (
              <ButtonWithTooltip tip="Remove this definition">
                <Button className="list-fa-button" onClick={this.removeComponent.bind(this, currentComponent)}>
                  <i className="fas fa-trash" />
                </Button>
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
        </div>
      </>
    )
  }

  // menu
  handleMenu() {
    this.setState({ menuOpen: !this.state.menuOpen })
  }
  render() {
    return (
      <div className="list-activity-area">{this.renderButtonGroup()}</div>
    )
  }
}

export default withResize(ComponentButtons)
