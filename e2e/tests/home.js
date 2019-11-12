// Copyright (c) Microsoft Corporation and others. Licensed under the MIT license.
// SPDX-License-Identifier: MIT
import { setDefaultOptions } from 'expect-puppeteer'
import 'core-js/stable'
import 'regenerator-runtime/runtime'

const puppeteer = require('puppeteer')
const defaultTimeout = process.env.JEST_TIMEOUT ? process.env.JEST_TIMEOUT : 30000

setDefaultOptions({ timeout: defaultTimeout })
let browser
let page

describe(
  'About page',
  () => {
    beforeAll(async () => {
      jest.setTimeout(defaultTimeout)
      browser = await puppeteer.launch({ headless: process.env.NODE_ENV !== 'debug', slowMo: 80 })
      page = await browser.newPage()
      await page.setViewport({ width: 1920, height: 1080 })
      await page.goto(`${__HOST__}/about`, { waitUntil: 'domcontentloaded' })
    })

    afterAll(() => {
      browser.close()
    })

    it('should display "ClearlyDefined" text on page', async () => {
      await expect(page).toMatch('ClearlyDefined')
    })

    describe(
      'Home page sections',
      () => {
        it('should have a "ClearlyDescribed" section', async () => {
          await expect(page).toMatch('ClearlyDescribed')
        })
        it('should have a "ClearlyLicensed" section', async () => {
          await expect(page).toMatch('ClearlyLicensed')
        })
        it('should have a "ClearlySecure" section', async () => {
          await expect(page).toMatch('ClearlySecure')
        })
      },
      defaultTimeout
    )
  },
  defaultTimeout
)
