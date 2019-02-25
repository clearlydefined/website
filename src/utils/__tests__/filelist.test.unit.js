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
  { key: 1, license: 'MIT', name: 'LICENSE.md' },
  { key: 2, license: null, name: 'Newtonsoft.Json.nuspec' },
  {
    children: [
      {
        children: [
          { key: 5, license: null, name: 'Newtonsoft.Json.dll' },
          { key: 6, license: null, name: 'Newtonsoft.Json.xml' }
        ],
        key: 4,
        name: 'net20'
      }
    ],
    key: 3,
    name: 'lib'
  },
  { children: [{ key: 8, license: null, name: 'install.ps1' }], key: 7, name: 'tools' },
  { key: 9, license: null, name: '.signature.p7s' }
]

describe('FileListSpec', () => {
  it('renders without crashing', () => {
    const treeFolders = FileListSpec.pathToTreeFolders(testFiles)
    expect(treeFolders).toEqual(expectedFolders)
  })
})
