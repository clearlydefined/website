import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Button } from 'react-bootstrap'
import ButtonWithTooltip from '../../Ui/ButtonWithTooltip'
import ShareButton from '../../Ui/ShareButton'

export default class ButtonsBar extends Component {
  static propTypes = {
    components: PropTypes.object,
    hasChanges: PropTypes.bool,
    revertAll: PropTypes.func,
    doRefreshAll: PropTypes.func,
    collapseAll: PropTypes.func,
    onRemoveAll: PropTypes.func,
    doPromptContribute: PropTypes.func,
    shareUrl: PropTypes.func,
    shareFile: PropTypes.func,
    shareNotice: PropTypes.func,
    shareGist: PropTypes.func
  }

  onSelect = type => {
    switch (type) {
      case 'url':
        return this.props.shareUrl()
      case 'file':
        return this.props.shareFile()
      case 'notice':
        return this.props.shareNotice()
      case 'gist':
        return this.props.shareGist()
      default:
        break
    }
  }

  render() {
    const { components, hasChanges, revertAll, doRefreshAll, collapseAll, onRemoveAll, doPromptContribute } = this.props
    return (
      <div className="text-right buttons-bar" data-test-id="page-definition-buttons-bar">
        <ButtonWithTooltip tip="Revert all changes of all the definitions">
          <Button bsStyle="danger" disabled={hasChanges} onClick={revertAll}>
            <i className="fas fa-undo" />
            <span>&nbsp;Revert Changes</span>
          </Button>
        </ButtonWithTooltip>
        <Button bsStyle="default" disabled={hasChanges} onClick={doRefreshAll}>
          Refresh
        </Button>
        <Button bsStyle="default" disabled={hasChanges} onClick={collapseAll}>
          Collapse All
        </Button>
        <Button bsStyle="danger" disabled={!components || components.list.length === 0} onClick={onRemoveAll}>
          Clear All
        </Button>
        <ShareButton components={components} onSelect={this.onSelect} />
        <Button bsStyle="success" data-test-id="contribute-button" disabled={hasChanges} onClick={doPromptContribute}>
          Contribute
        </Button>
      </div>
    )
  }
}
