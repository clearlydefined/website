import React, { Component } from 'react'
import Tooltip from 'antd/lib/tooltip'
import infoIcon from '../../../images/icons/infoIcon.svg'
/**
 * Renders a badge image, with a tooltip containing all the details about the score
 */
class FacetsTooltipIcon extends Component {
  renderTooltipContent = () => {
    return (
      <div className="facets-tooltip-content">
        <div>
          <p>
            Globbing patterns use common wildcard patterns to provide a partial path that can match zero or hundreds of
            files all at the same time.
          </p>
          <p>"?" matches a single character.</p>
          <p>"*" matches any number of characters within name.</p>For example:
          <br />
          <br />
          <code>foo*</code>
          <br />
          <br />
          <code>foo*.txt</code>
          <br />
          <br />
          <code>*foo</code>
          <br />
          <br />
          <code>a/*/z</code>
          <br />
          <br />
          <code>a/**/z</code>
          <br />
          <br />
          <code>/h?t</code>
        </div>
      </div>
    )
  }

  render() {
    return (
      <Tooltip title={this.renderTooltipContent} key={this.renderTooltipContent} overlayStyle={{ width: '800px' }}>
        <img className="label-con" src={infoIcon} alt="info" />
      </Tooltip>
    )
  }
}

export default FacetsTooltipIcon
