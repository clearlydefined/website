// Copyright (c) Microsoft Corporation and others. Licensed under the MIT license.
// SPDX-License-Identifier: MIT
import React from 'react'

const PlaceholderRenderer = ({ message }) => {
  return (
    <div className="placeholder-message inline section-body">
      <span>{message}</span>
    </div>
  )
}
export default PlaceholderRenderer
