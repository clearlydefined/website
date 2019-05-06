import React from 'react'
import { shallow } from 'enzyme'
import FileList from '../FileList'

describe('FileList', () => {
  it('renders without crashing', () => {
    shallow(<FileList component={definition} files={files} />)
  })

  it('filters files for name', () => {
    const wrapper = shallow(<FileList component={definition} files={files} />)
    const instance = wrapper.instance()
    const resultNuget = instance.filterFiles(nugetTreeFolders, 'name', 'install')
    expect(resultNuget).toEqual([
      {
        children: [
          {
            facets: [],
            folders: ['install.ps1'],
            id: 18,
            key: 27,
            license: '',
            name: 'install.ps1',
            path: 'tools/install.ps1'
          }
        ],
        folders: ['install.ps1'],
        id: 18,
        key: 26,
        name: 'tools',
        path: 'tools/install.ps1'
      }
    ])
    const resultAxios = instance.filterFiles(axiosTreeFolders, 'name', 'package')
    expect(resultAxios).toEqual([
      {
        attributions: ['(c) 2018 by Matt Zabriskie'],
        children: [
          {
            facets: [],
            folders: ['package.json'],
            hashes: { sha1: 'e2180deb3f1ee8d2c5fe6689bdeffc2e64a64d91' },
            id: 1,
            key: 9,
            license: 'MIT',
            name: 'package.json',
            path: 'package/package.json'
          }
        ],
        folders: ['axios.js'],
        hashes: { sha1: '94ece417aa560aa8de906e8f54c0985da90364cc' },
        id: 3,
        key: 1,
        name: 'package',
        path: 'package/dist/axios.js'
      }
    ])
  })

  it('filters files for facets', () => {
    const wrapper = shallow(<FileList component={definition} files={files} />)
    const instance = wrapper.instance()
    const resultAxios = axiosTreeFolders.map(record => instance.filterValues(record, 'facets', 'data'))
    expect(resultAxios).toEqual([
      {
        attributions: ['(c) 2018 by Matt Zabriskie'],
        children: [
          {
            attributions: ['(c) 2018 by Matt Zabriskie'],
            children: [
              {
                attributions: [{ isDifferent: false, value: '(c) 2018 by Matt Zabriskie' }],
                facets: [{ isDifferent: false, value: 'data' }],
                folders: ['axios.min.js'],
                hashes: { sha1: '2cdd24012271ad08af4dc5a85d4059143c324391' },
                id: 5,
                key: 5,
                license: '',
                name: 'axios.min.js',
                path: 'package/dist/axios.min.js'
              }
            ],
            folders: ['axios.js'],
            hashes: { sha1: '94ece417aa560aa8de906e8f54c0985da90364cc' },
            id: 3,
            key: 2,
            name: 'dist',
            path: 'package/dist/axios.js'
          }
        ],
        folders: ['axios.js'],
        hashes: { sha1: '94ece417aa560aa8de906e8f54c0985da90364cc' },
        id: 3,
        key: 1,
        name: 'package',
        path: 'package/dist/axios.js'
      }
    ])
  })

  it('filters files for copyrights', () => {
    const wrapper = shallow(<FileList component={definition} files={files} />)
    const instance = wrapper.instance()
    const resultAxios = axiosTreeFolders.map(record => instance.filterValues(record, 'attributions', 'Matt'))
    expect(resultAxios).toEqual([
      {
        attributions: ['(c) 2018 by Matt Zabriskie'],
        children: [
          {
            attributions: ['(c) 2018 by Matt Zabriskie'],
            children: [
              {
                attributions: [{ isDifferent: false, value: '(c) 2018 by Matt Zabriskie' }],
                facets: [],
                folders: ['axios.js'],
                hashes: { sha1: '94ece417aa560aa8de906e8f54c0985da90364cc' },
                id: 3,
                key: 3,
                license: '',
                name: 'axios.js',
                path: 'package/dist/axios.js'
              },
              {
                attributions: [{ isDifferent: false, value: '(c) 2018 by Matt Zabriskie' }],
                facets: [{ isDifferent: false, value: 'data' }],
                folders: ['axios.min.js'],
                hashes: { sha1: '2cdd24012271ad08af4dc5a85d4059143c324391' },
                id: 5,
                key: 5,
                license: '',
                name: 'axios.min.js',
                path: 'package/dist/axios.min.js'
              }
            ],
            folders: ['axios.js'],
            hashes: { sha1: '94ece417aa560aa8de906e8f54c0985da90364cc' },
            id: 3,
            key: 2,
            name: 'dist',
            path: 'package/dist/axios.js'
          },
          {
            attributions: [{ isDifferent: false, value: 'Copyright (c) 2014-present Matt Zabriskie' }],
            facets: [],
            folders: ['LICENSE'],
            hashes: { sha1: '0d6395f8c93ddfd98efcac7f511d42a286b22168' },
            id: 0,
            key: 7,
            license: 'MIT',
            name: 'LICENSE',
            path: 'package/LICENSE'
          }
        ],
        folders: ['axios.js'],
        hashes: { sha1: '94ece417aa560aa8de906e8f54c0985da90364cc' },
        id: 3,
        key: 1,
        name: 'package',
        path: 'package/dist/axios.js'
      }
    ])
  })
})

