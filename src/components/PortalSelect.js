// Based on the gist from @kumarharsh https://gist.github.com/kumarharsh/5ada99a2f6b5867984991b70bdc453a1
// Licensing is pending

import React from 'react'
import Select from 'react-select';
import { createPortal, findDOMNode } from 'react-dom';
import 'react-select/dist/react-select.css'; 
import defaultMenuRenderer from 'react-select/lib/utils/defaultMenuRenderer'; // this renders the actual menu - we can reuse the same component

class SelectMenu extends React.Component {

  componentDidMount() {
    window.addEventListener('scroll', this._handleScroll);  // just forceUpdate on scroll
  }

  componentWillUnmount() {
    window.removeEventListener('scroll', this._handleScroll);
  }

  getDocumentBody() {
    return document.body;
  }

  _handleScroll = () => {
    this.forceUpdate(); // just need to re-render on scroll so that the menu is not stuck in mid-air while the select input scrolls off-screen
  }

  render() {
    const rect = this.props.selectDOM.getBoundingClientRect();
    const computedStyle = window.getComputedStyle(this.props.selectDOM); // inherit as many styles as you want from the parent select
    const fontSize = computedStyle.getPropertyValue('font-size');
    const lineHeight = computedStyle.getPropertyValue('line-height');
    const position = {
      top: rect.bottom,
      left: rect.left,
      width: rect.width,
    };

    return createPortal(
      <div className='Select-menu-outer' style={{ ...position, fontSize, lineHeight }}>
        <div className="Select-menu">{defaultMenuRenderer(this.props.selectProps)}</div>
      </div>,
      document.getElementsByTagName('body')[0]
    );
  }
}

export default class PortalSelect extends React.Component {

  static modes = { 
    select: Select,
    async: Select.Async,
    creatable: Select.Creatable,
    asyncCreatable: Select.AsyncCreatable
  }

  constructor(props) {
    super(props)
    this._updatePortal = this._updatePortal.bind(this)
  }

  componentDidMount() {
    this._selectDOM = findDOMNode(this._select).children[0];
    window.addEventListener("resize", this._updatePortal.bind(this));
  }

  componentDidUpdate() {
    this._selectDOM = findDOMNode(this._select).children[0];
  }

  componentWillUnmount() {
    window.removeEventListener("resize", this._updatePortal.bind(this));
  }

  _updatePortal() {
    this.forceUpdate()
  }

  _getRef = (c) => {
    this._select = c;
  }

  _renderMenu = (selectProps) => {
    if (!this._selectDOM) {
      return defaultMenuRenderer(selectProps);
    }

    return (
      <SelectMenu
        selectProps={selectProps}
        selectDOM={this._selectDOM}  // pass the select's dom node (for getting styles & bounding-box calcs)
      />
    );
  }

  render() {
    const { mode, ...otherProps } = this.props;
    const SelectComponent = PortalSelect.modes[mode || 'select']
    return (
      <div
        ref={this._getRef}>
        <SelectComponent
          {...otherProps}
          menuRenderer={this._renderMenu}
        />
      </div>
    );
  }
}