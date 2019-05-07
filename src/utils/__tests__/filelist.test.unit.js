import FileListSpec from '../filelist'

const testFiles = [
  {
    path: 'LICENSE.md',
    token: 'b98a397897ff55f76cddc380041507a95a896b2946e0188703bf0496793d6516',
    license: 'MIT',
    natures: ['license']
  },
  { path: 'Newtonsoft.Json.nuspec' },
  { path: 'lib/net20/Newtonsoft.Json.dll' },
  { path: 'lib/net20/Newtonsoft.Json.xml' },
  { path: 'tools/install.ps1' },
  { path: '.signature.p7s' }
]
const expectedFolders = [
  {
    children: [
      {
        children: [
          {
            attributions: undefined,
            facets: [],
            folders: ['Newtonsoft.Json.dll'],
            id: 2,
            key: 3,
            license: '',
            name: 'Newtonsoft.Json.dll',
            path: 'lib/net20/Newtonsoft.Json.dll'
          },
          {
            attributions: undefined,
            facets: [],
            folders: ['Newtonsoft.Json.xml'],
            id: 3,
            key: 4,
            license: '',
            name: 'Newtonsoft.Json.xml',
            path: 'lib/net20/Newtonsoft.Json.xml'
          }
        ],
        folders: ['Newtonsoft.Json.dll'],
        id: 2,
        key: 2,
        name: 'net20',
        path: 'lib/net20/Newtonsoft.Json.dll'
      }
    ],
    folders: ['Newtonsoft.Json.dll'],
    id: 2,
    key: 1,
    name: 'lib',
    path: 'lib/net20/Newtonsoft.Json.dll'
  },
  {
    children: [
      {
        attributions: undefined,
        facets: [],
        folders: ['install.ps1'],
        id: 4,
        key: 6,
        license: '',
        name: 'install.ps1',
        path: 'tools/install.ps1'
      }
    ],
    folders: ['install.ps1'],
    id: 4,
    key: 5,
    name: 'tools',
    path: 'tools/install.ps1'
  },
  {
    attributions: undefined,
    facets: [],
    folders: ['.signature.p7s'],
    id: 5,
    key: 7,
    license: '',
    name: '.signature.p7s',
    path: '.signature.p7s'
  },
  {
    attributions: undefined,
    facets: [],
    folders: ['LICENSE.md'],
    id: 0,
    key: 8,
    license: 'MIT',
    name: 'LICENSE.md',
    natures: ['license'],
    path: 'LICENSE.md',
    token: 'b98a397897ff55f76cddc380041507a95a896b2946e0188703bf0496793d6516'
  },
  {
    attributions: undefined,
    facets: [],
    folders: ['Newtonsoft.Json.nuspec'],
    id: 1,
    key: 9,
    license: '',
    name: 'Newtonsoft.Json.nuspec',
    path: 'Newtonsoft.Json.nuspec'
  }
]

describe('FileListSpec', () => {
  it('renders without crashing', () => {
    const treeFolders = FileListSpec.pathToTreeFolders(testFiles)
    expect(treeFolders).toEqual(expectedFolders)
  })
})
