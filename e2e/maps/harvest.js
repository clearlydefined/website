export const harvestMap = {
  npmComponent: 'chai',
  githubComponent: 'clearlydefined',
  githubRepo: 'website',
  npmButton: '[name="npmjs"]',
  githubButton: '[name="github"]',
  mavencentralButton: '[name="mavencentral"]',
  nugetButton: '[name="nuget"]',
  cratesioButton: '[name="cratesio"]',
  pypiButton: '[name="pypi"]',
  rubygemsButton: '[name="rubygems"]',
  npmPicker: '[placeholder="Pick an NPM to harvest"]',
  npmVersionPicker: '[placeholder="Pick an NPM version"]',
  githubUserPicker: '[placeholder="User / Organization"]',
  githubRepoPicker: '[placeholder="Repo"]',
  githubCommitPicker: '[placeholder="Pick a tag or enter a commit hash"]',
  npmSelectorFirstElement: '#npm-selector-item-0',
  githubUserSelectorFirstElement: '#github-namespace-selector-item-0',
  githubRepoSelectorFirstElement: '#github-component-selector-item-0',
  npmVersionSelectorFirstElement: '#npm-version-picker-item-0',
  githubCommitSelectorFirstElement: '#github-commit-picker-item-0',
  componentList: {
    list: '.ReactVirtualized__Grid__innerScrollContainer',
    firstElement: 'div:nth-child(0n+1) .two-line-entry',
    secondElement: 'div:nth-child(0n+2) .two-line-entry'
  },
  component: {
    name: '.list-headline'
  }
}
