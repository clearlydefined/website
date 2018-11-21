// Copyright (c) Microsoft Corporation and others. Licensed under the MIT license.
// SPDX-License-Identifier: MIT
import React from 'react'

const SuggestionRenderer = ({ item }) => (
  <div style={{ display: 'flex' }}>
    <span>{item.value}</span>
    <div style={{ fontSize: '10px', color: 'grey' }}>
      <p style={{ margin: '0px' }}>Version: {item.version}</p>
      <p style={{ margin: '0px' }}>Date: {item.date}</p>
      <p style={{ margin: '0px' }}>Curation: {item.curation}</p>
      <p style={{ margin: '0px' }}>Curator: {item.curator}</p>
    </div>
  </div>
)

export default SuggestionRenderer
