// Copyright (c) Microsoft Corporation and others. Licensed under the MIT license.
// SPDX-License-Identifier: MIT
import { browseMap } from '../maps/browse'
import { setDefaultOptions } from 'expect-puppeteer'
import 'core-js/stable'
import 'regenerator-runtime/runtime'

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
      page.setRequestInterception(true)
      page.on('request', interceptedRequest => {
        if (interceptedRequest.url().includes('/definitions') && interceptedRequest.method() === 'GET')
          interceptedRequest.respond(responses.definitions)
        else interceptedRequest.continue()
      })
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

const responses = {
  definitions: {
    status: 200,
    headers: { 'access-control-allow-origin': '*' },
    body: JSON.stringify({
      data: [
        {
          described: {
            releaseDate: '2019-04-13',
            sourceLocation: {
              type: 'git',
              provider: 'github',
              namespace: 'angular',
              name: 'angular',
              revision: '3e992e18ebf51d6036818f26c3d77b52d3ec48eb',
              url: 'https://github.com/angular/angular/tree/3e992e18ebf51d6036818f26c3d77b52d3ec48eb'
            },
            urls: {
              registry: 'https://npmjs.com/package/@angular/language-service',
              version: 'https://npmjs.com/package/@angular/language-service/v/7.2.13',
              download: 'https://registry.npmjs.com/@angular/language-service/-/language-service-7.2.13.tgz'
            },
            projectWebsite: 'https://github.com/angular/angular#readme',
            issueTracker: 'https://github.com/angular/angular/issues',
            hashes: {
              sha1: '941cb098657efdbc386ef8e54d2d893497f68c20',
              sha256: '593bf8a62f6c0ea6899bb3618854141ffe0465f65eea37f0b549c0bddbd4c1df'
            },
            files: 37,
            tools: ['clearlydefined/1.3.4', 'licensee/9.12.1', 'scancode/3.2.2', 'fossology/3.6.0'],
            toolScore: { total: 100, date: 30, source: 70 },
            score: { total: 100, date: 30, source: 70 }
          },
          licensed: {
            declared: 'MIT OR Apache-2.0',
            toolScore: { total: 69, declared: 30, discovered: 24, consistency: 0, spdx: 15, texts: 0 },
            facets: {
              core: {
                attribution: {
                  unknown: 1,
                  parties: [
                    'Copyright Google Inc.',
                    'Copyright (c) Microsoft Corporation.',
                    '(c) 2010-2019 Google LLC. https://angular.io'
                  ]
                },
                discovered: { unknown: 0, expressions: ['MIT', 'NOASSERTION'] },
                files: 37
              }
            },
            score: { total: 69, declared: 30, discovered: 24, consistency: 0, spdx: 15, texts: 0 }
          },
          coordinates: {
            type: 'npm',
            provider: 'npmjs',
            namespace: '@angular',
            name: 'language-service',
            revision: '7.2.13'
          },
          _meta: { schemaVersion: '1.6.1', updated: '2019-04-16T11:01:10.024Z' },
          scores: { effective: 84, tool: 84 }
        },
        {
          described: {
            releaseDate: '2019-04-12',
            urls: {
              registry: 'https://npmjs.com/package/@microsoft.azure/openapi',
              version: 'https://npmjs.com/package/@microsoft.azure/openapi/v/2.1.63',
              download: 'https://registry.npmjs.com/@microsoft.azure/openapi/-/openapi-2.1.63.tgz'
            },
            projectWebsite: 'https://github.com/Azure/perks#readme',
            issueTracker: 'https://github.com/Azure/perks/issues',
            hashes: {
              sha1: '7c9be65748ff2638c04ed3b196fd0982d4ddb0e3',
              sha256: 'e0037ae92a84948400de151ff31ae641202db68daa281e8235611f29ead18fcd'
            },
            files: 15,
            tools: ['clearlydefined/1.3.4', 'licensee/9.12.1', 'scancode/3.2.2', 'fossology/3.6.0'],
            toolScore: { total: 30, date: 30, source: 0 },
            score: { total: 30, date: 30, source: 0 }
          },
          licensed: {
            declared: 'MIT',
            toolScore: { total: 50, declared: 30, discovered: 5, consistency: 0, spdx: 15, texts: 0 },
            facets: {
              core: {
                attribution: { unknown: 12, parties: ['Copyright (c) Microsoft Corporation.'] },
                discovered: { unknown: 10, expressions: ['MIT', 'NOASSERTION'] },
                files: 15
              }
            },
            score: { total: 50, declared: 30, discovered: 5, consistency: 0, spdx: 15, texts: 0 }
          },
          coordinates: {
            type: 'npm',
            provider: 'npmjs',
            namespace: '@microsoft.azure',
            name: 'openapi',
            revision: '2.1.63'
          },
          _meta: { schemaVersion: '1.6.1', updated: '2019-04-16T11:01:42.813Z' },
          scores: { effective: 40, tool: 40 }
        },
        {
          licensed: {
            declared: 'MIT',
            toolScore: { total: 64, declared: 30, discovered: 4, consistency: 0, spdx: 15, texts: 15 },
            facets: {
              core: {
                attribution: { unknown: 6, parties: ['Copyright (c) 2015 Unshift.io, Arnout Kazemier'] },
                discovered: { unknown: 4, expressions: ['MIT', 'NOASSERTION'] },
                files: 7
              }
            },
            score: { total: 64, declared: 30, discovered: 4, consistency: 0, spdx: 15, texts: 15 }
          },
          described: {
            releaseDate: '2019-04-12',
            sourceLocation: {
              type: 'git',
              provider: 'github',
              namespace: 'unshiftio',
              name: 'url-parse',
              revision: '50a6877824185bd294bde858d4372179d51aec8c',
              url: 'https://github.com/unshiftio/url-parse/tree/50a6877824185bd294bde858d4372179d51aec8c'
            },
            urls: {
              registry: 'https://npmjs.com/package/url-parse',
              version: 'https://npmjs.com/package/url-parse/v/1.4.6',
              download: 'https://registry.npmjs.com/url-parse/-/url-parse-1.4.6.tgz'
            },
            projectWebsite: 'https://github.com/unshiftio/url-parse#readme',
            issueTracker: 'https://github.com/unshiftio/url-parse/issues',
            hashes: {
              sha1: 'baf91d6e6783c8a795eb476892ffef2737fc0456',
              sha256: '6f12cb928f970a3da517a7fcfc98885c18a1f28fd19fb611c1afca51c89747e3'
            },
            files: 7,
            tools: ['clearlydefined/1.3.4', 'licensee/9.12.1', 'scancode/3.2.2', 'fossology/3.6.0'],
            toolScore: { total: 100, date: 30, source: 70 },
            score: { total: 100, date: 30, source: 70 }
          },
          coordinates: { type: 'npm', provider: 'npmjs', name: 'url-parse', revision: '1.4.6' },
          _meta: { schemaVersion: '1.6.1', updated: '2019-04-16T11:01:17.686Z' },
          scores: { effective: 82, tool: 82 }
        }
      ],
      continuationToken: 'bnBtL25wbWpzL0ByZWFjdC1uYXRpdmUtY29tbXVuaXR5L2NsaS8xLjYuMA=='
    })
  }
}
