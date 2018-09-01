// Copyright (c) Microsoft Corporation and others. Licensed under the MIT license.
// SPDX-License-Identifier: MIT

async function searchFor(page, text) {
  await expect(page).toFill('[placeholder="Component search..."]', text)
}

async function selectSearchResult(page, ariaLabel) {
  await expect(page).toClick(`[aria-label="${ariaLabel}"]`, { timeout: 2000 })
}

describe('Definitions page', () => {
  beforeAll(async () => {
    await page.goto(__HOST__)
    await expect(page).toClick('a', { text: 'Definitions' })
  })

  describe('Filterbar', () => {
    // @todo sort out a way to have pristine servicedata for reproducible tests
    it('should render 2 component search results for "finderjs"', async () => {
      await searchFor(page, 'finderjs')
      await expect(page).toMatch('npm/npmjs/-/finderjs/1.1.3', { timeout: 2000 })
      await expect(page).toMatch('git/github/mynameistechno/finderjs')
    })

    it('should display a definition for "finderjs" upon selection', async () => {
      await searchFor(page, 'finderjs')
      await selectSearchResult(page, 'npm/npmjs/-/finderjs/1.1.3')
      await expect(page).toMatch('finderjs 1.1.3')
      await expect(page).toMatch('MIT')
    })
  })
})
