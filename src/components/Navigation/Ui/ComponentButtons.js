import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { get } from 'lodash'
import { ButtonToolbar, Dropdown as BSDropdown } from 'react-bootstrap'
import EntitySpec from '../../../utils/entitySpec'
import { ROUTE_DEFINITIONS } from '../../../utils/routingConstants'
import { withResize } from '../../../utils/WindowProvider'
import MoreVertIcon from '@material-ui/icons/MoreVert'
import { IconButton } from '@material-ui/core'
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
    return ['github', 'sourcearchive', 'debsrc'].includes(component.provider)
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
    const { definition, currentComponent, hasChange } = this.props
    const component = EntitySpec.fromObject(currentComponent)
    return (
      <>
        <IconButton className="menuOpenBtn" onClick={this.handleMenu} aria-label="button">
          <MoreVertIcon fontSize="large" />
        </IconButton>
        <div className={`clearly-menu ${this.state.menuOpen ? 'opened' : 'closed'}`}>
          <a
            href={`${window.location.origin}${ROUTE_DEFINITIONS}/${component.toPath()}`}
            onClick={event => {
              this.handleMenu()
            }}
            className="clearly-menu-btns"
          >
            View Components
          </a>
          <button
            onClick={() => {
              this.handleMenu()
              this.revertComponent(component)
            }}
            className={`clearly-menu-btns ${!hasChange(component) ? 'disabled-btn' : ''}`}
            disabled={!hasChange(component)}
          >
            Revert Changes
          </button>
          <button
            onClick={() => {
              this.handleMenu()
              this.inspectComponent.bind(this, currentComponent, definition)
            }}
            className="clearly-menu-btns"
          >
            Add Source Definition
          </button>
        </div>

        {/*
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
        </ButtonGroup> */}
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
