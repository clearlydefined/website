// Copyright (c) Microsoft Corporation and others. Licensed under the MIT license.
// SPDX-License-Identifier: MIT
import { fulldetailsMap } from '../maps/fulldetailsview'
import { setDefaultOptions } from 'expect-puppeteer'

const puppeteer = require('puppeteer')
const defaultTimeout = process.env.JEST_TIMEOUT ? process.env.JEST_TIMEOUT : 30000

setDefaultOptions({ timeout: defaultTimeout })
let browser
let page

const { fileList } = fulldetailsMap
const { columns, firstRow, lastRow, folderIcon } = fileList
const { identifier } = columns.name

describe(
  'Full details page',
  () => {
    beforeAll(async () => {
      jest.setTimeout(defaultTimeout)
      browser = await puppeteer.launch({ headless: process.env.NODE_ENV !== 'debug', slowMo: 80 })
      page = await browser.newPage()
      await page.setViewport({ width: 1920, height: 1080 })
      await page.goto(
        `${__HOST__}/definitions/git/github/automattic/mongoose/1ead0e616ab028a994ab47a23643749659243e07`,
        { waitUntil: 'domcontentloaded' }
      )
    })

    afterAll(() => {
      browser.close()
    })

    test('should display the FileList component on the page', async () => {
      await page.waitForSelector(fileList.identifier)
      await expect(page).toMatchElement(fileList.identifier)
    })

    test('FileList should have Name, Facets, Licenses, Copyrights columns', async () => {
      await page.waitForSelector(identifier)
      await expect(page).toMatchElement(identifier)
      await page.waitForSelector(columns.facets.identifier)
      await expect(page).toMatchElement(columns.facets.identifier)
      await page.waitForSelector(columns.license.identifier)
      await expect(page).toMatchElement(columns.license.identifier)
      await page.waitForSelector(columns.copyrights.identifier)
      await expect(page).toMatchElement(columns.copyrights.identifier)
    })

    test('first row of FileList should be a folder', async () => {
      await page.waitForSelector(firstRow)
      await expect(page).toMatchElement(firstRow)

      await page.waitForSelector(`${firstRow} > ${identifier}`)
      await expect(page).toMatchElement(`${firstRow} > ${identifier}`)
      await page.waitForSelector(`${firstRow} > ${identifier} > ${folderIcon}`, {
        visible: true
      })
      await expect(page).toMatchElement(`${firstRow} > ${identifier} > ${folderIcon}`)

      const nameContent = await page.$eval(`${firstRow} > ${identifier}`, el => el.textContent)
      await expect(nameContent).toMatch(fileList.firstRowContent)
    })

    test('last row of FileList should be a file', async () => {
      await page.waitForSelector(lastRow)
      await expect(page).toMatchElement(lastRow)
      await page.waitForSelector(`${lastRow} > ${identifier}`)
      await expect(page).toMatchElement(`${lastRow} > ${identifier}`)

      await page.waitForSelector(`${lastRow} > ${identifier} > ${folderIcon}`, {
        hidden: true
      })
      await expect(page).toMatchElement(`${lastRow} > ${identifier} > ${folderIcon}`)

      const nameContent = await page.$eval(`${lastRow} > ${identifier}`, el => el.textContent)
      await expect(nameContent).toMatch(fileList.lastRowContent)
    })
  },
  defaultTimeout
)
