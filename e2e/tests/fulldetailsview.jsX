// Copyright (c) Microsoft Corporation and others. Licensed under the MIT license.
// SPDX-License-Identifier: MIT

import { fulldetailsMap } from '../maps/fulldetailsview'
import { setDefaultOptions } from 'expect-puppeteer'
import 'core-js/stable'
import 'regenerator-runtime/runtime'

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

    test('adding and removing a glob to a facet applies correctly (from the FacetsEditor)', async () => {
      const { described, fileList } = fulldetailsMap
      const { files } = fileList

      // revert all the facet and file changes
      await expect(page).toMatchElement(fulldetailsMap.fileList.revertBtn)

      await page.waitForSelector(files['README.md'].row)
      await expect(page).toMatchElement(files['README.md'].facets)
      const facets = await page.$$eval(files['README.md'].facets, els => els.map(e => e.textContent))
      expect(facets).toEqual([''])
      await expect(page).toClick(described.facets.dataFacetTagForInput)
      await expect(page).toFill(described.facets.dataFacetInput, '**/*.md')
      await page.keyboard.press('Enter')
      // wait for the facet to be updated (first element)
      await expect(page).toMatchElement(files['README.md'].facets, { text: 'data' })
      const updatedFacets = await page.$$eval(files['README.md'].facets, els => els.map(e => e.textContent))
      expect(updatedFacets).toEqual(['data'])
    })

    test('adding and removing a glob to a facet applies correctly (from the Filelist)', async () => {
      const { docs } = fulldetailsMap.fileList.files
      const populateHTML = docs.children['populate.html']

      // revert all the facet and file changes
      await expect(page).toMatchElement(fulldetailsMap.fileList.revertBtn)

      await page.waitForSelector(docs.row)
      await expect(page).toMatchElement(docs.facets)
      const facets = (await page.$$eval(docs.facets, els => els.map(e => e.textContent))).filter(e => e)
      expect(facets).toEqual([])
      await expect(page).toMatchElement(docs.plusIcon)
      await expect(page).toClick(docs.plusIcon)
      await expect(page).toFill(docs.input, 'doc')
      await page.keyboard.press('Enter')

      // wait for the facet to be updated (first element)
      await expect(page).toMatchElement(docs.facets, { text: 'doc' })
      const updatedFacets = (await page.$$eval(docs.facets, els => els.map(e => e.textContent))).filter(e => e)
      expect(updatedFacets).toEqual(['doc'])

      // test the files inside the 'test' folder
      await expect(page).toClick(docs.expandIcon)
      const facetsForPopulateHTML = (await page.$$eval(populateHTML.facets, els => els.map(e => e.textContent))).filter(
        e => e
      )
      expect(facetsForPopulateHTML).toEqual(['doc'])
      // remove 'doc' facet
      await expect(page).toClick(docs.removeIcon)
      const facetsForPopulateHTMLReverted = (await page.$$eval(populateHTML.facets, els =>
        els.map(e => e.textContent)
      )).filter(e => e)
      expect(facetsForPopulateHTMLReverted).toEqual([])
    })
  },
  defaultTimeout
)
