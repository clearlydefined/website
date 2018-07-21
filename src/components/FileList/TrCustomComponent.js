import React, { Component } from 'react'

/**
 * Custom Table Row Component used for render inside TreeTable structure
 * 
 */
export default class TrCustomComponent extends Component {
  render() {
    const { ri, style, defaultProps, treeTableIndent, getSubrows, ...rest } = this.props
    if (ri && ri.groupedByPivot) {
      // The original value will be updated with the modified data

      ri.subRows = getSubrows(ri.subRows);

      const cell = { ...this.props.children[ri.level] }

      cell.props.style.flex = 'unset'
      cell.props.style.width = '100%'
      cell.props.style.maxWidth = 'unset'
      cell.props.style.paddingLeft = `${10 * ri.level}px`
      cell.props.style.borderBottom = '1px solid rgba(128,128,128,0.2)'

      return (
        <div className={`rt-tr ${rest.className}`} style={rest.style}>
          {cell}
        </div>
      )
    }

    return <defaultProps.TrComponent {...rest} style={{ ...rest.style, textAlign: 'center' }} />
  }
}