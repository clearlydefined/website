// @ts-nocheck
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
const { details } = component

describe(
  'Definitions page',
  () => {
    beforeAll(async () => {
      jest.setTimeout(defaultTimeout)
      browser = await puppeteer.launch({ headless: process.env.NODE_ENV !== 'debug', slowMo: 80 })
      page = await browser.newPage()
      await page.setViewport({ width: 1920, height: 1080 })
      await page.setRequestInterception(true)
      page.on('request', interceptedRequest => {
        if (interceptedRequest.url().includes('/curations') && interceptedRequest.method() === 'PATCH')
          interceptedRequest.respond(responses.curations)
        else interceptedRequest.continue()
      })
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
      const { input, listElement } = componentSearch
      await page.waitForSelector(input)
      await expect(page).toMatchElement(input)
      await expect(page).toClick(input)
      await page.type(input, 'async/2.6.1')
      await expect(page).toMatchElement(componentSearch.list)
      await expect(page).toMatchElement(listElement, { text: 'npm/npmjs/-/async/2.6.1' })
      const element = await page.$(listElement)
      element.click()
      await expect(page).toMatchElement(definitionsMap.componentList.list)
      await expect(page).toMatchElement(
        `${definitionsMap.componentList.list} ${definitionsMap.componentList.firstElement}`
      )
      await expect(page).toMatchElement(component.name)
      const componentTitle = await page.$eval(component.name, el => el.textContent)
      await expect(componentTitle).toMatch('async')
      await page.waitForSelector(component.image)
      await expect(page).toMatchElement(component.image)
      await expect(page).toMatchElement(component.buttons)
      await expect(page).toMatchElement(component.sourceButton)
      await expect(page).toMatchElement(component.inspectButton)
      await expect(page).toMatchElement(component.linkButton)
      await expect(page).toMatchElement(component.switchButton)
      await expect(page).toMatchElement(component.revertButton)
      await expect(page).toMatchElement(component.removeButton)
    })

    test('should display the detail after clicking on a component in the list', async () => {
      await page.waitForSelector(component.firstElement)
      await expect(page).toClick(component.firstElement)
      await expect(page).toMatchElement(component.panel)
      const declaredContent = await page.$eval(details.declared, el => el.textContent)
      await expect(declaredContent).toMatch('Declared')
      const sourceContent = await page.$eval(details.source, el => el.textContent)
      await expect(sourceContent).toMatch('Source')
      const releaseContent = await page.$eval(details.releaseDate, el => el.textContent)
      await expect(releaseContent).toMatch('Release')
      const discoveredContent = await page.$eval(details.discovered, el => el.textContent)
      await expect(discoveredContent).toMatch('Discovered')
      const attributionContent = await page.$eval(details.attribution, el => el.textContent)
      await expect(attributionContent).toMatch('Attribution')
      const filesContent = await page.$eval(details.files, el => el.textContent)
      await expect(filesContent).toMatch('Files')
    })

    test('should edit a license of a component in the list', async () => {
      const { licensePickerButton } = details
      await page.waitForSelector(licensePickerButton)
      await expect(page).toMatchElement(licensePickerButton)
      await expect(page).toClick(licensePickerButton)
      await expect(page).toMatchElement(licensePicker.identifier)

      const inputValue = await page.$eval(licensePicker.inputField, el => el.value)
      await expect(page).toClick(licensePicker.inputField, 'MIT')
      for (let i = 0; i < inputValue.length; i++) {
        await page.keyboard.press('Backspace')
      }
      await page.type(licensePicker.inputField, 'MIT')
      await expect(page).toClick(licensePicker.listSelection)
      await expect(page).toClick(licensePicker.buttonSuccess)
      await expect(page).toMatchElement(details.licenseFieldUpdated)
    })

    test('should open a modal while attempt to change a source location of a component in the list', async () => {
      const { sourcePicker } = definitionsMap
      const { identifier } = sourcePicker
      await page.waitForSelector(details.sourceField)
      await expect(page).toMatchElement(details.sourceField)
      await expect(page).toClick(details.sourceField)
      await expect(page).toMatchElement(identifier)
      const sourcePickerModal = await page.$(identifier)
      await expect(sourcePickerModal).not.toBeNull()
      await expect(page).toMatchElement(sourcePicker.buttonSuccess)
      await expect(page).toClick(sourcePicker.buttonSuccess)
      await expect(page).toMatchElement(identifier, { hidden: true })
      const hiddenSourcePickerModal = await page.$(identifier)
      await expect(hiddenSourcePickerModal).toBeNull()
    })

    test('should show an input field while attempting to change the release date of a component in the list', async () => {
      const { releaseDateField } = details
      await page.waitForSelector(releaseDateField)
      await expect(page).toMatchElement(releaseDateField)
      await expect(page).toClick(releaseDateField)
      await expect(page).toMatchElement(details.releaseDateInput)
    })

    test('should display a modal after clicking on the inspect button of a definition the list', async () => {
      const { fullDetailView } = definitionsMap
      const { inspectButton } = component
      await page.waitForSelector(inspectButton)
      await expect(page).toMatchElement(inspectButton)
      await expect(page).toClick(inspectButton)
      await page.waitForSelector(fullDetailView.identifier)
      await expect(page).toMatchElement(fullDetailView.identifier)
      await expect(page).toMatchElement(fullDetailView.buttonSuccess)
      await expect(page).toClick(fullDetailView.buttonSuccess)
    })

    test('should open the contribution modal', async () => {
      const { contributeModal } = definitionsMap
      await page.waitForSelector(definitionsMap.contributeButton)
      await expect(page).toMatchElement(definitionsMap.contributeButton)
      await expect(page).toClick(definitionsMap.contributeButton)
      await page.waitForSelector(contributeModal.identifier)
      await expect(page).toFill(contributeModal.summaryField, 'AUTOMATION TEST')
      await expect(page).toFill(contributeModal.detailsField, 'AUTOMATION TEST')
      await expect(page).toFill(contributeModal.resolutionField, 'AUTOMATION TEST')
      await page.waitForSelector(contributeModal.typeField)
      await page.select(contributeModal.typeField, 'missing')
      await page.waitForSelector(definitionsMap.contributeButton)
      await expect(page).toMatchElement(contributeModal.contributeButton)
      await expect(page).toClick(contributeModal.contributeButton)
      await page.waitForSelector(definitionsMap.contributeSuccess)
      await expect(page).toMatchElement(definitionsMap.contributeSuccess, { timeout: 30000 })
    })
  },
  defaultTimeout
)

const responses = {
  curations: {
    status: 200,
    headers: { 'access-control-allow-origin': '*' },
    body: JSON.stringify({
      prNumber: 750,
      url: 'https://github.com/clearlydefined/curated-data-dev/pull/750'
    })
  }
}
