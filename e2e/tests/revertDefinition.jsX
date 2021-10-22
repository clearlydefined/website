// Copyright (c) Microsoft Corporation and others. Licensed under the MIT license.
// SPDX-License-Identifier: MIT
import { definitionsMap } from '../maps/definitions'
import { setDefaultOptions } from 'expect-puppeteer'
import 'core-js/stable'
import 'regenerator-runtime/runtime'

const puppeteer = require('puppeteer')
const defaultTimeout = process.env.JEST_TIMEOUT ? process.env.JEST_TIMEOUT : 30000

setDefaultOptions({ timeout: defaultTimeout })
let browser
let page

const { component, componentSearch, componentList, licensePicker, notification } = definitionsMap

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
      const { input, listElement } = componentSearch
      await page.waitForSelector(input)
      await expect(page).toMatchElement(input)
      await expect(page).toClick(input)
      await page.type(input, 'async/2.6.1')
      await expect(page).toMatchElement(componentSearch.list)
      await expect(page).toMatchElement(componentSearch.listElement, { text: 'npm/npmjs/-/async/2.6.1' })
      const element = await page.$(componentSearch.listElement)
      element.click()
      await expect(page).toMatchElement(componentList.list)
      await expect(page).toMatchElement(`${componentList.list} ${componentList.tag}`)
      await expect(page).toMatchElement(`${componentList.list} ${componentList.firstElement}`)
      const componentTitle = await page.$eval(component.name, el => el.textContent)
      await expect(componentTitle).toMatch('async')
      await page.waitForSelector(component.image)
      await page.waitForSelector(component.firstElement)
      await expect(page).toClick(component.firstElement)
    })

    test('user can revert license field value', async () => {
      const { details } = component
      const { revertLicenseButton } = details
      await licenseEdit()
      await page.waitForSelector(revertLicenseButton)
      const revertClassName = await page.$eval(revertLicenseButton, el => el.className)
      await expect(revertClassName.includes('fa-disabled')).toBe(false)
      await expect(page).toClick(revertLicenseButton)
      await page.waitForSelector(details.licenseField)
      const licenseField = await page.$eval(details.licenseField, el => el.textContent)
      await expect(licenseField).toEqual('MIT')
    })

    test('user can revert entire definition changes', async () => {
      await licenseEdit()
      await page.waitForSelector(component.revertButton)
      await expect(page).toClick(component.revertButton)
      await page.waitForSelector(notification.revertButton)
      await expect(page).toClick(notification.revertButton)
      await page.waitForSelector(component.firstElement)
      await expect(page).toClick(component.firstElement)
      const licenseField = await page.$eval(component.details.licenseField, el => el.textContent)
      await expect(licenseField).toEqual('MIT')
    })

    test('user can revert all changes', async () => {
      await licenseEdit()
      await page.waitForSelector(definitionsMap.revertButton)
      await expect(page).toClick(definitionsMap.revertButton)
      await page.waitForSelector(notification.revertButton)
      await expect(page).toClick(notification.revertButton)
      await page.waitForSelector(component.firstElement)
      await expect(page).toClick(component.firstElement)
      const licenseField = await page.$eval(component.details.licenseField, el => el.textContent)
      await expect(licenseField).toEqual('MIT')
    })
  },
  defaultTimeout
)

const licenseEdit = async () => {
  await page.waitForSelector(component.details.licensePickerButton)
  await expect(page).toClick(component.details.licensePickerButton)

  const inputValue = await page.$eval(licensePicker.inputField, el => el.value)
  await expect(page).toClick(licensePicker.inputField, 'MIT')
  for (let i = 0; i < inputValue.length; i++) {
    await page.keyboard.press('Backspace')
  }
  await page.type(licensePicker.inputField, 'MIT')
  await expect(page).toClick(licensePicker.listSelection)
  await expect(page).toClick(licensePicker.buttonSuccess)
  await expect(page).toMatchElement(component.details.licenseFieldUpdated)
}
