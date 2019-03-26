// Copyright (c) Microsoft Corporation and others. Licensed under the MIT license.
// SPDX-License-Identifier: MIT
import { definitionsMap } from '../maps/definitions'
import { setDefaultOptions } from 'expect-puppeteer'

const puppeteer = require('puppeteer')
const defaultTimeout = process.env.JEST_TIMEOUT ? process.env.JEST_TIMEOUT : 30000

setDefaultOptions({ timeout: defaultTimeout })
let browser
let page

describe(
  'Revert changes on Definitions page',
  () => {
    beforeAll(async () => {
      jest.setTimeout(defaultTimeout)
      browser = await puppeteer.launch({ headless: process.env.NODE_ENV !== 'debug', slowMo: 80 })
      page = await browser.newPage()
      await page.setViewport({ width: 1920, height: 1080 })
      await page.goto(`${__HOST__}/workspace`, { waitUntil: 'domcontentloaded' })
    })

    afterAll(() => {
      browser.close()
    })

    test('user can type a definition text and should display a component in the list', async () => {
      await page.waitForSelector(definitionsMap.componentSearch.input)
      await expect(page).toMatchElement(definitionsMap.componentSearch.input)
      await expect(page).toClick(definitionsMap.componentSearch.input)
      await page.type(definitionsMap.componentSearch.input, 'async/2.6.1')
      await page.waitFor(4000)
      await expect(page).toMatchElement(definitionsMap.componentSearch.list, { timeout: 30000 })
      let element = await page.$(definitionsMap.componentSearch.listElement)
      element.click()
      await expect(page).toMatchElement(definitionsMap.componentList.list)
      await expect(page).toMatchElement(`${definitionsMap.componentList.list} ${definitionsMap.componentList.tag}`)
      await expect(page).toMatchElement(
        `${definitionsMap.componentList.list} ${definitionsMap.componentList.firstElement}`
      )
      const componentTitle = await page.$(definitionsMap.component.name)
      const text = await (await componentTitle.getProperty('textContent')).jsonValue()
      await expect(text).toMatch('async')
      await page.waitForSelector(definitionsMap.component.image)
      await page.waitForSelector(definitionsMap.component.firstElement)
      await expect(page).toClick(definitionsMap.component.firstElement)
    })

    test('user can revert license field value', async () => {
      await licenseEdit()
      await page.waitForSelector(definitionsMap.component.details.revertLicenseButton)
      const revertLicenseButton = await page.$(definitionsMap.component.details.revertLicenseButton)
      const revertClassName = await (await revertLicenseButton.getProperty('className')).jsonValue()
      await expect(revertClassName.includes('fa-disabled')).toBe(false)
      await expect(page).toClick(definitionsMap.component.details.revertLicenseButton)
      await page.waitForSelector(definitionsMap.component.details.licenseField)
      const licenseField = await page.$(definitionsMap.component.details.licenseField)
      const licenseFieldValue = await (await licenseField.getProperty('textContent')).jsonValue()
      await expect(licenseFieldValue).toEqual('MIT')
    })

    test('user can revert entire definition changes', async () => {
      await licenseEdit()
      await page.waitForSelector(definitionsMap.component.revertButton)
      await expect(page).toClick(definitionsMap.component.revertButton)
      await page.waitForSelector(definitionsMap.notification.revertButton)
      await expect(page).toClick(definitionsMap.notification.revertButton)
      await page.waitForSelector(definitionsMap.component.firstElement)
      await expect(page).toClick(definitionsMap.component.firstElement)
      const licenseField = await page.$(definitionsMap.component.details.licenseField)
      const licenseFieldValue = await (await licenseField.getProperty('textContent')).jsonValue()
      await expect(licenseFieldValue).toEqual('MIT')
    })

    test('user can revert all changes', async () => {
      await licenseEdit()
      await page.waitForSelector(definitionsMap.revertButton)
      await expect(page).toClick(definitionsMap.revertButton)
      await page.waitForSelector(definitionsMap.notification.revertButton)
      await expect(page).toClick(definitionsMap.notification.revertButton)
      await page.waitForSelector(definitionsMap.component.firstElement)
      await expect(page).toClick(definitionsMap.component.firstElement)
      const licenseField = await page.$(definitionsMap.component.details.licenseField)
      const licenseFieldValue = await (await licenseField.getProperty('textContent')).jsonValue()
      await expect(licenseFieldValue).toEqual('MIT')
    })
  },
  defaultTimeout
)

const licenseEdit = async () => {
  await page.waitForSelector(definitionsMap.component.details.licensePickerButton)
  await expect(page).toClick(definitionsMap.component.details.licensePickerButton)

  const inputValue = await page.$eval(definitionsMap.licensePicker.inputField, el => el.value)
  await expect(page).toClick(definitionsMap.licensePicker.inputField, 'MIT')
  for (let i = 0; i < inputValue.length; i++) {
    await page.keyboard.press('Backspace')
  }
  await page.type(definitionsMap.licensePicker.inputField, 'MIT')
  await expect(page).toClick(definitionsMap.licensePicker.listSelection)
  await expect(page).toClick(definitionsMap.licensePicker.buttonSuccess)
  await expect(page).toMatchElement(definitionsMap.component.details.licenseFieldUpdated)
}
