// Copyright (c) Microsoft Corporation and others. Licensed under the MIT license.
// SPDX-License-Identifier: MIT

export function asyncActions(actionType, group = null) {
  return {
    start: context => ({
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
