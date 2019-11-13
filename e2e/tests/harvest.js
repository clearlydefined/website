// @ts-nocheck
// Copyright (c) Microsoft Corporation and others. Licensed under the MIT license.
// SPDX-License-Identifier: MIT
import { harvestMap } from '../maps/harvest'
import { setDefaultOptions } from 'expect-puppeteer'
import 'core-js/stable'
import 'regenerator-runtime/runtime'

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
      await page.setRequestInterception(true)
      page.on('request', interceptedRequest => {
        if (
          interceptedRequest.url().includes(`/origins/npm/${harvestMap.npmComponent}/revisions`) &&
          interceptedRequest.method() === 'GET'
        )
          return interceptedRequest.respond(responses.revisions.npm)
        if (
          interceptedRequest
            .url()
            .includes(`/origins/github/${harvestMap.githubComponent}/${harvestMap.githubRepo}/revisions`) &&
          interceptedRequest.method() === 'GET'
        )
          return interceptedRequest.respond(responses.revisions.github)
        if (interceptedRequest.url().includes('/origins/npm') && interceptedRequest.method() === 'GET')
          return interceptedRequest.respond(responses.origins.npm)
        if (
          interceptedRequest.url().includes(`/origins/github/${harvestMap.githubComponent}/`) &&
          interceptedRequest.method() === 'GET'
        )
          return interceptedRequest.respond(responses.origins.github.repo)
        if (interceptedRequest.url().includes('/origins/github') && interceptedRequest.method() === 'GET')
          return interceptedRequest.respond(responses.origins.github.user)
        else interceptedRequest.continue()
      })

      await page.goto(`${__HOST__}/harvest`, { waitUntil: 'domcontentloaded' })
    })

    afterAll(() => {
      browser.close()
    })

    it('should display "Components to harvest" text on page', async () => {
      await page.waitForSelector('.section-title')
      await expect(page).toMatch('Components to harvest')
    })

    it('should display all providers buttons', async () => {
      const {
        npmButton,
        githubButton,
        mavencentralButton,
        nugetButton,
        pypiButton,
        rubygemsButton,
        debianButton,
        cratesioButton
      } = harvestMap
      await page.waitForSelector(npmButton)
      await page.waitForSelector(githubButton)
      await page.waitForSelector(mavencentralButton)
      await page.waitForSelector(nugetButton)
      await page.waitForSelector(pypiButton)
      await page.waitForSelector(rubygemsButton)
      await page.waitForSelector(debianButton)
      await page.waitForSelector(cratesioButton)
    })

    it('should the NPM picker when NPM provider is active', async () => {
      const { npmButton, npmPicker } = harvestMap
      await page.waitForSelector(npmButton)
      const element = await page.$(npmButton)
      element.click()
      await expect(page).toMatchElement(npmPicker)
    })

    it('should show a list of results when typing on NPM picker', async () => {
      const { npmPicker, npmSelector, listFirstElement, npmComponent } = harvestMap
      await expect(page).toClick(npmPicker)
      await page.type(npmPicker, npmComponent)
      await expect(page).toMatchElement(`${npmSelector} ${listFirstElement}`)
      await expect(page).toMatchElement(`${npmSelector} ${listFirstElement}`, { text: npmComponent })
    })

    it('should show it in the list of components when selecting NPM library', async () => {
      const { npmSelector, listFirstElement, componentList, component, npmComponent } = harvestMap
      await expect(page).toClick(`${npmSelector} ${listFirstElement}`)
      await expect(page).toMatchElement(componentList.list)
      await expect(page).toMatchElement(`${componentList.list} ${componentList.firstElement}`)
      await expect(page).toMatchElement(`${componentList.list} ${componentList.firstElement} ${component.name}`)
      const componentTitle = await page.$eval(
        `${componentList.list} ${componentList.firstElement} ${component.name}`,
        el => el.textContent
      )
      await expect(componentTitle).toMatch(npmComponent)
    })

    it('should show a list of revisions when clicking on the NPM version picker', async () => {
      const { npmVersionPicker, npmVersionSelector, listFirstElement } = harvestMap
      await expect(page).toClick(npmVersionPicker)
      await expect(page).toMatchElement(`${npmVersionSelector} ${listFirstElement}`)
      await expect(page).toMatchElement(`${npmVersionSelector} ${listFirstElement}`, { text: '4.2.0' })
    })

    it('should show the value of the selected NPM version', async () => {
      const { npmVersionPicker, npmVersionSelector, listFirstElement } = harvestMap
      await expect(page).toClick(`${npmVersionSelector} ${listFirstElement}`)
      const componentTitle = await page.$eval(npmVersionPicker, el => el.value)
      await expect(componentTitle).toMatch('4.2.0')
    })

    it('should show the User picker and the Repo picker when GitHub provider is active', async () => {
      await page.waitForSelector(harvestMap.githubButton)
      const element = await page.$(harvestMap.githubButton)
      element.click()
      await expect(page).toMatchElement(harvestMap.githubUserPicker)
      await expect(page).toMatchElement(harvestMap.githubRepoPicker)
    })

    it('should show a list of results when typing on GitHub user picker', async () => {
      const { githubUserPicker, githubUserSelector, listFirstElement, githubComponent } = harvestMap
      await expect(page).toClick(githubUserPicker)
      await page.type(githubUserPicker, githubComponent)
      await expect(page).toMatchElement(`${githubUserSelector} ${listFirstElement}`)
      await expect(page).toMatchElement(`${githubUserSelector} ${listFirstElement}`, { text: githubComponent })
      await expect(page).toClick(`${githubUserSelector} ${listFirstElement}`)
      const componentTitle = await page.$eval(githubUserPicker, el => el.value)
      await expect(componentTitle).toMatch(githubComponent)
    })

    it('should show a list of results when typing on GitHub repo picker', async () => {
      const { githubRepoPicker, githubRepoSelector, listFirstElement, githubRepo } = harvestMap
      await expect(page).toClick(githubRepoPicker)
      await page.type(githubRepoPicker, githubRepo)
      await expect(page).toMatchElement(`${githubRepoSelector} ${listFirstElement}`)
      await expect(page).toMatchElement(`${githubRepoSelector} ${listFirstElement}`, { text: githubRepo })
      await expect(page).toClick(`${githubRepoSelector} ${listFirstElement}`)
      const componentTitle = await page.$eval(githubRepoPicker, el => el.value)
      await expect(componentTitle).toMatch(githubRepo)
    })

    it('should show it in the list of components when selecting GitHub repo', async () => {
      const { githubComponent, githubRepo, componentList, component } = harvestMap
      await expect(page).toMatchElement(componentList.list)
      await expect(page).toMatchElement(`${componentList.list} ${componentList.secondElement}`)
      await expect(page).toMatchElement(`${componentList.list} ${componentList.secondElement} ${component.name}`)
      const componentTitle = await page.$eval(
        `${componentList.list} ${componentList.secondElement} ${component.name}`,
        el => el.textContent
      )
      await expect(componentTitle).toMatch(`${githubComponent}/${githubRepo}`)
    })

    it('should show a list of revisions when clicking on the GitHub commit picker', async () => {
      const { githubCommitPicker, githubCommitSelector, listFirstElement } = harvestMap
      await expect(page).toClick(githubCommitPicker)
      await expect(page).toMatchElement(`${githubCommitSelector} ${listFirstElement}`)
      await expect(page).toMatchElement(`${githubCommitSelector} ${listFirstElement}`, {
        text: '1.1.0 (724409eb4087dc731ba9d8f158de74a86d9d4244)'
      })
    })

    it('should show the value of the selected GitHub commit', async () => {
      const { githubCommitPicker, githubCommitSelector, listFirstElement } = harvestMap
      await expect(page).toClick(`${githubCommitSelector} ${listFirstElement}`)
      const componentTitle = await page.$eval(githubCommitPicker, el => el.value)
      await expect(componentTitle).toMatch('1.1.0')
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
        { id: 'pathval' }
      ])
    },
    github: {
      user: {
        status: 200,
        headers: { 'access-control-allow-origin': '*' },
        body: JSON.stringify([{ id: 'clearlydefined' }, { id: 'clearlydefined-test' }])
      },
      repo: {
        status: 200,
        headers: { 'access-control-allow-origin': '*' },
        body: JSON.stringify([{ id: 'clearlydefined/website' }])
      }
    }
  },
  revisions: {
    npm: {
      status: 200,
      headers: { 'access-control-allow-origin': '*' },
      body: JSON.stringify(['4.2.0', '4.1.2', '4.1.1'])
    },
    github: {
      status: 200,
      headers: { 'access-control-allow-origin': '*' },
      body: JSON.stringify([
        { tag: '1.1.0', sha: '724409eb4087dc731ba9d8f158de74a86d9d4244' },
        { tag: '1.0.4', sha: '775b645db6ffc46e7b0f686d5377c0bc2f18fa48' }
      ])
    }
  }
}
