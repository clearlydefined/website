// Copyright (c) Microsoft Corporation and others. Licensed under the MIT license.
// SPDX-License-Identifier: MIT

describe('Home page', () => {
  beforeAll(async () => {
    await page.goto(`${__HOST__}/about`)
  })

  it('should display "ClearlyDefined" text on page', async () => {
    await expect(page).toMatch('ClearlyDefined')
  })

  describe('Home page sections', () => {
    it('should have a "ClearlyDescribed" section', async () => {
      await expect(page).toMatch('ClearlyDescribed')
    })
    it('should have a "ClearlyLicensed" section', async () => {
      await expect(page).toMatch('ClearlyLicensed')
    })
    it('should have a "ClearlySecure" section', async () => {
      await expect(page).toMatch('ClearlySecure')
    })
  })
})
