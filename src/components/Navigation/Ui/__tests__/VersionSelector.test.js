import React from 'react'
import { mount, shallow } from 'enzyme'
import VersionSelector from '../VersionSelector'

const mockedStringVersions = [
  '4.1.2',
  '4.1.1',
  '4.1.0',
  '4.0.2',
  '4.0.1',
  '4.0.0',
  '3.1.2',
  '3.1.1',
  '3.1.0',
  '3.0.0',
  '2.0.4',
  '2.0.3',
  '2.0.2',
  '2.0.1',
  '2.0.0',
  '1.2.1',
  '1.2.0',
  '1.1.0',
  '1.0.0',
  '0.1.1',
  '0.1.0',
  '0.0.6',
  '0.0.5',
  '0.0.4',
  '0.0.3',
  '0.0.2',
  '0.0.1'
]

const mockedObjectVersions = [
  { tag: 'v3.0.0', sha: 'cc84bc284bd2d8eeddaf1c6a68e02e5329482f97' },
  { tag: 'v2.0.4', sha: 'cbb313bf09512efda9444e40fe9e8ac432ac1108' },
  { tag: 'v2.0.3', sha: 'd4ed806fdcbdeaef707d27f6c88943f0336a647d' },
  { tag: 'v2.0.2', sha: 'b337f9578fa8e21fa5c9fe8d6eb74baaa43a1c02' },
  { tag: 'v2.0.1', sha: 'b54dbacecabeaf0eb4ee6a7cd6fb5daf54e00d8c' },
  { tag: 'v2.0.0', sha: 'c576d61fee39bb34699bbe870460b6120011150a' },
  { tag: 'v1.1.1', sha: 'f7a514829820fc77c0f884c74cf2d36356a781c0' },
  { tag: 'v1.1.0', sha: '76f6a09cbfc1c955479dd9da2a333f7404c79de2' },
  { tag: 'v1.0.0', sha: 'ad96feb721393590a1b79dd2646854f5cbb16186' },
  { tag: 'v0.9.0', sha: '030e72106cd7b2f1e616a4af6503ee3a6df0bdf5' },
  { tag: 'v0.8.2', sha: '0b3e1d7c41c75359a3e0b771741ebc2a8823da38' },
  { tag: 'v0.8.1', sha: '09c316d2450c08fde129336438b3a44de4e8177c' },
  { tag: 'v0.8.0', sha: '14462ef52357047dfc60a96c1d445c84271154d2' },
  { tag: 'v0.7.0', sha: '115cd972a7d5dbc63bd2335a05976070e0ebc48c' },
  { tag: 'v0.6.1', sha: '5df663e716ff6bc19590296d7dfdbf37c897e175' },
  { tag: 'v0.6.0', sha: '4d793121a940aa5d09af5edcf0ad2ce0e75336b2' },
  { tag: 'v0.5.0', sha: '91ae44c167be4ce7c00f9a91a244950f224bf6ab' },
  { tag: 'v0.4.0', sha: '8654a43fb88c8c57a7a75813fed3c9ed50311926' },
  { tag: 'v0.3.2', sha: '830231e5682175fe04088b291192f72c59aed998' },
  { tag: 'v0.3.1', sha: 'eb3f9b2b1fa7804883cbf853102944847d65e204' },
  { tag: 'v0.3.0', sha: '1738126887adaed3782acd0da167dc9118264c4d' },
  { tag: 'v0.2.1', sha: '81601803ec9fd1ffa29f4d527b12e586dd9840c1' },
  { tag: 'v0.2.0', sha: 'ea501dc32267a159e4a6ea067b7f9b6fab9c23de' },
  { tag: 'v0.11.1', sha: '7d9a11deec5c0ea2d453390be647ba52695166f8' },
  { tag: 'v0.11.0', sha: '989a1e8132e9adb4c4e973875ad043ff7219fc5a' },
  { tag: 'v0.10.1', sha: 'f4f8ca8d0ba6c7d11e5317a84189913cefe55809' },
  { tag: 'v0.10.0', sha: '92de9f1b87f0defc3673470044a4477080533324' },
  { tag: 'v0.1.0', sha: 'bee911f66a6c4b1128a6ff5683d0faa35195fff7' }
]
describe('VersionSelector', () => {
  it('renders without crashing', () => {
    shallow(<VersionSelector />)
  })
  it('renders with github component', async () => {
    const gitHubComponent = { type: 'git', provider: 'github', namespace: 'github', name: 'fetch', revision: 'v2.0.3' }
    const wrapper = shallow(<VersionSelector />)
    wrapper.setProps({ component: gitHubComponent })
    wrapper.setState({
      options: mockedObjectVersions
    })
    expect(wrapper.state().options).toEqual(mockedObjectVersions)
  })
  it('renders with npm component', async () => {
    const npmComponent = { type: 'npm', provider: 'npmjs', name: 'npmlog', revision: '4.1.2' }
    const wrapper = shallow(<VersionSelector />)
    wrapper.setProps({ component: npmComponent })
    wrapper.setState({
      options: mockedStringVersions
    })
    expect(wrapper.state().options).toEqual(mockedStringVersions)
  })
  it('renders with maven component', async () => {
    const mavenComponent = {
      type: 'maven',
      provider: 'mavencentral',
      namespace: 'org.apache.maven',
      name: 'maven-plugin-api',
      revision: '3.5.2'
    }
    const wrapper = shallow(<VersionSelector />)
    wrapper.setProps({ component: mavenComponent })
    wrapper.setState({
      options: mockedStringVersions
    })
    expect(wrapper.state().options).toEqual(mockedStringVersions)
  })
  it('renders with nuget component', async () => {
    const nugetComponent = { type: 'nuget', provider: 'nuget', name: 'NuGet.VisualStudio', revision: '2.8.2' }
    const wrapper = shallow(<VersionSelector />)
    wrapper.setProps({ component: nugetComponent })
    wrapper.setState({
      options: mockedStringVersions
    })
    expect(wrapper.state().options).toEqual(mockedStringVersions)
  })
  it('renders with pypi component', async () => {
    const pypiComponent = { type: 'pypi', provider: 'pypi', name: 'pyaml', revision: '17.8.0' }
    const wrapper = shallow(<VersionSelector />)
    wrapper.setProps({ component: pypiComponent })
    wrapper.setState({
      options: mockedStringVersions
    })
    expect(wrapper.state().options).toEqual(mockedStringVersions)
  })
  it('renders with rubygems component', async () => {
    const rubygemsComponent = { type: 'gem', provider: 'rubygems', name: 'thread_safe', revision: '0.3.6' }
    const wrapper = shallow(<VersionSelector />)
    wrapper.setProps({ component: rubygemsComponent })
    wrapper.setState({
      options: mockedStringVersions
    })
    expect(wrapper.state().options).toEqual(mockedStringVersions)
  })
})
