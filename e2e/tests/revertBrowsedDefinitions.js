// Copyright (c) Microsoft Corporation and others. Licensed under the MIT license.
// SPDX-License-Identifier: MIT
import { browseMap } from '../maps/browse'
import { setDefaultOptions } from 'expect-puppeteer'

const puppeteer = require('puppeteer')
const defaultTimeout = process.env.JEST_TIMEOUT ? process.env.JEST_TIMEOUT : 30000

setDefaultOptions({ timeout: defaultTimeout })
let browser
let page

const { component, licensePicker, notification } = browseMap
const { details, firstElement } = component

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
      await page.waitForSelector(component.image)
      await page.waitForSelector(firstElement)
      await expect(page).toClick(firstElement)
    })

    test('user can revert license field value', async () => {
      const { revertLicenseButton } = details
      await licenseEdit()
      await page.waitForSelector(details.revertLicenseButton)
      const revertClassName = await page.$eval(details.revertLicenseButton, el => el.className)
      await expect(revertClassName.includes('fa-disabled')).toBe(false)
      await expect(page).toClick(details.revertLicenseButton)
      await page.waitForSelector(details.licenseField)
      const licenseField = await page.$eval(details.licenseField, el => el.textContent)
      await expect(licenseField).toEqual('MIT OR Apache-2.0')
    })

    test('user can revert entire definition changes', async () => {
      await licenseEdit()
      await page.waitForSelector(component.revertButton)
      await expect(page).toClick(component.revertButton)
      await page.waitForSelector(notification.revertButton)
      await expect(page).toClick(notification.revertButton)
      await page.waitForSelector(firstElement)
      await expect(page).toClick(firstElement)
      const licenseField = await page.$eval(details.licenseField, el => el.textContent)
      await expect(licenseField).toEqual('MIT OR Apache-2.0')
    })

    test('user can revert all changes', async () => {
      await licenseEdit()
      await page.waitForSelector(browseMap.revertButton)
      await expect(page).toClick(browseMap.revertButton)
      await page.waitForSelector(notification.revertButton)
      await expect(page).toClick(notification.revertButton)
      await page.waitForSelector(firstElement)
      await expect(page).toClick(firstElement)
      const licenseField = await page.$eval(details.licenseField, el => el.textContent)
      await expect(licenseField).toEqual('MIT OR Apache-2.0')
    })
  },
  defaultTimeout
)

const licenseEdit = async () => {
  await page.waitForSelector(details.licensePickerButton)
  await expect(page).toClick(details.licensePickerButton)

  const inputValue = await page.$eval(licensePicker.inputField, el => el.value)
  await expect(page).toClick(licensePicker.inputField, 'MIT')
  for (let i = 0; i < inputValue.length; i++) {
    await page.keyboard.press('Backspace')
  }
  await page.type(licensePicker.inputField, 'MIT')
  await expect(page).toClick(licensePicker.listSelection)
  await expect(page).toClick(licensePicker.buttonSuccess)
  await expect(page).toMatchElement(details.licenseFieldUpdated)
}
