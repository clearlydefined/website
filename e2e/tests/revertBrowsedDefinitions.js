// Copyright (c) Microsoft Corporation and others. Licensed under the MIT license.
// SPDX-License-Identifier: MIT
import { browseMap } from '../maps/browse'
import { setDefaultOptions } from 'expect-puppeteer'

const puppeteer = require('puppeteer')
const defaultTimeout = process.env.JEST_TIMEOUT ? process.env.JEST_TIMEOUT : 30000

setDefaultOptions({ timeout: defaultTimeout })
let browser
let page

describe(
  'Revert changes on Browse page',
  () => {
    beforeAll(async () => {
      jest.setTimeout(defaultTimeout)
      browser = await puppeteer.launch({ headless: process.env.NODE_ENV !== 'debug', slowMo: 80 })
      page = await browser.newPage()
      await page.setViewport({ width: 1920, height: 1080 })
      await page.goto(`${__HOST__}`, { waitUntil: 'domcontentloaded' })
    })

    afterAll(() => {
      browser.close()
    })

    test('user can type a definition text and should display a component in the list', async () => {
      await page.waitForSelector(browseMap.component.image)
      await page.waitForSelector(browseMap.component.firstElement)
      await expect(page).toClick(browseMap.component.firstElement)
    })

    test('user can revert license field value', async () => {
      await licenseEdit()
      await page.waitForSelector(browseMap.component.details.revertLicenseButton)
      const revertLicenseButton = await page.$(browseMap.component.details.revertLicenseButton)
      const revertClassName = await (await revertLicenseButton.getProperty('className')).jsonValue()
      await expect(revertClassName.includes('fa-disabled')).toBe(false)
      await expect(page).toClick(browseMap.component.details.revertLicenseButton)
      await page.waitForSelector(browseMap.component.details.licenseField)
      const licenseField = await page.$(browseMap.component.details.licenseField)
      const licenseFieldValue = await (await licenseField.getProperty('textContent')).jsonValue()
      await expect(licenseFieldValue).toEqual('MIT OR Apache-2.0')
    })

    test('user can revert entire definition changes', async () => {
      await licenseEdit()
      await page.waitForSelector(browseMap.component.revertButton)
      await expect(page).toClick(browseMap.component.revertButton)
      await page.waitForSelector(browseMap.notification.revertButton)
      await expect(page).toClick(browseMap.notification.revertButton)
      await page.waitForSelector(browseMap.component.firstElement)
      await expect(page).toClick(browseMap.component.firstElement)
      const licenseField = await page.$(browseMap.component.details.licenseField)
      const licenseFieldValue = await (await licenseField.getProperty('textContent')).jsonValue()
      await expect(licenseFieldValue).toEqual('MIT OR Apache-2.0')
    })

    test('user can revert all changes', async () => {
      await licenseEdit()
      await page.waitForSelector(browseMap.revertButton)
      await expect(page).toClick(browseMap.revertButton)
      await page.waitForSelector(browseMap.notification.revertButton)
      await expect(page).toClick(browseMap.notification.revertButton)
      await page.waitForSelector(browseMap.component.firstElement)
      await expect(page).toClick(browseMap.component.firstElement)
      const licenseField = await page.$(browseMap.component.details.licenseField)
      const licenseFieldValue = await (await licenseField.getProperty('textContent')).jsonValue()
      await expect(licenseFieldValue).toEqual('MIT OR Apache-2.0')
    })
  },
  defaultTimeout
)

const licenseEdit = async () => {
  await page.waitForSelector(browseMap.component.details.licensePickerButton)
  await expect(page).toClick(browseMap.component.details.licensePickerButton)

  const inputValue = await page.$eval(browseMap.licensePicker.inputField, el => el.value)
  await expect(page).toClick(browseMap.licensePicker.inputField, 'MIT')
  for (let i = 0; i < inputValue.length; i++) {
    await page.keyboard.press('Backspace')
  }
  await page.type(browseMap.licensePicker.inputField, 'MIT')
  await expect(page).toClick(browseMap.licensePicker.listSelection)
  await expect(page).toClick(browseMap.licensePicker.buttonSuccess)
  await expect(page).toMatchElement(browseMap.component.details.licenseFieldUpdated)
}
