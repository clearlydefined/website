// Copyright (c) Microsoft Corporation and others. Licensed under the MIT license.
// SPDX-License-Identifier: MIT
import React, { Component } from 'react'
import PropTypes from 'prop-types'
import get from 'lodash/get'
import Contribution from '../../../utils/contribution'
import TwoColumnsSection from '../Sections/TwoColumnsSection'
import { SourcePicker } from '../..'
import ListDataRenderer from '../Ui/ListDataRenderer'
import FacetsTooltipIcon from '../Ui/FacetsTooltipIcon'
import FacetsEditor from '../../FacetsEditor'
// import infoIcon from '../../../images/icons/infoIcon.svg'
import toolBoxIcon from '../../../images/icons/toolBox.svg'
import gitPullRequestIcon from '../../../images/icons/git-pull-request.svg'
import CurationsSection from '../Sections/CurationsSection'
class DescribedSection extends Component {
  static propTypes = {
    rawDefinition: PropTypes.object,
    activeFacets: PropTypes.object,
    readOnly: PropTypes.bool,
    onChange: PropTypes.func,
    previewDefinition: PropTypes.object,
    curationSuggestions: PropTypes.object,
    handleRevert: PropTypes.func,
    applyCurationSuggestion: PropTypes.func
  }

  render() {
    const {
      rawDefinition,
      activeFacets,
      readOnly,
      onChange,
      previewDefinition,
      curationSuggestions,
      handleRevert,
      applyCurationSuggestion,
      curations
    } = this.props
    const definition = Contribution.foldFacets(rawDefinition, activeFacets)
    const item = { ...definition.item }
    const toolListView = get(definition.described, 'tools', []).map((tool, ind) => (
      <p className="view-details-tools-para" key={ind}>
        {tool.startsWith('curation') ? tool.slice(0, 16) : tool}
      </p>
    ))

    const elements = [
      {
        label: 'Source',
        field: 'described.sourceLocation',
        placeholder: 'Source Location',
        type: 'coordinates',
        editable: true,
        editor: SourcePicker
      },

      {
        label: 'Release Date',
        field: 'described.releaseDate',
        placeholder: 'YYYY-MM-DD',
        type: 'date',
        editable: true
      },
      {
        label: 'Facets',
        // labelIcon: <img className="label-con" src={infoIcon} alt="info" />,
        labelIcon: <FacetsTooltipIcon />,
        dropDown: true,
        component: (
          <FacetsEditor
            definition={item}
            onChange={onChange}
            previewDefinition={previewDefinition}
            readOnly={readOnly}
            onRevert={handleRevert}
          />
        ),
        field: 'described.tools'
      },
      {
        label: 'Tools',
        customBox: true,
        customBoxIcon: <img src={toolBoxIcon} alt="tools" />,
        component: <ListDataRenderer values={toolListView} title={'Tools'} />
      },
      {
        label: 'Curations',
        customBox: true,
        customBoxIcon: <img src={gitPullRequestIcon} alt="tools" />,
        component: <CurationsSection curations={curations} />
      }
    ]

    return (
      <TwoColumnsSection
        elements={elements}
        definition={definition}
        readOnly={readOnly}
        onChange={onChange}
        previewDefinition={previewDefinition}
        curationSuggestions={curationSuggestions}
        handleRevert={handleRevert}
        applyCurationSuggestion={applyCurationSuggestion}
      />
    )
  }
}

export default DescribedSection
