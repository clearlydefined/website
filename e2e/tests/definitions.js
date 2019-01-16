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
    await page.waitFor(2000)
    await page.waitForSelector('.rbt-menu>li')
    let element = await page.$('.rbt-menu li:nth-child(0n+2) a')
    element.click()
    await page.waitForSelector('.ReactVirtualized__Grid__innerScrollContainer')
    await page.waitFor(2000)
    await page.waitForSelector('.ReactVirtualized__Grid__innerScrollContainer div:nth-child(0n+1) .two-line-entry')
    const componentTitle = await page.$(
      '#root > div > main > div > div:nth-child(2) > div:nth-child(2) > div > div > div:nth-child(2) > div > div > div > div > div > div.list-body > div.list-headline > span > span:nth-child(1) > a'
    )
    const text = await (await componentTitle.getProperty('textContent')).jsonValue()
    await expect(text).toMatch('async')
    await page.waitForSelector(
      '#root > div > main > div > div:nth-child(2) > div:nth-child(2) > div > div > div:nth-child(2) > div > div > div > div > div > div.list-activity-area > img'
    )
    await page.waitForSelector(
      '#root > div > main > div > div:nth-child(2) > div:nth-child(2) > div > div > div:nth-child(2) > div > div > div > div > div > div.list-activity-area > .btn-group'
    )
    await page.waitForSelector(
      '#root > div > main > div > div:nth-child(2) > div:nth-child(2) > div > div > div:nth-child(2) > div > div > div > div > div > div.list-activity-area > .btn-group'
    )
  })

  test('should display a modal after clicking on a component in the list', async () => {
    await page.waitForSelector(
      '#root > div > main > div > div:nth-child(2) > div:nth-child(2) > div > div > div:nth-child(2) > div > div > div > div > div > div.list-activity-area > div > div:nth-child(2) > button'
    )
    await page.click(
      '#root > div > main > div > div:nth-child(2) > div:nth-child(2) > div > div > div:nth-child(2) > div > div > div > div > div > div.list-activity-area > div > div:nth-child(2) > button'
    )
    await page.waitFor(4000)
    page.waitForSelector('body > div:nth-child(8) > div > div.ant-modal-wrap.ant-modal-centered > div')
  })
})