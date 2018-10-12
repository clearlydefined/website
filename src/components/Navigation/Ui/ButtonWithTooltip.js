// Copyright (c) Microsoft Corporation and others. Licensed under the MIT license.
// SPDX-License-Identifier: MIT
import React from 'react'
import { OverlayTrigger } from 'react-bootstrap'
import { Tooltip } from 'antd'

const ButtonWithTooltip = ({ button, tip }) => {
  const toolTip = <Tooltip id="tooltip">{tip}</Tooltip>
  return (
    <OverlayTrigger placement="top" overlay={toolTip}>
      {button}
    </OverlayTrigger>
  )
}

export default ButtonWithTooltip
