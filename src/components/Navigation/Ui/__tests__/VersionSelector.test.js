import React from 'react'
import { render, screen } from '@testing-library/react'
import VersionSelector from '../VersionSelector'

describe('VersionSelector', () => {
  it('renders without crashing', () => {
    render(<VersionSelector />)
  })

  it('renders modal with OK and Cancel buttons when shown', () => {
    render(<VersionSelector show={true} />)
    expect(screen.getByRole('button', { name: /ok/i })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /cancel/i })).toBeInTheDocument()
  })

  it('disables OK button when no version is selected', () => {
    const npmComponent = { type: 'npm', provider: 'npmjs', name: 'test', revision: '1.0.0' }
    render(<VersionSelector component={npmComponent} show={true} />)
    expect(screen.getByRole('button', { name: /ok/i })).toBeDisabled()
  })

  it('renders with github component', () => {
    const gitHubComponent = { type: 'git', provider: 'github', namespace: 'github', name: 'fetch', revision: 'v2.0.3' }
    render(<VersionSelector component={gitHubComponent} show={true} />)
    // Modal renders with buttons
    expect(screen.getByRole('button', { name: /ok/i })).toBeInTheDocument()
  })

  it('renders with npm component', () => {
    const npmComponent = { type: 'npm', provider: 'npmjs', name: 'npmlog', revision: '4.1.2' }
    render(<VersionSelector component={npmComponent} show={true} />)
    expect(screen.getByRole('button', { name: /ok/i })).toBeInTheDocument()
  })

  it('renders with maven component', () => {
    const mavenComponent = {
      type: 'maven',
      provider: 'mavencentral',
      namespace: 'org.apache.maven',
      name: 'maven-plugin-api',
      revision: '3.5.2'
    }
    render(<VersionSelector component={mavenComponent} show={true} />)
    expect(screen.getByRole('button', { name: /ok/i })).toBeInTheDocument()
  })

  it('renders with nuget component', () => {
    const nugetComponent = { type: 'nuget', provider: 'nuget', name: 'NuGet.VisualStudio', revision: '2.8.2' }
    render(<VersionSelector component={nugetComponent} show={true} />)
    expect(screen.getByRole('button', { name: /ok/i })).toBeInTheDocument()
  })

  it('renders with pypi component', () => {
    const pypiComponent = { type: 'pypi', provider: 'pypi', name: 'pyaml', revision: '17.8.0' }
    render(<VersionSelector component={pypiComponent} show={true} />)
    expect(screen.getByRole('button', { name: /ok/i })).toBeInTheDocument()
  })

  it('renders with rubygems component', () => {
    const rubygemsComponent = { type: 'gem', provider: 'rubygems', name: 'thread_safe', revision: '0.3.6' }
    render(<VersionSelector component={rubygemsComponent} show={true} />)
    expect(screen.getByRole('button', { name: /ok/i })).toBeInTheDocument()
  })

  it('renders with debian component', () => {
    const debianComponent = { type: 'deb', provider: 'debian', name: 'pyaml', revision: '17.8.0' }
    render(<VersionSelector component={debianComponent} show={true} />)
    expect(screen.getByRole('button', { name: /ok/i })).toBeInTheDocument()
  })
})
