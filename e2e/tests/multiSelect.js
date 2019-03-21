// Copyright (c) Microsoft Corporation and others. Licensed under the MIT license.
// SPDX-License-Identifier: MIT

import { setDefaultOptions } from 'expect-puppeteer'
import { definitionsMap } from '../maps/definitions'

const { componentSearch, revertButton, notification, component, filterBar, sourcePicker } = definitionsMap
const { details, firstElement } = component

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

  afterEach(() => page.reload())

  test('user can update and revert all the licenses', async () => {
    await searchDefinition('async/2.6.1')
    await editAllLicenses()

    await revertChanges()
    const licenseField = await page.$eval(details.licenseField, el => el.innerText)
    await expect(licenseField).toBe('MIT')
  })

  test('should open a modal while attempt to change a source location of all definitions', async () => {
    await searchDefinition('async/2.6.1')
    await editAllSources()
  })

  test('should show an input field while attempting to change the release date of all selected components', async () => {
    const { releaseDateButton } = filterBar
    await searchDefinition('async/2.6.1')
    await selectTheAllCheckbox()
    await page.waitForSelector(releaseDateButton)
    await expect(page).toClick(releaseDateButton)

    await page.waitForSelector(filterBar.releaseDateInput)
    await expect(page).toMatchElement(filterBar.releaseDateInput)
  })
})

const editAllSources = async () => {
  const { sourceButton } = filterBar
  await selectTheAllCheckbox()

  await page.waitForSelector(sourceButton)
  await expect(page).toClick(sourceButton)

  await expect(page).toMatchElement(sourcePicker.identifier)
  await expect(page).toClick(sourcePicker.buttonSuccess)
  await expect(page).not.toMatchElement(sourcePicker.identifier)
}

const selectTheAllCheckbox = async () => {
  const { selectAllCheckbox } = filterBar
  await page.waitForSelector(selectAllCheckbox)
  await expect(page).toClick(selectAllCheckbox)

  const firstSelect = await page.$eval(definitionsMap.selectCheckbox, el => el.checked)
  expect(firstSelect).toBe(true)
}

const editAllLicenses = async () => {
  const { licenseDropdown } = filterBar
  await selectTheAllCheckbox()
  await page.type(licenseDropdown, 'MIT-0')
  await expect(page).toClick(definitionsMap.licensePicker.listSelectionFirst)
  await expect(page).toClick(firstElement)
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
