// Copyright (c) Microsoft Corporation and others. Licensed under the MIT license.
// SPDX-License-Identifier: MIT
import React from 'react'
import isArray from 'lodash/isArray'
import isObject from 'lodash/isObject'
import Tooltip from 'antd/lib/tooltip'

const SuggestionRenderer = ({ item }) => {
  return (
    <div className="suggestionRenderer">
      <div className="suggestionValue">
        {isArray(item.value) ? (
          item.value.map(value => <p key={value}>{value}</p>)
        ) : isObject(item.value) && item.value.url ? (
          <Tooltip title={item.value.url}>
            <p>{item.value.url}</p>
          </Tooltip>
        ) : (
          <p>{item.value}</p>
        )}
      </div>
      <div className="suggestionData">
        {item.version && <p>Version: {item.version}</p>}
        {item.date && <p>Date: {item.date}</p>}
        {item.curation && <p>Curation: {item.curation}</p>}
        {item.curator && <p>Curator: {item.curator}</p>}
      </div>
    </div>
  )
}

export default SuggestionRenderer
