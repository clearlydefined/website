// Copyright (c) Microsoft Corporation and others. Licensed under the MIT license.
// SPDX-License-Identifier: MIT

async function clickLink(page, text) {
  await expect(page).toClick('a', { text })
}

describe('Navbar', () => {
  beforeAll(async () => {
    await page.goto(__HOST__)
  })

  it('should have a link to the Definitions page', async () => {
    await clickLink(page, 'Definitions')
    await expect(page).toMatch('Available definitions')
  })
  it('should have a link to the About page', async () => {
    await clickLink(page, 'About')
    await expect(page).toMatch('About ClearlyDefined')
  })
  it('should have a link to the Docs page', async () => {
    await clickLink(page, 'Docs')
  })
})
