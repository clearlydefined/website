// Copyright (c) Microsoft Corporation and others. Licensed under the MIT license.
// SPDX-License-Identifier: MIT

import { url } from '../api/clearlyDefined'

export default class Auth {
  /**
   * Open the service's auth page and execute a callback with the returned data from the server
   */
  static doLogin(callback) {
    console.log('login', url('auth/github'))
    window.open(url('auth/github'))
    const tokenListener = e => {
      if (e.data.type === 'github-token') {
        callback(e.data.token, e.data.permissions, e.data.username)
        window.removeEventListener('message', tokenListener)
      }
    }
    window.addEventListener('message', tokenListener)
  }
}
