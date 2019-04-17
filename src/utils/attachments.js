// Copyright (c) Microsoft Corporation and others. Licensed under the MIT license.
// SPDX-License-Identifier: MIT

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

  getGitUrl() {
    return `https://github.com/${this.namespace}/${this.name}/blob/${this.revision}/${this.path}`
  }

  getClearlyDefinedUrl() {
    return `${process.env.REACT_APP_SERVER}/attachments/${this.row.token}`
  }

  getFileRoute(token) {
    return `${window.location.origin}/files/${token}`
  }
}
