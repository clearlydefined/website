// Copyright (c) Microsoft Corporation and others. Licensed under the MIT license.
// SPDX-License-Identifier: MIT

import React, { Component, Fragment } from 'react'
import { Row, Button, Col } from 'react-bootstrap'
import PropTypes from 'prop-types'
import cloneDeep from 'lodash/cloneDeep'
import find from 'lodash/find'
import get from 'lodash/get'
import { Section } from '../'
import FileList from '../FileList'
import FacetsEditor from '../FacetsEditor'
import 'antd/dist/antd.css'
import Contribution from '../../utils/contribution'
import DescribedSection from '../Navigation/Sections/DescribedSection'
import RawDataSection from '../Navigation/Sections/RawDataSection'
import HeaderSection from '../Navigation/Sections/HeaderSection'
import LabelRenderer from '../Navigation/Ui/LabelRenderer'
import LicensedSection from '../Navigation/Sections/LicensedSections'
import ButtonWithTooltip from '../Navigation/Ui/ButtonWithTooltip'
import CurationsSection from '../Navigation/Sections/CurationsSection'
import TitleWithScore from '../Navigation/Ui/TitleWithScore'

class FullDetailComponent extends Component {
  static propTypes = {
    handleClose: PropTypes.func,
    handleSave: PropTypes.func,
    handleRevert: PropTypes.func,
    curations: PropTypes.object.isRequired,
    definition: PropTypes.object.isRequired,
    harvest: PropTypes.object.isRequired,
    modalView: PropTypes.bool.isRequired,
    readOnly: PropTypes.bool.isRequired,
    renderContributeButton: PropTypes.element,
    previewDefinition: PropTypes.object,
    getCurationData: PropTypes.func
  }

  render() {
    const {
      definition,
      harvest,
      onChange,
      previewDefinition,
      readOnly,
      handleRevert,
      changes,
      getCurationData,
      curations,
      inspectedCuration
    } = this.props
    const entry = find(changes, (_, key) => key && key.startsWith('files'))
    if (!definition || !definition.item || !curations || !harvest) return null
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
            <Section name={<TitleWithScore title={'Described'} domain={item.described} />}>
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
                    />
                  </Col>
                  <Col md={6}>
                    <CurationsSection curations={curations} />
                  </Col>
                </Row>
              </Fragment>
            </Section>
            <Section name={<TitleWithScore title={'Licensed'} domain={item.licensed} />}>
              <LicensedSection rawDefinition={item} {...this.props} />
            </Section>
            <Section
              name={
                <section>
                  <span>Files</span>
                  &nbsp;
                  {!readOnly && (
                    <ButtonWithTooltip tip="Revert all changes to files list">
                      <Button
                        bsSize="small"
                        bsStyle="danger"
                        onClick={() => handleRevert('files')}
                        disabled={entry === undefined}
                      >
                        <i className="fas fa-undo" />
                        <span>&nbsp;Revert Changes</span>
                      </Button>
                    </ButtonWithTooltip>
                  )}
                </section>
              }
              actionButton={
                get(item, 'described.urls.download') && (
                  <Button bsStyle="primary" href={get(item, 'described.urls.download')}>
                    <i className="fas fa-download" />
                    <span>&nbsp;Download component</span>
                  </Button>
                )
              }
            >
              <Row>
                <Col md={12}>
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
                <Col md={12}>
                  <RawDataSection
                    curations={curations}
                    definition={definition}
                    item={item}
                    getCurationData={getCurationData}
                    inspectedCuration={inspectedCuration}
                    harvest={harvest}
                  />
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