const files = [
  {
    path: 'AutoMapper.nuspec'
  },
  {
    path: 'lib/net45/AutoMapper.pdb'
  },
  {
    path: 'lib/netcoreapp2.0/AutoMapper.pdb'
  },
  {
    path: 'lib/netstandard1.3/AutoMapper.pdb'
  },
  {
    path: 'lib/netstandard2.0/AutoMapper.pdb'
  },
  {
    path: 'lib/net45/AutoMapper.dll'
  },
  {
    path: 'lib/net45/AutoMapper.xml'
  },
  {
    path: 'lib/netcoreapp2.0/AutoMapper.dll'
  },
  {
    path: 'lib/netcoreapp2.0/AutoMapper.xml'
  },
  {
    path: 'lib/netstandard1.3/AutoMapper.dll'
  },
  {
    path: 'lib/netstandard1.3/AutoMapper.xml'
  },
  {
    path: 'lib/netstandard2.0/AutoMapper.dll'
  },
  {
    path: 'lib/netstandard2.0/AutoMapper.xml'
  }
]

const definition = {
  isFetching: false,
  isFetched: true,
  item: {
    described: {
      sourceLocation: {
        type: 'git',
        provider: 'github',
        url: 'https://github.com/AutoMapper/AutoMapper/commit/75344b28d2152f1570c8261dce7346abfed2b837',
        revision: '75344b28d2152f1570c8261dce7346abfed2b837',
        namespace: 'AutoMapper',
        name: 'AutoMapper'
      },
      releaseDate: '2018-06-18',
      tools: ['clearlydefined/1'],
      toolScore: { total: 100, date: 30, source: 70 },
      score: { total: 100, date: 30, source: 70 }
    },
    files: [
      { path: 'AutoMapper.nuspec' },
      { path: 'lib/net45/AutoMapper.pdb' },
      { path: 'lib/netcoreapp2.0/AutoMapper.pdb' },
      { path: 'lib/netstandard1.3/AutoMapper.pdb' },
      { path: 'lib/netstandard2.0/AutoMapper.pdb' },
      { path: 'lib/net45/AutoMapper.dll' },
      { path: 'lib/net45/AutoMapper.xml' },
      { path: 'lib/netcoreapp2.0/AutoMapper.dll' },
      { path: 'lib/netcoreapp2.0/AutoMapper.xml' },
      { path: 'lib/netstandard1.3/AutoMapper.dll' },
      { path: 'lib/netstandard1.3/AutoMapper.xml' },
      { path: 'lib/netstandard2.0/AutoMapper.dll' },
      { path: 'lib/netstandard2.0/AutoMapper.xml' }
    ],
    coordinates: { type: 'nuget', provider: 'nuget', name: 'AutoMapper', revision: '7.0.1' },
    licensed: {
      toolScore: { total: 0, declared: 0, discovered: 0, consistency: 0, spdx: 0, texts: 0 },
      facets: { core: { attribution: { unknown: 13 }, discovered: { unknown: 13 }, files: 13 } },
      score: { total: 0, declared: 0, discovered: 0, consistency: 0, spdx: 0, texts: 0 }
    },
    schemaVersion: '1.1.0'
  },
  transformed:
    "coordinates:\n  name: AutoMapper\n  provider: nuget\n  revision: 7.0.1\n  type: nuget\ndescribed:\n  releaseDate: '2018-06-18'\n  score:\n    date: 30\n    source: 70\n    total: 100\n  sourceLocation:\n    name: AutoMapper\n    namespace: AutoMapper\n    provider: github\n    revision: 75344b28d2152f1570c8261dce7346abfed2b837\n    type: git\n    url: >-\n      https://github.com/AutoMapper/AutoMapper/commit/75344b28d2152f1570c8261dce7346abfed2b837\n  toolScore:\n    date: 30\n    source: 70\n    total: 100\n  tools:\n    - clearlydefined/1\nfiles:\n  - path: AutoMapper.nuspec\n  - path: lib/net45/AutoMapper.pdb\n  - path: lib/netcoreapp2.0/AutoMapper.pdb\n  - path: lib/netstandard1.3/AutoMapper.pdb\n  - path: lib/netstandard2.0/AutoMapper.pdb\n  - path: lib/net45/AutoMapper.dll\n  - path: lib/net45/AutoMapper.xml\n  - path: lib/netcoreapp2.0/AutoMapper.dll\n  - path: lib/netcoreapp2.0/AutoMapper.xml\n  - path: lib/netstandard1.3/AutoMapper.dll\n  - path: lib/netstandard1.3/AutoMapper.xml\n  - path: lib/netstandard2.0/AutoMapper.dll\n  - path: lib/netstandard2.0/AutoMapper.xml\nlicensed:\n  facets:\n    core:\n      attribution:\n        unknown: 13\n      discovered:\n        unknown: 13\n      files: 13\n  score:\n    consistency: 0\n    declared: 0\n    discovered: 0\n    spdx: 0\n    texts: 0\n    total: 0\n  toolScore:\n    consistency: 0\n    declared: 0\n    discovered: 0\n    spdx: 0\n    texts: 0\n    total: 0\nschemaVersion: 1.1.0\n",
  error: null,
  deleted: false
}

