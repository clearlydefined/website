// Copyright (c) Microsoft Corporation and others. Licensed under the MIT license.
// SPDX-License-Identifier: MIT

// Goofy little utility used at build time to copy the monaco files from their module to
// the output dir. Running `cpx` directly from package.json does not work uniformly
// across windows and linux.
require('cpx').copy('node_modules/monaco-editor/min/vs/**/*', 'public/vs', error => {
  if (error) {
    process.exit(1)
  }
  process.exit(0)
})
