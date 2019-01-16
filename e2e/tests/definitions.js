// Copyright (c) Microsoft Corporation and others. Licensed under the MIT license.
// SPDX-License-Identifier: MIT
describe('Definitions page', () => {
  beforeAll(async () => {
    await page.goto(`${__HOST__}/definitions`, { timeout: 40000, waitUntil: 'domcontentloaded' })
  })

  it('should display "Available definitions" text on page', async () => {
    await expect(page).toMatch('Available definitions')
  })

  test('user can type a definition text and should display a component in the list', async () => {
    await page.waitForSelector('.rbt-input-main')
    await page.click('.rbt-input-main')
    await page.type('.rbt-input-main', 'async')
    await page.waitFor(4000)
    await page.waitForSelector('.rbt-menu>li')
    let element = await page.$('.rbt-menu li:nth-child(0n+2) a')
    element.click()
    await page.waitForSelector('.ReactVirtualized__Grid__innerScrollContainer')
    await page.screenshot({ path: 'screenshot.png' })
  })
})