const nugetTreeFolders = [
  {
    path: 'lib/net20/Newtonsoft.Json.dll',
    id: 2,
    folders: ['Newtonsoft.Json.dll'],
    key: 1,
    name: 'lib',
    children: [
      {
        path: 'lib/net20/Newtonsoft.Json.dll',
        id: 2,
        folders: ['Newtonsoft.Json.dll'],
        key: 2,
        name: 'net20',
        children: [
          {
            path: 'lib/net20/Newtonsoft.Json.dll',
            id: 2,
            folders: ['Newtonsoft.Json.dll'],
            key: 3,
            name: 'Newtonsoft.Json.dll',
            license: '',
            facets: []
          },
          {
            path: 'lib/net20/Newtonsoft.Json.xml',
            id: 3,
            folders: ['Newtonsoft.Json.xml'],
            key: 4,
            name: 'Newtonsoft.Json.xml',
            license: '',
            facets: []
          }
        ]
      },
      {
        path: 'lib/net35/Newtonsoft.Json.dll',
        id: 4,
        folders: ['Newtonsoft.Json.dll'],
        key: 5,
        name: 'net35',
        children: [
          {
            path: 'lib/net35/Newtonsoft.Json.dll',
            id: 4,
            folders: ['Newtonsoft.Json.dll'],
            key: 6,
            name: 'Newtonsoft.Json.dll',
            license: '',
            facets: []
          },
          {
            path: 'lib/net35/Newtonsoft.Json.xml',
            id: 5,
            folders: ['Newtonsoft.Json.xml'],
            key: 7,
            name: 'Newtonsoft.Json.xml',
            license: '',
            facets: []
          }
        ]
      },
      {
        path: 'lib/net40/Newtonsoft.Json.dll',
        id: 6,
        folders: ['Newtonsoft.Json.dll'],
        key: 8,
        name: 'net40',
        children: [
          {
            path: 'lib/net40/Newtonsoft.Json.dll',
            id: 6,
            folders: ['Newtonsoft.Json.dll'],
            key: 9,
            name: 'Newtonsoft.Json.dll',
            license: '',
            facets: []
          },
          {
            path: 'lib/net40/Newtonsoft.Json.xml',
            id: 7,
            folders: ['Newtonsoft.Json.xml'],
            key: 10,
            name: 'Newtonsoft.Json.xml',
            license: '',
            facets: []
          }
        ]
      },
      {
        path: 'lib/net45/Newtonsoft.Json.dll',
        id: 8,
        folders: ['Newtonsoft.Json.dll'],
        key: 11,
        name: 'net45',
        children: [
          {
            path: 'lib/net45/Newtonsoft.Json.dll',
            id: 8,
            folders: ['Newtonsoft.Json.dll'],
            key: 12,
            name: 'Newtonsoft.Json.dll',
            license: '',
            facets: []
          },
          {
            path: 'lib/net45/Newtonsoft.Json.xml',
            id: 9,
            folders: ['Newtonsoft.Json.xml'],
            key: 13,
            name: 'Newtonsoft.Json.xml',
            license: '',
            facets: []
          }
        ]
      },
      {
        path: 'lib/netstandard1.0/Newtonsoft.Json.dll',
        id: 10,
        folders: ['Newtonsoft.Json.dll'],
        key: 14,
        name: 'netstandard1.0',
        children: [
          {
            path: 'lib/netstandard1.0/Newtonsoft.Json.dll',
            id: 10,
            folders: ['Newtonsoft.Json.dll'],
            key: 15,
            name: 'Newtonsoft.Json.dll',
            license: '',
            facets: []
          },
          {
            path: 'lib/netstandard1.0/Newtonsoft.Json.xml',
            id: 11,
            folders: ['Newtonsoft.Json.xml'],
            key: 16,
            name: 'Newtonsoft.Json.xml',
            license: '',
            facets: []
          }
        ]
      },
      {
        path: 'lib/netstandard1.3/Newtonsoft.Json.dll',
        id: 12,
        folders: ['Newtonsoft.Json.dll'],
        key: 17,
        name: 'netstandard1.3',
        children: [
          {
            path: 'lib/netstandard1.3/Newtonsoft.Json.dll',
            id: 12,
            folders: ['Newtonsoft.Json.dll'],
            key: 18,
            name: 'Newtonsoft.Json.dll',
            license: '',
            facets: []
          },
          {
            path: 'lib/netstandard1.3/Newtonsoft.Json.xml',
            id: 13,
            folders: ['Newtonsoft.Json.xml'],
            key: 19,
            name: 'Newtonsoft.Json.xml',
            license: '',
            facets: []
          }
        ]
      },
      {
        path: 'lib/portable-net40+sl5+win8+wpa81+wp8/Newtonsoft.Json.dll',
        id: 14,
        folders: ['Newtonsoft.Json.dll'],
        key: 20,
        name: 'portable-net40+sl5+win8+wpa81+wp8',
        children: [
          {
            path: 'lib/portable-net40+sl5+win8+wpa81+wp8/Newtonsoft.Json.dll',
            id: 14,
            folders: ['Newtonsoft.Json.dll'],
            key: 21,
            name: 'Newtonsoft.Json.dll',
            license: '',
            facets: []
          },
          {
            path: 'lib/portable-net40+sl5+win8+wpa81+wp8/Newtonsoft.Json.xml',
            id: 15,
            folders: ['Newtonsoft.Json.xml'],
            key: 22,
            name: 'Newtonsoft.Json.xml',
            license: '',
            facets: []
          }
        ]
      },
      {
        path: 'lib/portable-net45+win8+wpa81+wp8/Newtonsoft.Json.dll',
        id: 16,
        folders: ['Newtonsoft.Json.dll'],
        key: 23,
        name: 'portable-net45+win8+wpa81+wp8',
        children: [
          {
            path: 'lib/portable-net45+win8+wpa81+wp8/Newtonsoft.Json.dll',
            id: 16,
            folders: ['Newtonsoft.Json.dll'],
            key: 24,
            name: 'Newtonsoft.Json.dll',
            license: '',
            facets: []
          },
          {
            path: 'lib/portable-net45+win8+wpa81+wp8/Newtonsoft.Json.xml',
            id: 17,
            folders: ['Newtonsoft.Json.xml'],
            key: 25,
            name: 'Newtonsoft.Json.xml',
            license: '',
            facets: []
          }
        ]
      }
    ]
  },
  {
    path: 'tools/install.ps1',
    id: 18,
    folders: ['install.ps1'],
    key: 26,
    name: 'tools',
    children: [
      {
        path: 'tools/install.ps1',
        id: 18,
        folders: ['install.ps1'],
        key: 27,
        name: 'install.ps1',
        license: '',
        facets: []
      }
    ]
  },
  {
    path: '.signature.p7s',
    id: 19,
    folders: ['.signature.p7s'],
    key: 28,
    name: '.signature.p7s',
    license: '',
    facets: []
  },
  {
    path: 'LICENSE.md',
    token: 'b98a397897ff55f76cddc380041507a95a896b2946e0188703bf0496793d6516',
    license: 'MIT',
    natures: ['license'],
    id: 0,
    folders: ['LICENSE.md'],
    key: 29,
    name: 'LICENSE.md',
    facets: []
  },
  {
    path: 'Newtonsoft.Json.nuspec',
    id: 1,
    folders: ['Newtonsoft.Json.nuspec'],
    key: 30,
    name: 'Newtonsoft.Json.nuspec',
    license: '',
    facets: []
  }
]

