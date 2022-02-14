// Copyright (c) Microsoft Corporation and others. Licensed under the MIT license.
// SPDX-License-Identifier: MIT

import React, { Component } from 'react'
import { Button } from '@material-ui/core'
import PropTypes from 'prop-types'
import cloneDeep from 'lodash/cloneDeep'
import get from 'lodash/get'
import FileList from '../FileList'
import Contribution from '../../utils/contribution'
import DescribedSection from '../Navigation/Sections/DescribedSection'
import RawDataSection from '../Navigation/Sections/RawDataSection'
import HeaderSection from '../Navigation/Sections/HeaderSection'
import LicensedSection from '../Navigation/Sections/LicensedSections'
import { withResize } from '../../utils/WindowProvider'
import ComponentDetailsButtons from '.././Navigation/Ui/ComponentDetailsButtons'
import noteIcon from '../../images/icons/notes.svg'
import folderIcon from '../../images/icons/folderIcon.png'
import codeIcon from '../../images/icons/codeIcon.svg'
import { Paper, Typography, Divider } from '@material-ui/core'
import ScoreRenderer from '.././Navigation/Ui/ScoreRenderer'
import downloadIcon from '../../images/icons/downloadIcon.svg'
class FullDetailComponent extends Component {
  constructor(props) {
    super(props)
    this.handleTab = this.handleTab.bind(this)
    this.state = {
      activeTab: 0
    }
  }
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

