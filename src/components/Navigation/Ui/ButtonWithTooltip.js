// Copyright (c) Microsoft Corporation and others. Licensed under the MIT license.
// SPDX-License-Identifier: MIT
import React from 'react'
import { Tooltip } from 'antd'

const ButtonWithTooltip = ({ button, tip, disabled }) => {
  return (
    <Tooltip placement="topLeft" title={!disabled && tip} arrowPointAtCenter>
      {button}
    </Tooltip>
  )
}

export default ButtonWithTooltip