const axiosTreeFolders = [
  {
    path: 'package/dist/axios.js',
    attributions: ['(c) 2018 by Matt Zabriskie'],
    hashes: { sha1: '94ece417aa560aa8de906e8f54c0985da90364cc' },
    id: 3,
    folders: ['axios.js'],
    key: 1,
    name: 'package',
    children: [
      {
        path: 'package/dist/axios.js',
        attributions: ['(c) 2018 by Matt Zabriskie'],
        hashes: { sha1: '94ece417aa560aa8de906e8f54c0985da90364cc' },
        id: 3,
        folders: ['axios.js'],
        key: 2,
        name: 'dist',
        children: [
          {
            path: 'package/dist/axios.js',
            attributions: [{ value: '(c) 2018 by Matt Zabriskie', isDifferent: false }],
            hashes: { sha1: '94ece417aa560aa8de906e8f54c0985da90364cc' },
            id: 3,
            folders: ['axios.js'],
            key: 3,
            name: 'axios.js',
            license: '',
            facets: []
          },
          {
            path: 'package/dist/axios.map',
            hashes: { sha1: 'df05900f61e69ba5fcc6965a562ae33539f30569' },
            id: 4,
            folders: ['axios.map'],
            key: 4,
            name: 'axios.map',
            license: '',
            facets: []
          },
          {
            path: 'package/dist/axios.min.js',
            attributions: [{ value: '(c) 2018 by Matt Zabriskie', isDifferent: false }],
            hashes: { sha1: '2cdd24012271ad08af4dc5a85d4059143c324391' },
            id: 5,
            folders: ['axios.min.js'],
            key: 5,
            name: 'axios.min.js',
            license: '',
            facets: [{ value: 'data', isDifferent: false }]
          },
          {
            path: 'package/dist/axios.min.map',
            hashes: { sha1: '3342217636d264d26f781081b9ee279b74021ac6' },
            id: 6,
            folders: ['axios.min.map'],
            key: 6,
            name: 'axios.min.map',
            license: '',
            facets: []
          }
        ]
      },
      {
        path: 'package/LICENSE',
        license: 'MIT',
        attributions: [{ value: 'Copyright (c) 2014-present Matt Zabriskie', isDifferent: false }],
        hashes: { sha1: '0d6395f8c93ddfd98efcac7f511d42a286b22168' },
        id: 0,
        folders: ['LICENSE'],
        key: 7,
        name: 'LICENSE',
        facets: []
      },
      {
        path: 'package/README.md',
        hashes: { sha1: '4582c5ca25c5f44099608824d0df9e6cb393b159' },
        id: 2,
        folders: ['README.md'],
        key: 8,
        name: 'README.md',
        license: '',
        facets: []
      },
      {
        path: 'package/package.json',
        license: 'MIT',
        hashes: { sha1: 'e2180deb3f1ee8d2c5fe6689bdeffc2e64a64d91' },
        id: 1,
        folders: ['package.json'],
        key: 9,
        name: 'package.json',
        facets: []
      }
    ]
  }
]
