// Copyright (c) Microsoft Corporation and others. Licensed under the MIT license.
// SPDX-License-Identifier: MIT

describe('Definitions page', () => {
  beforeAll(async () => {
    await page.setViewport({ width: 1920, height: 1080 })
    await page.goto(`${__HOST__}/definitions`, { timeout: 40000, waitUntil: 'domcontentloaded' })
  })

  it('should display "Available definitions" text on page', async () => {
    await expect(page).toMatch('Available definitions')
  })

  test('user can type a definition text and should display a component in the list', async () => {
    await page.waitForSelector('.rbt-input-main')
    await page.click('.rbt-input-main')
    await page.type('.rbt-input-main', 'async')
    await page.waitFor(2000)
    await page.waitForSelector('.rbt-menu>li')
    let element = await page.$('.rbt-menu li:nth-child(1) a')
    element.click()
    await page.waitForSelector('.ReactVirtualized__Grid__innerScrollContainer')
    await page.waitFor(2000)
    await page.waitForSelector('.ReactVirtualized__Grid__innerScrollContainer div:nth-child(0n+1) .two-line-entry')
    const componentTitle = await page.$(
      '#root > div > main > div > div:nth-child(2) > div:nth-child(2) > div > div > div:nth-child(2) > div > div > div > div > div > div.list-body > div.list-headline > span > span:nth-child(1) > a'
    )
    const text = await (await componentTitle.getProperty('textContent')).jsonValue()
    await expect(text).toMatch('async')
    const activityArea =
      '#root > div > main > div > div:nth-child(2) > div:nth-child(2) > div > div > div:nth-child(2) > div > div > div > div > div > div.list-activity-area'
    await page.waitForSelector(`${activityArea} > img`)
    await page.waitForSelector(`${activityArea} > .btn-group`)

    const codeButtonElement = await page.$(`${activityArea} > .btn-group > div:nth-child(1) > button > i`)
    const codeButtonContent = await (await codeButtonElement.getProperty('className')).jsonValue()
    await expect(codeButtonContent).toMatch('fas fa-code')

    const inspectButtonElement = await page.$(`${activityArea} > .btn-group > div:nth-child(2) > button > i`)
    const inspectButtonContent = await (await inspectButtonElement.getProperty('className')).jsonValue()
    await expect(inspectButtonContent).toMatch('fas fa-search')

    const copyButtonElement = await page.$(`${activityArea} > .btn-group > div:nth-child(3) > button > i`)
    const copyButtonContent = await (await copyButtonElement.getProperty('className')).jsonValue()
    await expect(copyButtonContent).toMatch('fas fa-copy')

    const switchButtonElement = await page.$(`${activityArea} > .btn-group > div:nth-child(4) > div > button > i`)
    const switchButtonContent = await (await switchButtonElement.getProperty('className')).jsonValue()
    await expect(switchButtonContent).toMatch('fas fa-exchange-alt')

    const undoButtonElement = await page.$(`${activityArea} > .btn-group > div:nth-child(5) > button > i`)
    const undoButtonContent = await (await undoButtonElement.getProperty('className')).jsonValue()
    await expect(undoButtonContent).toMatch('fas fa-undo')

    const removeButtonElement = await page.$(`${activityArea} > button > i`)
    const removeButtonContent = await (await removeButtonElement.getProperty('className')).jsonValue()
    await expect(removeButtonContent).toMatch('fas fa-times list-remove')
  })

  test('should display the detail after clicking on a component in the list', async () => {
    const firstElement =
      '#root > div > main > div > div:nth-child(2) > div:nth-child(2) > div > div > div:nth-child(2) > div > div > div:nth-child(1)'
    await page.click(firstElement)
    await page.waitForSelector(`${firstElement} > div > div.list-panel`)
    const component =
      '#root > div > main > div > div:nth-child(2) > div:nth-child(2) > div > div > div:nth-child(2) > div > div > div:nth-child(1) > div > div.list-panel > div'
    const declaredElement = await page.$(`${component} > div.col-md-5 > div:nth-child(1) > div.col-md-2 > b`)
    const declaredContent = await (await declaredElement.getProperty('textContent')).jsonValue()
    await expect(declaredContent).toMatch('Declared')
    const sourceElement = await page.$(`${component} > div.col-md-5 > div:nth-child(2) > div.col-md-2 > b`)
    const sourceContent = await (await sourceElement.getProperty('textContent')).jsonValue()
    await expect(sourceContent).toMatch('Source')
    const releaseElement = await page.$(`${component} > div.col-md-5 > div:nth-child(3) > div.col-md-2 > b`)
    const releaseContent = await (await releaseElement.getProperty('textContent')).jsonValue()
    await expect(releaseContent).toMatch('Release')
    const discoveredElement = await page.$(`${component} > div.col-md-7 > div:nth-child(1) > div.col-md-2 > b`)
    const discoveredContent = await (await discoveredElement.getProperty('textContent')).jsonValue()
    await expect(discoveredContent).toMatch('Discovered')
    const attributionElement = await page.$(`${component} > div.col-md-7 > div:nth-child(2) > div.col-md-2 > b`)
    const attributionContent = await (await attributionElement.getProperty('textContent')).jsonValue()
    await expect(attributionContent).toMatch('Attribution')
    const filesElement = await page.$(`${component} > div.col-md-7 > div:nth-child(3) > div.col-md-2 > b`)
    const filesContent = await (await filesElement.getProperty('textContent')).jsonValue()
    await expect(filesContent).toMatch('Files')
  })

  test('should edit a license of a component in the list', async () => {
    const component =
      '#root > div > main > div > div:nth-child(2) > div:nth-child(2) > div > div > div:nth-child(2) > div > div > div > div'
    const licenseField = `${component} > div.list-panel > div > div.col-md-5 > div:nth-child(1) > div.definition__line.col-md-10 > span.list-singleLine`

    await page.waitForSelector(`${licenseField} > span.editable-field`)
    await page.click(`${licenseField} > span.editable-field`)
    await page.waitForSelector(`${licenseField} > div.editable-editor`)
    const inputValue = await page.$eval(
      `${licenseField} > div > div > div.rbt-input.form-control > div > div > input`,
      el => el.value
    )
    for (let i = 0; i < inputValue.length; i++) {
      await page.keyboard.press('Backspace')
    }
    await page.type(`${licenseField} > div > div > div.rbt-input.form-control > div > div > input`, 'MIT')
    await page.click('#rbt-menu-item-1')

    await page.waitForSelector(`${licenseField} > span.editable-field.bg-info`)
    await page.waitForSelector(`${component} > div.list-row > img.list-image.list-highlight`)
  })

  test('should open a modal while attempt to change a source location of a component in the list', async () => {
    const component =
      '#root > div > main > div > div:nth-child(2) > div:nth-child(2) > div > div > div:nth-child(2) > div > div > div > div'
    const sourceField = `${component} > div.list-panel > div > div.col-md-5 > div:nth-child(2) > div.definition__line.col-md-10 > span.list-singleLine > span`

    await page.waitForSelector(`${sourceField} > span.editable-field`)
    await page.click(`${sourceField} > span.editable-field`)
    await page.waitForSelector(`body > div:nth-child(8) > div.fade.in.modal > div.modal-dialog`)
    await page.click(`body > div:nth-child(8) > div.fade.in.modal > div > div > div > div:nth-child(2) > button`)
  })

  test('should show an input field while attempting to change the release date of a component in the list', async () => {
    const component =
      '#root > div > main > div > div:nth-child(2) > div:nth-child(2) > div > div > div:nth-child(2) > div > div > div > div'

    const dateField = `${component} > div.list-panel > div > div.col-md-5 > div:nth-child(3) > div.definition__line.col-md-10 > span.list-singleLine`

    await page.waitForSelector(`${dateField} > span`)
    await page.click(`${dateField} > span`)
    await page.waitForSelector(`${dateField} > input`)
  })

  test('should display a modal after clicking on the inspect button of a definition the list', async () => {
    const inspectButton =
      '#root > div > main > div > div:nth-child(2) > div:nth-child(2) > div > div > div:nth-child(2) > div > div > div > div > div > div.list-activity-area > div > div:nth-child(2) > button'
    await page.waitForSelector(inspectButton)
    await page.click(inspectButton)
    await page.waitFor(4000)
    page.waitForSelector('body > div:nth-child(8) > div > div.ant-modal-wrap.ant-modal-centered > div')
  })
})
