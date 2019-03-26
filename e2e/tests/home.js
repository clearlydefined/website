// Copyright (c) Microsoft Corporation and others. Licensed under the MIT license.
// SPDX-License-Identifier: MIT

describe('Home page', () => {
  beforeAll(() => {
    return page.goto(`${__HOST__}/about`)
  })

  it('should display "ClearlyDefined" text on page', () => {
    return expect(page).toMatch('ClearlyDefined')
  })

  describe('Home page sections', () => {
    it('should have a "ClearlyDescribed" section', () => {
      return expect(page).toMatch('ClearlyDescribed')
    })
    it('should have a "ClearlyLicensed" section', () => {
      return expect(page).toMatch('ClearlyLicensed')
    })
    it('should have a "ClearlySecure" section', () => {
      return expect(page).toMatch('ClearlySecure')
    })
  })
})
