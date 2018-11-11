// Copyright (c) Microsoft Corporation and others. Licensed under the MIT license.
// SPDX-License-Identifier: MIT
import React from 'react'
import { OverlayTrigger } from 'react-bootstrap'
import { Tooltip } from 'antd'

const ButtonWithTooltip = ({ button, tip }) => {
  return (
    <Tooltip placement="topLeft" title={tip} arrowPointAtCenter>
      {button}
    </Tooltip>
  )
}

export default ButtonWithTooltip
