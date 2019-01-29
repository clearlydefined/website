// Copyright (c) Microsoft Corporation and others. Licensed under the MIT license.
// SPDX-License-Identifier: MIT
const puppeteer = require('puppeteer')

let page
let browser

describe('Definitions page', () => {
  beforeAll(async () => {
    if (process.env.NODE_ENV === 'debug') {
      browser = await puppeteer.launch({ headless: false, slowMo: 80 })
      page = await browser.newPage()
    }
    await page.setViewport({ width: 1920, height: 1080 })
    await page.goto(`${__HOST__}/definitions`, { timeout: 40000, waitUntil: 'domcontentloaded' })
  })

  afterAll(() => {
    browser.close()
  })

  test('should display "Available definitions" text on page', async () => {
    await expect(page).toMatch('Available definitions')
  })

  test(
    'user can type a definition text and should display a component in the list',
    async () => {
      await expect(page).toMatchElement('.rbt-input-main')
      await expect(page).toClick('.rbt-input-main')
      await page.type('.rbt-input-main', 'async')
      await page.waitFor(2000)
      await expect(page).toMatchElement('.rbt-menu>li')
      let element = await page.$('.rbt-menu li:nth-child(1) a')
      element.click()
      await expect(page).toMatchElement('.components-list')
      await expect(page).toMatchElement('.components-list div:nth-child(0n+1) .component-row')
      const componentTitle = await page.$('.component-name')
      const text = await (await componentTitle.getProperty('textContent')).jsonValue()
      await expect(text).toMatch('async')
      await expect(page).toMatchElement(`.list-image`)
      await expect(page).toMatchElement(`.list-activity-area`)
      await expect(page).toMatchElement(`.list-fa-button > i.fa-code`)
      await expect(page).toMatchElement(`.list-fa-button > i.fa-search`)
      await expect(page).toMatchElement(`.list-fa-button > i.fa-copy`)
      await expect(page).toMatchElement(`.list-fa-button > i.fa-exchange-alt`)
      await expect(page).toMatchElement(`.list-fa-button > i.fa-undo`)
      await expect(page).toMatchElement(`.btn-link > i.list-remove`)
    },
    10000
  )

  test(
    'should display the detail after clicking on a component in the list',
    async () => {
      const firstElement = '.components-list > .ReactVirtualized__Grid__innerScrollContainer > div:nth-child(1)'
      await expect(page).toClick(firstElement)
      await expect(page).toMatchElement(`${firstElement} > div.two-line-entry > div.list-panel`)
      const component = `${firstElement} > div.two-line-entry > div.list-panel > div`
      const declaredElement = await page.$(`${component} > div.col-md-5 > div:nth-child(1) > div.col-md-2 > b`)
      const declaredContent = await (await declaredElement.getProperty('textContent')).jsonValue()
      await expect(declaredContent).toMatch('Declared')
      const sourceElement = await page.$(`${component} > div.col-md-5 > div:nth-child(2) > div.col-md-2 > b`)
      const sourceContent = await (await sourceElement.getProperty('textContent')).jsonValue()
      await expect(sourceContent).toMatch('Source')
      const releaseElement = await page.$(`${component} > div.col-md-5 > div:nth-child(3) > div.col-md-2 > b`)
      const releaseContent = await (await releaseElement.getProperty('textContent')).jsonValue()
      await expect(releaseContent).toMatch('Release')
      const discoveredElement = await page.$(`${component} > div.col-md-7 > div:nth-child(1) > div.col-md-2 > b`)
      const discoveredContent = await (await discoveredElement.getProperty('textContent')).jsonValue()
      await expect(discoveredContent).toMatch('Discovered')
      const attributionElement = await page.$(`${component} > div.col-md-7 > div:nth-child(2) > div.col-md-2 > b`)
      const attributionContent = await (await attributionElement.getProperty('textContent')).jsonValue()
      await expect(attributionContent).toMatch('Attribution')
      const filesElement = await page.$(`${component} > div.col-md-7 > div:nth-child(3) > div.col-md-2 > b`)
      const filesContent = await (await filesElement.getProperty('textContent')).jsonValue()
      await expect(filesContent).toMatch('Files')
    },
    10000
  )

  test(
    'should edit a license of a component in the list',
    async () => {
      await expect(page).toMatchElement(`[name="licensed.declared"] > span > span`)
      await expect(page).toClick(`[name="licensed.declared"] > span > span`)
      await expect(page).toMatchElement(`.spdx-picker`)

      const inputValue = await page.$eval(
        `.spdx-input-picker > div.rbt-input.form-control > .rbt-input-wrapper > div > .rbt-input-main`,
        el => el.value
      )
      await expect(page).toClick(
        `.spdx-input-picker > div.rbt-input.form-control > .rbt-input-wrapper > div > .rbt-input-main`,
        'MIT'
      )
      for (let i = 0; i < inputValue.length; i++) {
        await page.keyboard.press('Backspace')
      }
      await page.type(
        `.spdx-input-picker > div.rbt-input.form-control > .rbt-input-wrapper > div > .rbt-input-main`,
        'MIT'
      )
      await expect(page).toClick('#rbt-menu-item-1')
      await expect(page).toClick('.spdx-picker-header-buttons.col-md-2 > button.btn.btn-success')
      await expect(page).toMatchElement(`[name="licensed.declared"] > span > span.bg-info`)
    },
    10000
  )

  test(
    'should open a modal while attempt to change a source location of a component in the list',
    async () => {
      await expect(page).toMatchElement(`[name="described.sourceLocation"] > .fas.fa-pencil-alt.editable-marker`)
      await expect(page).toClick(`[name="described.sourceLocation"] > .fas.fa-pencil-alt.editable-marker`)
      await expect(page).toMatchElement(`#source-picker`)
      const sourcePickerModal = await page.$(`#source-picker`)
      await expect(sourcePickerModal).not.toBeNull()
      await expect(page).toMatchElement(`#source-picker .btn-success`)
      await expect(page).toClick(`#source-picker .btn-success`)
      await expect(page).toMatchElement(`#source-picker`, { hidden: true })
      const hiddenSourcePickerModal = await page.$(`#source-picker`)
      await expect(hiddenSourcePickerModal).toBeNull()
    },
    10000
  )

  test(
    'should show an input field while attempting to change the release date of a component in the list',
    async () => {
      await expect(page).toMatchElement(`[name="described.releaseDate"] > .fas.fa-pencil-alt.editable-marker`)
      await expect(page).toClick(`[name="described.releaseDate"] > .fas.fa-pencil-alt.editable-marker`)
      await expect(page).toMatchElement(`[name="described.releaseDate"] > input`)
    },
    10000
  )

  test(
    'should display a modal after clicking on the inspect button of a definition the list',
    async () => {
      await expect(page).toMatchElement(`.list-fa-button > i.fa-search`)
      await expect(page).toClick(`.list-fa-button > i.fa-search`)
      await expect(page).toMatchElement('.fullDetaiView__modal')
      await expect(page).toMatchElement('.fullDetaiView__modal .save-button.btn.btn-primary', { timeout: 5000 })
      await expect(page).toClick('.fullDetaiView__modal .save-button.btn.btn-primary')
    },
    20000
  )
  test(
    'should open the contribution modal',
    async () => {
      await expect(page).toMatchElement('.contribute-button')
      await expect(page).toClick('.contribute-button')
      await page.waitForSelector('#contribute-modal')
      await expect(page).toFill('#contribute-modal input[name="summary"]', 'AUTOMATION TEST')
      await expect(page).toFill('#contribute-modal textarea[name="details"]', 'AUTOMATION TEST')
      await expect(page).toFill('#contribute-modal textarea[name="resolution"]', 'AUTOMATION TEST')
      await page.waitForSelector('#contribute-modal select[name="type"]')
      await page.select('select[name="type"]', 'missing')
      await expect(page).toMatchElement('#contribute-modal .contribute-button')
      await expect(page).toClick('#contribute-modal .contribute-button')
      await expect(page).toMatchElement('.contribution-success', { timeout: 10000 })
    },
    20000
  )
})
