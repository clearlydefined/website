// Copyright (c) Microsoft Corporation and others. Licensed under the MIT license.
// SPDX-License-Identifier: MIT
import React from 'react'
import isArray from 'lodash/isArray'

const SuggestionRenderer = ({ item }) => (
  <div className="suggestionRenderer">
    <div className="suggestionValue">{isArray(item.value) ? item.value.map(value => <p>{value}</p>) : item.value}</div>
    <div className="suggestionData">
      {item.version && <p>Version: {item.version}</p>}
      {item.date && <p>Date: {item.date}</p>}
      {item.curation && <p>Curation: {item.curation}</p>}
      {item.curator && <p>Curator: {item.curator}</p>}
    </div>
  </div>
)

export default SuggestionRenderer
