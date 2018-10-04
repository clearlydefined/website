// Copyright (c) Microsoft Corporation and others. Licensed under the MIT license.
// SPDX-License-Identifier: MIT
import React from 'react'
import TwoLineEntry from '../TwoLineEntry'
import Tag from 'antd/lib/tag'

const CurationRenderer = ({ curation, onClick }) => (
  <TwoLineEntry
    onClick={() => onClick && onClick(curation.number)}
    headline={
      <span>
        #{curation.number} {curation.title}{' '}
        <Tag color={curation.status === 'merged' ? 'green' : 'gold'}>
          {curation.status === 'merged' ? 'Curated' : 'Pending'}
        </Tag>
      </span>
    }
    message={<span>@{curation.contributor}</span>}
  />
)

export default CurationRenderer
