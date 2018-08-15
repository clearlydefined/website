// Copyright (c) Microsoft Corporation and others. Licensed under the MIT license.
// SPDX-License-Identifier: MIT

import Contribution from '../contribution'

describe('differenceBetweenObjects', () => {
  it('should compute the difference between 2 array of strings', () => {
    const preview = ['scancode/2.9.0+b1', 'clearlydefined/1', 'curationsupplied']
    const definition = ['scancode/2.9.0+b1', 'clearlydefined/1']
    expect(Contribution.differenceBetweenObjects(preview, definition)).toEqual([
      undefined,
      undefined,
      'curationsupplied'
    ])
  })

  it('should compute the difference between 2 array of objects', () => {
    const preview = [
      {
        path: 'package/lib/typescript.d.ts',
        license: 'Apache-2.0',
        attributions: ['Copyright (c) Microsoft Corporation.']
      },
      {
        path: 'package/lib/typescript.js',
        license: 'Apache-2.0',
        attributions: [
          'Copyright (c) Microsoft Corporation.',
          'Copyright (c) Microsoft.',
          'Copyright (c) Microsoft.',
          'Copyright (c) Microsoft Corporation.'
        ]
      },
      {
        path: 'package/lib/typescriptServices.d.ts',
        license: 'Apache-2.0',
        attributions: ['Copyright (c) Microsoft Corporation.']
      },
      {
        path: 'package/lib/typescriptServices.js',
        license: 'Apache-2.0',
        attributions: [
          'Copyright (c) Microsoft Corporation.',
          'Copyright (c) Microsoft.',
          'Copyright (c) Microsoft.',
          'Copyright (c) Microsoft Corporation.'
        ]
      },
      {
        path: 'package/lib/typingsInstaller.js',
        license: 'Apache-2.0',
        attributions: ['Copyright (c) Microsoft Corporation.']
      },
      {
        path: 'package/lib/watchGuard.js',
        license: 'Apache-2.0',
        attributions: ['Copyright (c) Microsoft Corporation.']
      },
      { path: 'package/lib/zh-CN/diagnosticMessages.generated.json', facets: ['data'] }
    ]
    const definition = [
      {
        path: 'package/lib/tsserver.js',
        license: 'Apache-2.0',
        attributions: ['Copyright (c) Microsoft Corporation.']
      },
      {
        path: 'package/lib/tsserverlibrary.d.ts',
        license: 'Apache-2.0',
        attributions: ['Copyright (c) Microsoft Corporation.']
      },
      {
        path: 'package/lib/tsserverlibrary.js',
        license: 'Apache-2.0',
        attributions: ['Copyright (c) Microsoft Corporation.', 'Copyright (c) Microsoft.']
      },
      {
        path: 'package/lib/typescript.d.ts',
        license: 'Apache-2.0',
        attributions: ['Copyright (c) Microsoft Corporation.']
      },
      {
        path: 'package/lib/typescript.js',
        license: 'Apache-2.0',
        attributions: ['Copyright (c) Microsoft Corporation.', 'Copyright (c) Microsoft.']
      },
      {
        path: 'package/lib/typescriptServices.d.ts',
        license: 'Apache-2.0',
        attributions: ['Copyright (c) Microsoft Corporation.']
      },
      {
        path: 'package/lib/typescriptServices.js',
        license: 'Apache-2.0',
        attributions: ['Copyright (c) Microsoft Corporation.', 'Copyright (c) Microsoft.']
      },
      {
        path: 'package/lib/typingsInstaller.js',
        license: 'Apache-2.0',
        attributions: ['Copyright (c) Microsoft Corporation.']
      },
      {
        path: 'package/lib/watchGuard.js',
        license: 'Apache-2.0',
        attributions: ['Copyright (c) Microsoft Corporation.']
      },
      { path: 'package/lib/zh-CN/diagnosticMessages.generated.json' }
    ]
    expect(Contribution.differenceBetweenObjects(preview, definition)).toEqual([
      undefined,
      {
        attributions: [
          'Copyright (c) Microsoft Corporation.',
          'Copyright (c) Microsoft.',
          'Copyright (c) Microsoft.',
          'Copyright (c) Microsoft Corporation.'
        ],
        license: 'Apache-2.0',
        path: 'package/lib/typescript.js'
      },
      undefined,
      {
        attributions: [
          'Copyright (c) Microsoft Corporation.',
          'Copyright (c) Microsoft.',
          'Copyright (c) Microsoft.',
          'Copyright (c) Microsoft Corporation.'
        ],
        license: 'Apache-2.0',
        path: 'package/lib/typescriptServices.js'
      },
      undefined,
      undefined,
      { facets: ['data'], path: 'package/lib/zh-CN/diagnosticMessages.generated.json' }
    ])
  })
})
