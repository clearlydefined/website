import React, { Component } from 'react'
import { Button } from 'react-bootstrap'
import { CopyToClipboard } from 'react-copy-to-clipboard'
import ButtonWithTooltip from './ButtonWithTooltip'

class NotificationContent extends Component {
  state = {
    codeVisible: false,
    copied: false,
    timeoutId: null
  }

  onClick = event => {
    event.stopPropagation()
  }

  onCopy = () => {
    this.state.timeoutId && clearTimeout(this.state.timeoutId)
    const timeoutId = setTimeout(this.didCopy, 500)
    this.setState({ ...this.state, copied: true, timeoutId })
  }

  didCopy = () => {
    this.setState({ ...this.state, copied: false, timeoutId: null })
  }
  renderTooltip = () => {
    return this.state.copied ? 'Copied!' : 'Copy URL to clipboard'
  }

  render() {
    const { notification } = this.props
    const { codeVisible } = this.state
    return (
      <div key={notification.id}>
        {notification.message}
        {notification.code && (
          <div>
            {!codeVisible && (
              <Button bsStyle={notification.type} onClick={() => this.setState({ codeVisible: true })}>
                Show me the Error
              </Button>
            )}
            {codeVisible && (
              <>
                <pre>{JSON.stringify(notification.code)}</pre>
                <Button bsStyle={notification.type} onClick={() => this.setState({ codeVisible: false })}>
                  Hide the Error
                </Button>{' '}
                <ButtonWithTooltip tip={this.renderTooltip()} placement="bottom">
                  <CopyToClipboard text={JSON.stringify(notification.code)} onCopy={this.onCopy}>
                    <Button bsStyle={notification.type} onClick={this.onClick}>
                      <i className="fas fa-copy" /> Copy the Error code
                    </Button>
                  </CopyToClipboard>
                </ButtonWithTooltip>
              </>
            )}
          </div>
        )}
      </div>
    )
  }
}

export default NotificationContent
