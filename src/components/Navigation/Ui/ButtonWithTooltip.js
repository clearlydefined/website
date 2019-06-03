// Copyright (c) Microsoft Corporation and others. Licensed under the MIT license.
// SPDX-License-Identifier: MIT
import React from 'react'
import { OverlayTrigger, Tooltip } from 'react-bootstrap'

const ButtonWithTooltip = ({ children, tip, placement }) => {
  return (
    <OverlayTrigger rootClose placement={placement || 'top'} overlay={<Tooltip id="tooltip">{tip}</Tooltip>}>
      <div className="tooltipWrapper">{children}</div>
    </OverlayTrigger>
  )
}

export default ButtonWithTooltip
