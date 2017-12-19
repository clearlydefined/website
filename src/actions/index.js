// Copyright (c) Microsoft Corporation. All rights reserved.
// SPDX-License-Identifier: MIT

export function asyncActions(actionType, group = null) {
  return {
    start: (context) => ({
      type: actionType,
      group,
      context
    }),
    success: (result, context) => ({
      type: actionType,
      group,
      result,
      context
    }),
    error: (error, context) => ({
      type: actionType,
      group,
      error,
      context
    })
  }
}