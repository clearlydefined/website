import React from 'react'
import { render } from '@testing-library/react'
import VersionSelector from '../VersionSelector'

describe('VersionSelector', () => {
  it('renders without crashing', () => {
    render(<VersionSelector />)
  })

  it('renders with github component', () => {
    const gitHubComponent = { type: 'git', provider: 'github', namespace: 'github', name: 'fetch', revision: 'v2.0.3' }
    render(<VersionSelector component={gitHubComponent} />)
  })

  it('renders with npm component', () => {
    const npmComponent = { type: 'npm', provider: 'npmjs', name: 'npmlog', revision: '4.1.2' }
    render(<VersionSelector component={npmComponent} />)
  })

  it('renders with maven component', () => {
    const mavenComponent = {
      type: 'maven',
      provider: 'mavencentral',
      namespace: 'org.apache.maven',
      name: 'maven-plugin-api',
      revision: '3.5.2'
    }
    render(<VersionSelector component={mavenComponent} />)
  })

  it('renders with nuget component', () => {
    const nugetComponent = { type: 'nuget', provider: 'nuget', name: 'NuGet.VisualStudio', revision: '2.8.2' }
    render(<VersionSelector component={nugetComponent} />)
  })

  it('renders with pypi component', () => {
    const pypiComponent = { type: 'pypi', provider: 'pypi', name: 'pyaml', revision: '17.8.0' }
    render(<VersionSelector component={pypiComponent} />)
  })

  it('renders with rubygems component', () => {
    const rubygemsComponent = { type: 'gem', provider: 'rubygems', name: 'thread_safe', revision: '0.3.6' }
    render(<VersionSelector component={rubygemsComponent} />)
  })

  it('renders with debian component', () => {
    const debianComponent = { type: 'deb', provider: 'debian', name: 'pyaml', revision: '17.8.0' }
    render(<VersionSelector component={debianComponent} />)
  })
})