  globTooptipText() {
    return (
      <div>
        <p>
          Globbing patterns use common wildcard patterns to provide a partial path that can match zero or hundreds of
          files all at the same time.
        </p>
        <p>"?" matches a single character.</p>
        <p>"*" matches any number of characters within name.</p>
        For example:
        <br />
        {/* Match any file or folder starting with "foo" */}
        <br />
        <code>foo*</code>
        <br />
        {/* Match any file or folder starting with "foo" and ending with .txt */}
        <br />
        <code>foo*.txt</code>
        <br />
        {/* Match any file or folder ending with "foo" */}
        <br />
        <code>*foo</code>
        <br />
        {/* Match a/b/z but not a/b/c/z */}
        <br />
        <code>a/*/z</code>
        <br />
        {/* Match a/z and a/b/z and a/b/c/z */}
        <br />
        <code>a/**/z</code>
        <br />
        {/* Matches hat but not ham or h/t */}
        <br />
        <code>/h?t</code>
      </div>
    )
  }

  renderFilesSection() {
    const { definition, onChange, previewDefinition, readOnly } = this.props
    const item = { ...definition.item }
    return (
      <div name="Raw data" className="py-0">
        <div className="pt-2 pb-2 d-flex justify-content-between align-items-start">
          <div className="mr-auto">
            <h2 className="font-weight-bold">Files</h2>
            <h6>
              {item?.coordinates?.name} <span>{item?.coordinates?.revision}</span>
            </h6>
          </div>
          <Button
            href={get(item, 'described.urls.download')}
            variant="text"
            style={{ color: '#1D52D4', textTransform: 'lowercase' }}
            className="mt-auto"
          >
            <img
              style={{
                width: '12px'
              }}
              src={downloadIcon}
              alt="download"
            />
            <span>&nbsp;component</span>
          </Button>
        </div>

        <FileList
          files={cloneDeep(item.files)}
          coordinates={item?.coordinates}
          onChange={onChange}
          component={definition}
          previewDefinition={previewDefinition}
          readOnly={readOnly}
        />
      </div>
      // <Section
      //   name={
      //     <section>
      //       <span>Files</span>
      //       &nbsp;
      //       {!readOnly && (
      //         <ButtonWithTooltip tip="Revert all file and facet changes on this definitions">
      //           <Button
      //             data-test-id="revert-files-and-facets"
      //             bsSize="small"
      //             bsStyle="danger"
      //             onClick={() => {
      //               handleRevert('files')
      //               handleRevert('described.facets')
      //             }}
      //             disabled={!filesOrFacetsHaveBeenChanged}
      //           >
      //             <i className="fas fa-undo" />
      //             <span>&nbsp;Revert Changes</span>
      //           </Button>
      //         </ButtonWithTooltip>
      //       )}
      //     </section>
      //   }
      //   actionButton={
      //     get(item, 'described.urls.download') && (
      //       <Button bsStyle="primary" href={get(item, 'described.urls.download')}>
      //         <i className="fas fa-download" />
      //         <span>&nbsp;Download component</span>
      //       </Button>
      //     )
      //   }
      // >
      //   <Row>
      //     <Col xs={11}>
      //       <FileList
      //         files={cloneDeep(item.files)}
      //         onChange={onChange}
      //         component={definition}
      //         previewDefinition={previewDefinition}
      //         readOnly={readOnly}
      //       />
      //     </Col>
      //   </Row>
      // </Section>
    )
  }

  renderRawDataSection() {
    const { definition, harvest, curations, getCurationData, inspectedCuration } = this.props
    const item = { ...definition.item }

    return (
      <div name="Raw data" className="py-2">
        <h2 className="py-4 font-weight-bold">Raw Data</h2>
        <RawDataSection
          definition={definition}
          item={item}
          curations={curations}
          getCurationData={getCurationData}
          inspectedCuration={inspectedCuration}
          harvest={harvest}
        />
      </div>
    )
  }

  handleTab(num) {
    this.setState({ activeTab: num })
  }

  render() {
    const { definition, harvest, curations } = this.props
    if (!definition || !definition.item || !curations || !harvest) return null
    const item = { ...definition.item }
    const image = Contribution.getImage(item)

    return (
      <>
        <div className="view-details-top">
          {/* {isMobile && (
          <Row className="row-detail-header">
            <Col xs={12} className="text-right">
              {this.props.renderContributeButton}
            </Col>
          </Row>
        )} */}
          <div className="container">
            <div className="view-details-header row justify-content-between align-items-start">
              <div className="col-md-6 col-12">
                <div className="pckg-main-info">
                  <div className="pckg-img">
                    <div className="bg-pckg-img">{image && <img src={image} alt="" />}</div>
                  </div>
                  <div className="pckg-title-details">
                    <HeaderSection {...this.props} />
                  </div>
                </div>
              </div>
              <div className="col-md-6 mt-md-auto mt-3">
                <div className="detail-page-header-right">
                  <ComponentDetailsButtons item={item} />
                  &nbsp; &nbsp;
                  {this.props.renderContributeButton}
                </div>
              </div>
              <div className="col-12 pt-3">
                <div className="tabs-wrappper">
                  <div className="tab-box">
                    <button
                      className={`tab-btn ${this.state.activeTab === 0 ? 'active-tab-c' : '.'}`}
                      onClick={() => this.handleTab(0)}
                    >
                      <img src={noteIcon} alt="" />
                      Described and Licensed
                    </button>
                  </div>
                  <div className="tab-box">
                    <button
                      className={`tab-btn ${this.state.activeTab === 1 ? 'active-tab-c' : '.'}`}
                      onClick={() => this.handleTab(1)}
                    >
                      <img src={folderIcon} alt="" />
                      Files
                    </button>
                  </div>
                  <div className="tab-box">
                    <button
                      className={`tab-btn ${this.state.activeTab === 2 ? 'active-tab-c' : '.'}`}
                      onClick={() => this.handleTab(2)}
                    >
                      <img src={codeIcon} alt="" />
                      Raw Data
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="container py-5">
          {/*====== Tabe 1 Described and License =======*/}
          {this.state.activeTab === 0 && (
            <>
              {/* Described section */}
              <div className="row">
                <div className="col-md-6">
                  <Paper className="tile">
                    <div className="tile-hd">
                      <Typography variant="h5">Described</Typography>
                      <div className="d-flex describe-right-side">
                        <span className="mx-2">Score: </span>
                        <div className="score-badge">
                          <ScoreRenderer domain={item.described} />
                        </div>
                      </div>
                    </div>
                    <Divider />
                    <DescribedSection rawDefinition={item} {...this.props} />
                    {/* <CurationsSection curations={curations} /> */}
                    {/* <FacetsEditor
                    definition={item}
                    onChange={onChange}
                    previewDefinition={previewDefinition}
                    readOnly={readOnly}
                    onRevert={handleRevert}
                  /> */}
                  </Paper>
                </div>
                {/* License box */}
                <div className="col-md-6">
                  <Paper className="tile">
                    <div className="tile-hd">
                      <Typography variant="h5">Licensed</Typography>
                      <div className="d-flex describe-right-side">
                        <span className="mx-2">Score: </span>
                        <div className="score-badge">
                          <ScoreRenderer domain={item.licensed} />
                        </div>
                      </div>
                    </div>
                    <Divider />
                    <LicensedSection rawDefinition={item} {...this.props} />
                  </Paper>
                </div>
              </div>
            </>
          )}

          {/*============ Tab 2  Files ============*/}
          {this.state.activeTab === 1 && (
            <>
              <div className="col-12">
                <div className="py-2 px-4 rounded mb-3">
                  {/* {!isMobile && this.renderFilesSection()} */}
                  {this.renderFilesSection()}
                </div>
              </div>
            </>
          )}

          {/*=========== Tab 3 Raw Data ===============*/}
          {this.state.activeTab === 2 && (
            <>
              <div className="col-12">
                <Paper className="py-2 px-4 rounded mb-3">
                  {/* {!isMobile && this.renderRawDataSection()} */}
                  {this.renderRawDataSection()}
                </Paper>
              </div>
            </>
          )}

          {/* <Row className="view-details-header">
            <Col md={1} xs={2}>
              {image && <img className="component-image" src={image} alt="" />}
            </Col>
            <Col md={11} xs={10}>
              <HeaderSection {...this.props} />
            </Col>
          </Row> */}
          {/* <Row>
            <Col xs={11} mdOffset={1}>
              <Section name={
              <TitleWithScore title={'Described'}
              domain={item.described} />}>
                <Fragment>
                  <DescribedSection rawDefinition={item} {...this.props} />
                  <Row className="mt-3">
                    <Col md={6}>
                      <Row>
                        <Col md={3}>
                          <LabelRenderer text="Facets" />{' '}
                          <Tooltip title={this.globTooptipText()} overlayStyle={{ width: '800px' }}>
                            <i className="fas fa-info-circle" />
                          </Tooltip>
                        </Col>
                      </Row>
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
              {!isMobile && this.renderFilesSection()}
              {!isMobile && this.renderRawDataSection()}
            </Col>
          </Row> */}
        </div>
      </>
    )
  }
}

export default withResize(FullDetailComponent)
