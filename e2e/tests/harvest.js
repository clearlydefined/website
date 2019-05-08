// @ts-nocheck
// Copyright (c) Microsoft Corporation and others. Licensed under the MIT license.
// SPDX-License-Identifier: MIT
import { harvestMap } from '../maps/harvest'
import { setDefaultOptions } from 'expect-puppeteer'

const puppeteer = require('puppeteer')
const defaultTimeout = process.env.JEST_TIMEOUT ? process.env.JEST_TIMEOUT : 30000

setDefaultOptions({ timeout: defaultTimeout })
let browser
let page

describe(
  'Harvest page',
  () => {
    beforeAll(async () => {
      jest.setTimeout(defaultTimeout)
      browser = await puppeteer.launch({ headless: process.env.NODE_ENV !== 'debug', slowMo: 80 })
      page = await browser.newPage()
      await page.setViewport({ width: 1920, height: 1080 })
      await page.goto(`${__HOST__}/harvest`, { waitUntil: 'domcontentloaded' })
      await page.setRequestInterception(true)
      page.on('request', interceptedRequest => {
        if (
          interceptedRequest.url().includes(`/origins/npm/${harvestMap.npmComponent}/revisions`) &&
          interceptedRequest.method() === 'GET'
        )
          return interceptedRequest.respond(responses.revisions.npm)
        if (interceptedRequest.url().includes('/origins/npm') && interceptedRequest.method() === 'GET')
          return interceptedRequest.respond(responses.origins.npm)
        else interceptedRequest.continue()
      })
    })

    afterAll(() => {
      browser.close()
    })

    it('should display "Components to harvest" text on page', async () => {
      await page.waitForSelector('.section-title')
      await expect(page).toMatch('Components to harvest')
    })

    it('should display all providers buttons', async () => {
      const { npmButton, githubButton, mavencentralButton, nugetButton, pypiButton, rubygemsButton } = harvestMap
      await page.waitForSelector(npmButton)
      await page.waitForSelector(githubButton)
      await page.waitForSelector(mavencentralButton)
      await page.waitForSelector(nugetButton)
      await page.waitForSelector(pypiButton)
      await page.waitForSelector(rubygemsButton)
    })

    it('should the NPM picker when NPM provider is active', async () => {
      const { npmButton, npmPicker } = harvestMap
      await page.waitForSelector(npmButton)
      const element = await page.$(npmButton)
      element.click()
      await expect(page).toMatchElement(npmPicker)
    })

    it('should show a list of results when typing on NPM picker', async () => {
      const { npmPicker, npmSelectorFirstElement, npmComponent } = harvestMap
      await expect(page).toClick(npmPicker)
      await page.type(npmPicker, npmComponent)
      await expect(page).toMatchElement(npmSelectorFirstElement)
      await expect(page).toMatchElement(npmSelectorFirstElement, { text: npmComponent })
    })

    it('should show it in the list of components when selecting NPM library', async () => {
      const { npmSelectorFirstElement, componentList, component, npmComponent } = harvestMap
      await expect(page).toClick(npmSelectorFirstElement)
      await expect(page).toMatchElement(componentList.list)
      await expect(page).toMatchElement(`${componentList.list} ${componentList.firstElement}`)
      await expect(page).toMatchElement(`${componentList.list} ${componentList.firstElement} ${component.name}`)
      const componentTitle = await page.$eval(
        `${componentList.list} ${componentList.firstElement} ${component.name}`,
        el => el.textContent
      )
      await expect(componentTitle).toMatch(npmComponent)
    })

    it('should show the User picker and the Repo picker when GitHub provider is active', async () => {
      await page.waitForSelector(harvestMap.githubButton)
      const element = await page.$(harvestMap.githubButton)
      element.click()
      await expect(page).toMatchElement(harvestMap.githubUserPicker)
      await expect(page).toMatchElement(harvestMap.githubRepoPicker)
    })
  },
  defaultTimeout
)

const responses = {
  origins: {
    npm: {
      status: 200,
      headers: { 'access-control-allow-origin': '*' },
      body: JSON.stringify([
        { id: 'chai' },
        { id: 'sinon-chai' },
        { id: 'deep-eql' },
        { id: 'webpack-chain' },
        { id: 'webdriverio' },
        { id: 'pathval' },
        { id: 'chai-subset' },
        { id: 'check-error' },
        { id: 'config-chain' },
        { id: 'get-func-name' },
        { id: 'karma-mocha-reporter' },
        { id: 'chai-string' },
        { id: 'p-try' },
        { id: 'dirty-chai' },
        { id: 'chai-immutable' },
        { id: 'stack-chain' },
        { id: 'chai-spies' },
        { id: 'eslint-plugin-chai-expect' },
        { id: 'chai-fs' },
        { id: 'chai-datetime' },
        { id: 'chai-exclude' },
        { id: 'chai-json-schema' },
        { id: 'chai-bignumber' },
        { id: 'chai-like' },
        { id: 'chai-dom' }
      ])
    }
  },
  revisions: {
    npm: {
      status: 200,
      headers: { 'access-control-allow-origin': '*' },
      body: JSON.stringify([
        '4.2.0',
        '4.1.2',
        '4.1.1',
        '4.1.0',
        '4.0.2',
        '4.0.1',
        '4.0.0-canary.2',
        '4.0.0-canary.1',
        '4.0.0',
        '3.5.0',
        '3.4.1',
        '3.4.0',
        '3.3.0',
        '3.2.0',
        '3.1.0',
        '3.0.0',
        '2.3.0',
        '2.2.0',
        '2.1.2',
        '2.1.1',
        '2.1.0',
        '2.0.0',
        '1.9.2',
        '1.9.1',
        '1.9.0',
        '1.8.1',
        '1.8.0',
        '1.7.2',
        '1.7.1',
        '1.7.0',
        '1.6.1',
        '1.6.0',
        '1.5.0',
        '1.4.2',
        '1.4.1',
        '1.4.0',
        '1.3.0',
        '1.2.0',
        '1.10.0',
        '1.1.1',
        '1.1.0',
        '1.0.4',
        '1.0.3',
        '1.0.2',
        '1.0.1',
        '1.0.0',
        '0.5.3',
        '0.5.2',
        '0.5.1',
        '0.5.0',
        '0.4.2',
        '0.4.1',
        '0.4.0',
        '0.3.4',
        '0.3.3',
        '0.3.2',
        '0.3.1',
        '0.3.0',
        '0.2.4',
        '0.2.3',
        '0.2.2',
        '0.2.1',
        '0.2.0',
        '0.1.7',
        '0.1.6',
        '0.1.5',
        '0.1.4',
        '0.1.3',
        '0.1.2',
        '0.1.1',
        '0.1.0',
        '0.0.2',
        '0.0.1'
      ])
    }
  }
}
