// Copyright (c) Microsoft Corporation and others. Licensed under the MIT license.
// SPDX-License-Identifier: MIT
import { ROUTE_FILE } from './routingConstants'

export default class Attachments {
  constructor({ provider, namespace, name, revision, path, row }) {
    this.provider = provider
    this.namespace = namespace
    this.name = name
    this.revision = revision
    this.path = path
    this.row = row
  }

  getFileAttachmentUrl() {
    if (this.row.children) return
    if (this.provider === 'github' && this.path) return this.getGitUrl()
    else if (this.row.token) return this.getFileRoute(this.row.token)
    else if (this.row.hashes) return this.getFileRoute(this.row.hashes.sha256)
  }

  static async fetchAttachmentWithToken(token) {
    const clearlyDefinedContent = await fetch(this.getClearlyDefinedUrl(token))
    if (clearlyDefinedContent.status === 200) return { source: 'CD', text: await clearlyDefinedContent.text() }
    const swhContent = await fetch(this.getSwhUrl(token))
    if (swhContent.status === 200) return { source: 'SWH', text: await swhContent.text() }
    return 404
  }

  getGitUrl() {
    return `https://github.com/${this.namespace}/${this.name}/blob/${this.revision}/${this.path}`
  }

  static getClearlyDefinedUrl(token) {
    return `${process.env.REACT_APP_SERVER}/attachments/${token}`
  }

  static getSwhUrl(token) {
    return `https://archive.softwareheritage.org/api/1/content/${token}/raw/`
  }

  getFileRoute(token) {
    return `${window.location.origin}${ROUTE_FILE}/${token}`
  }
}
