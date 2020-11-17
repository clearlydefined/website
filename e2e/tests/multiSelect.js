// Copyright (c) Microsoft Corporation and others. Licensed under the MIT license.
// SPDX-License-Identifier: MIT

import { setDefaultOptions } from 'expect-puppeteer'
import { definitionsMap } from '../maps/definitions'
import 'core-js/stable'
import 'regenerator-runtime/runtime'

const {
  componentSearch,
  revertButton,
  notification,
  component,
  filterBar,
  licensePicker,
  multiSelectNotification
} = definitionsMap
const { details } = component

const puppeteer = require('puppeteer')
const defaultTimeout = process.env.JEST_TIMEOUT ? parseInt(process.env.JEST_TIMEOUT) : 30000

setDefaultOptions({ timeout: process.env.JEST_TIMEOUT })
let browser
let page

describe('Multiselect changes on Definitions page', () => {
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

  test('user can update and revert all the licenses', async () => {
    await searchDefinition('async/2.6.1')
    await editAllLicenses()
    await revertChanges()
    const licenseField = await page.$eval(details.licenseField, el => el.innerText)
    await expect(licenseField).toBe('MIT')
  })
})

const selectTheAllCheckbox = async () => {
  const { selectAllCheckbox } = filterBar
  await page.waitForSelector(selectAllCheckbox)
  await expect(page).toClick(selectAllCheckbox)

  const firstSelect = await page.$eval(definitionsMap.selectCheckbox, el => el.checked)
  expect(firstSelect).toBe(true)
}

const editAllLicenses = async () => {
  const { firstElement } = component
  await selectTheAllCheckbox()
  await page.waitForSelector(firstElement)
  await page.waitFor(4000)
  await expect(page).toClick(firstElement)
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
  await page.waitForSelector(multiSelectNotification.identifier)
  await expect(page).toClick(multiSelectNotification.changeAllButton)
  await expect(page).toMatchElement(details.licenseFieldUpdated)
  const licenseField = await page.$eval(details.licenseFieldUpdated, el => el.innerText)
  expect(licenseField).toBe('MIT-0')
}

const searchDefinition = async definition => {
  const { input, listElement } = componentSearch
  await page.waitForSelector(input)
  await expect(page).toMatchElement(input)
  await expect(page).toClick(input)
  await page.type(input, definition)
  await expect(page).toMatchElement(listElement)
  const element = await page.$(listElement)
  element.click()
}

const revertChanges = async () => {
  await page.waitForSelector(revertButton)
  const revertBtnClassName = await page.$eval(revertButton, el => el.className)
  expect(revertBtnClassName.includes('fa-disabled')).toBe(false)
  await expect(page).toClick(revertButton)
  await page.waitForSelector(notification.revertButton)
  await expect(page).toClick(notification.revertButton)
}
