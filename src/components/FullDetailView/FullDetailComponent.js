// Copyright (c) Microsoft Corporation and others. Licensed under the MIT license.
// SPDX-License-Identifier: MIT

import React, { Component, Fragment } from 'react'
import { Row, Button, Col } from 'react-bootstrap'
import PropTypes from 'prop-types'
import Tabs from 'antd/lib/tabs'
import cloneDeep from 'lodash/cloneDeep'
import find from 'lodash/find'
import { getBadgeUrl } from '../../api/clearlyDefined'
import { Section } from '../'
import FileList from '../FileList'
import FacetsEditor from '../FacetsEditor'
import 'antd/dist/antd.css'
import Contribution from '../../utils/contribution'
import Definition from '../../utils/definition'
import DescribedSection from './DescribedSection'
import InnerDataSection from './InnerDataSection'
import HeaderSection from './HeaderSection'
import LabelRenderer from '../Renderers/LabelRenderer'
import LicensedSection from './LicensedSections'
import ButtonWithTooltip from '../Renderers/ButtonWithTooltip'
import CurationsSection from './CurationsSection'
import CurationData from './CurationData'

class FullDetailComponent extends Component {
  static propTypes = {
    handleClose: PropTypes.func,
    handleSave: PropTypes.func,
    handleRevert: PropTypes.func,
    curation: PropTypes.object.isRequired,
    definition: PropTypes.object.isRequired,
    harvest: PropTypes.object.isRequired,
    modalView: PropTypes.bool.isRequired,
    readOnly: PropTypes.bool.isRequired,
    renderContributeButton: PropTypes.element,
    previewDefinition: PropTypes.object,
    curationSuggestions: PropTypes.object,
    getCurationData: PropTypes.func
  }

  renderScore(domain) {
    if (!domain) return null
    return <img className="list-buttons" src={getBadgeUrl(domain.toolScore, domain.score)} alt="score" />
  }

  render() {
    const {
      curation,
      definition,
      harvest,
      onChange,
      previewDefinition,
      readOnly,
      handleRevert,
      changes,
      curationSuggestions,
      getCurationData,
      inspectedCuration
    } = this.props
    const entry = find(changes, (_, key) => key && key.startsWith('files'))
    if (!definition || !definition.item || !curation || !harvest) return null
    const item = { ...definition.item }
    const image = Contribution.getImage(item)
    return (
      <div>
        <Row>
          <Col md={1}>{image && <img className={`list-image`} src={image} alt="" />}</Col>
          <Col md={11}>
            <HeaderSection {...this.props} />
          </Col>
        </Row>
        <Row>
          <Col md={1} />
          <Col md={11}>
            <Section name={<span>Described {this.renderScore(item.described)}</span>}>
              <Fragment>
                <DescribedSection rawDefinition={item} {...this.props} />
                <Row>
                  <Col md={6}>
                    <LabelRenderer text={'Facets'} />
                    <FacetsEditor
                      definition={item}
                      onChange={onChange}
                      previewDefinition={previewDefinition}
                      readOnly={readOnly}
                      onRevert={handleRevert}
                      curationSuggestions={curationSuggestions}
                    />
                  </Col>
                  <Col md={6}>
                    <CurationsSection curations={Definition.getPrs(item)} />
                  </Col>
                </Row>
              </Fragment>
            </Section>
            <Section name={<span>Licensed {this.renderScore(item.licensed)}</span>}>
              <LicensedSection rawDefinition={item} {...this.props} />
            </Section>
            <Section
              name={
                <section>
                  <span>Files</span>
                  &nbsp;
                  <ButtonWithTooltip
                    button={
                      <Button bsStyle="danger" onClick={() => handleRevert('files')} disabled={entry === undefined}>
                        <i className="fas fa-undo" />
                        <span>&nbsp;Revert Changes</span>
                      </Button>
                    }
                    tooltip="Revert all changes of all the definitions"
                  />
                </section>
              }
            >
              <Row>
                <Col md={11}>
                  <FileList
                    files={cloneDeep(item.files)}
                    onChange={onChange}
                    component={definition}
                    previewDefinition={previewDefinition}
                    readOnly={readOnly}
                  />
                </Col>
              </Row>
            </Section>
            <Section name="Raw data">
              <Row>
                <Col md={11} offset-md={1}>
                  <Tabs>
                    <Tabs.TabPane tab="Current definition" key="1">
                      <InnerDataSection value={definition} name={'Current definition'} type={'yaml'} />
                    </Tabs.TabPane>
                    <Tabs.TabPane tab="Curations" key="2">
                      <CurationData
                        curations={Definition.getPrs(item)}
                        onChange={getCurationData}
                        inspectedCuration={inspectedCuration}
                      />
                    </Tabs.TabPane>
                    <Tabs.TabPane tab="Harvested data" key="3">
                      <InnerDataSection value={harvest} name={'Harvested data'} type={'json'} />
                    </Tabs.TabPane>
                  </Tabs>
                </Col>
              </Row>
            </Section>
          </Col>
        </Row>
      </div>
    )
  }
}

export default FullDetailComponent
