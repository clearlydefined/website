import React, { Component } from 'react'
import get from 'lodash/get'
import { ROUTE_DEFINITIONS } from '../../../utils/routingConstants'
import EntitySpec from '../../../utils/entitySpec'
import techIcon from '../../../images/icons/tech.svg'
import shareIcon from '../../../images/icons/share.svg'
import linkCopyIcon from '../../../images/icons/linkCopy.svg'
import { IconButton } from '@material-ui/core'

class ComponentDetailsButtons extends Component {
  constructor(props) {
    super(props)
    this.copyUrlButton = React.createRef()
  }

  isSourceComponent(component) {
    return ['github', 'sourcearchive', 'debsrc'].includes(component.provider)
  }

  openSourceForComponent = definition => {
    // const sourceLocation = get(definition, 'described.sourceLocation')
    // const sourceEntity = sourceLocation && EntitySpec.fromObject(sourceLocation)
    // const path = `${ROUTE_DEFINITIONS}/${EntitySpec.fromObject(sourceEntity).toPath()}`
    const path = `/?type=${get(definition, 'coordinates.type')}&sortDesc=true&sort=releaseDate&name=${get(
      definition,
      'coordinates.name'
    )}`
    console.log('pathpathpath', path)
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
    return (
      <>
        <IconButton
          className="radius-btn border mx-2"
          onClick={() => this.openRegistryURL(item)}
          title="Open package URL"
        >
          <img src={shareIcon} alt="" />
        </IconButton>
        <IconButton
          className="radius-btn border mx-2"
          onClick={() => this.openSourceForComponent(item)}
          title="List other versions of this component"
        >
          <img src={techIcon} alt="" />
        </IconButton>
        <IconButton
          className="radius-btn border mx-2"
          onClick={() => this.copyToClipboard(this.renderUrl())}
          title="Copy component URL"
        >
          <img src={linkCopyIcon} alt="" />
        </IconButton>
      </>
      // <Dropdown overlay={menu} trigger="hover">
      //   <Button bsStyle="info">
      //     <i class="fas fa-ellipsis-v" />
      //   </Button>
      // </Dropdown>
    )
  }
}

export default ComponentDetailsButtons
