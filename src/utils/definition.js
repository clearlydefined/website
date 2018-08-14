// Copyright (c) Microsoft Corporation and others. Licensed under the MIT license.
// SPDX-License-Identifier: MIT
import isEmpty from 'lodash/isEmpty'
import transform from 'lodash/transform'

/**
 * Abstract methods for Definition
 *
 */
export default class Definition {
  static getPathFromUrl(props) {
    return props.path ? props.path : props.location ? props.location.pathname.slice(props.match.url.length + 1) : null
  }
}
