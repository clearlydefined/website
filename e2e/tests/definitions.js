// @ts-nocheck
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
  'Definitions page',
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

    it('should display "Workspace" text on page', async () => {
      await page.waitForSelector('.section-title')
      await expect(page).toMatch('Workspace')
    })

    test('user can type a definition text and should display a component in the list', async () => {
      await page.waitForSelector(definitionsMap.componentSearch.input)
      await expect(page).toMatchElement(definitionsMap.componentSearch.input)
      await expect(page).toClick(definitionsMap.componentSearch.input)
      await page.type(definitionsMap.componentSearch.input, 'async/2.6.1')
      await expect(page).toMatchElement(definitionsMap.componentSearch.list)
      await expect(page).toMatchElement(definitionsMap.componentSearch.listElement, { text: 'npm/npmjs/-/async/2.6.1' })
      const element = await page.$(definitionsMap.componentSearch.listElement)
      element.click()
      await expect(page).toMatchElement(definitionsMap.componentList.list)
      await expect(page).toMatchElement(
        `${definitionsMap.componentList.list} ${definitionsMap.componentList.firstElement}`
      )
      await expect(page).toMatchElement(definitionsMap.component.name)
      const componentTitle = await page.$eval(definitionsMap.component.name, el => el.textContent)
      await expect(componentTitle).toMatch('async')
      await page.waitForSelector(definitionsMap.component.image)
      await expect(page).toMatchElement(definitionsMap.component.image)
      await expect(page).toMatchElement(definitionsMap.component.buttons)
      await expect(page).toMatchElement(definitionsMap.component.sourceButton)
      await expect(page).toMatchElement(definitionsMap.component.inspectButton)
      await expect(page).toMatchElement(definitionsMap.component.copyButton)
      await expect(page).toMatchElement(definitionsMap.component.switchButton)
      await expect(page).toMatchElement(definitionsMap.component.revertButton)
      await expect(page).toMatchElement(definitionsMap.component.removeButton)
    })

    test('should display the detail after clicking on a component in the list', async () => {
      await page.waitForSelector(definitionsMap.component.firstElement)
      await expect(page).toClick(definitionsMap.component.firstElement)
      await expect(page).toMatchElement(definitionsMap.component.panel)
      const declaredContent = await page.$eval(definitionsMap.component.details.declared, el => el.textContent)
      await expect(declaredContent).toMatch('Declared')
      const sourceContent = await page.$eval(definitionsMap.component.details.source, el => el.textContent)
      await expect(sourceContent).toMatch('Source')
      const releaseContent = await page.$eval(definitionsMap.component.details.releaseDate, el => el.textContent)
      await expect(releaseContent).toMatch('Release')
      const discoveredContent = await page.$eval(definitionsMap.component.details.discovered, el => el.textContent)
      await expect(discoveredContent).toMatch('Discovered')
      const attributionContent = await page.$eval(definitionsMap.component.details.attribution, el => el.textContent)
      await expect(attributionContent).toMatch('Attribution')
      const filesContent = await page.$eval(definitionsMap.component.details.files, el => el.textContent)
      await expect(filesContent).toMatch('Files')
    })

    test('should edit a license of a component in the list', async () => {
      await page.waitForSelector(definitionsMap.component.details.licensePickerButton)
      await expect(page).toMatchElement(definitionsMap.component.details.licensePickerButton)
      await expect(page).toClick(definitionsMap.component.details.licensePickerButton)
      await expect(page).toMatchElement(definitionsMap.licensePicker.identifier)

      const inputValue = await page.$eval(definitionsMap.licensePicker.inputField, el => el.value)
      await expect(page).toClick(definitionsMap.licensePicker.inputField, 'MIT')
      for (let i = 0; i < inputValue.length; i++) {
        await page.keyboard.press('Backspace')
      }
      await page.type(definitionsMap.licensePicker.inputField, 'MIT')
      await expect(page).toClick(definitionsMap.licensePicker.listSelection)
      await expect(page).toClick(definitionsMap.licensePicker.buttonSuccess)
      await expect(page).toMatchElement(definitionsMap.component.details.licenseFieldUpdated)
    })

    test('should open a modal while attempt to change a source location of a component in the list', async () => {
      await page.waitForSelector(definitionsMap.component.details.sourceField)
      await expect(page).toMatchElement(definitionsMap.component.details.sourceField)
      await expect(page).toClick(definitionsMap.component.details.sourceField)
      await expect(page).toMatchElement(definitionsMap.sourcePicker.identifier)
      const sourcePickerModal = await page.$(definitionsMap.sourcePicker.identifier)
      await expect(sourcePickerModal).not.toBeNull()
      await expect(page).toMatchElement(definitionsMap.sourcePicker.buttonSuccess)
      await expect(page).toClick(definitionsMap.sourcePicker.buttonSuccess)
      await expect(page).toMatchElement(definitionsMap.sourcePicker.identifier, { hidden: true })
      const hiddenSourcePickerModal = await page.$(definitionsMap.sourcePicker.identifier)
      await expect(hiddenSourcePickerModal).toBeNull()
    })

    test('should show an input field while attempting to change the release date of a component in the list', async () => {
      await page.waitForSelector(definitionsMap.component.details.releaseDateField)
      await expect(page).toMatchElement(definitionsMap.component.details.releaseDateField)
      await expect(page).toClick(definitionsMap.component.details.releaseDateField)
      await expect(page).toMatchElement(definitionsMap.component.details.releaseDateInput)
    })

    test('should display a modal after clicking on the inspect button of a definition the list', async () => {
      await page.waitForSelector(definitionsMap.component.inspectButton)
      await expect(page).toMatchElement(definitionsMap.component.inspectButton)
      await expect(page).toClick(definitionsMap.component.inspectButton)
      await page.waitForSelector(definitionsMap.fullDetailView.identifier)
      await expect(page).toMatchElement(definitionsMap.fullDetailView.identifier)
      await expect(page).toMatchElement(definitionsMap.fullDetailView.buttonSuccess)
      await expect(page).toClick(definitionsMap.fullDetailView.buttonSuccess)
    })

    test('should open the contribution modal', async () => {
      await page.waitForSelector(definitionsMap.contributeButton)
      await expect(page).toMatchElement(definitionsMap.contributeButton)
      await expect(page).toClick(definitionsMap.contributeButton)
      await page.waitForSelector(definitionsMap.contributeModal.identifier)
      await expect(page).toFill(definitionsMap.contributeModal.summaryField, 'AUTOMATION TEST')
      await expect(page).toFill(definitionsMap.contributeModal.detailsField, 'AUTOMATION TEST')
      await expect(page).toFill(definitionsMap.contributeModal.resolutionField, 'AUTOMATION TEST')
      await page.waitForSelector(definitionsMap.contributeModal.typeField)
      await page.select(definitionsMap.contributeModal.typeField, 'missing')
      await page.waitForSelector(definitionsMap.contributeButton)
      await expect(page).toMatchElement(definitionsMap.contributeModal.contributeButton)
      await expect(page).toClick(definitionsMap.contributeModal.contributeButton)
      await page.waitForSelector(definitionsMap.contributeSuccess)
      await expect(page).toMatchElement(definitionsMap.contributeSuccess, { timeout: 30000 })
    })
  },
  defaultTimeout
)
