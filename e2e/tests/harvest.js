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
        if (interceptedRequest.url().includes('/origins/npm') && interceptedRequest.method() === 'GET')
          interceptedRequest.respond(responses.origins.npm)
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

    it('when NPM provider is active, show the NPM picker', async () => {
      const { npmButton, npmPicker } = harvestMap
      await page.waitForSelector(npmButton)
      const element = await page.$(npmButton)
      element.click()
      await expect(page).toMatchElement(npmPicker)
    })

    it('when typing on NPM picker, show a list of results', async () => {
      const { npmPicker, npmSelectorFirstElement } = harvestMap
      await expect(page).toClick(npmPicker)
      await page.type(npmPicker, 'chai')
      await expect(page).toMatchElement(npmSelectorFirstElement)
      await expect(page).toMatchElement(npmSelectorFirstElement, { text: 'chai' })
    })

    it('when selecting NPM library, show it in the list of components', async () => {
      const { npmSelectorFirstElement } = harvestMap
      await expect(page).toClick(npmSelectorFirstElement)
    })

    it('when GitHub provider is active, show the User picker and the Repo pick', async () => {
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
  }
}
