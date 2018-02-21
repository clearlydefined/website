// Copyright (c) Microsoft Corporation. All rights reserved.
// SPDX-License-Identifier: MIT

export const UI_NAVIGATION = 'UI_NAVIGATION'
export const UI_REDIRECT = 'UI_REDIRECT'
export const UI_INSPECT_UPDATE_FILTER = 'UI_INSPECT_UPDATE_FILTER'
export const UI_CURATE_UPDATE_FILTER = 'UI_CURATE_UPDATE_FILTER'
export const UI_BROWSE_UPDATE_FILTER = 'UI_BROWSE_UPDATE_FILTER'
export const UI_BROWSE_UPDATE_LIST = 'UI_BROWSE_UPDATE_LIST'
export const UI_HARVEST_UPDATE_FILTER = 'UI_HARVEST_UPDATE_FILTER'
export const UI_HARVEST_UPDATE_QUEUE = 'UI_HARVEST_UPDATE_QUEUE'

export function uiNavigation(navItem) {
  return { type: UI_NAVIGATION, to: navItem }
}

export function uiRedirect(to) {
  return { type: UI_REDIRECT, to }
}

export function uiInspectUpdateFilter(value) {
  return { type: UI_INSPECT_UPDATE_FILTER, value }
}

export function uiCurateUpdateFilter(value) {
  return { type: UI_CURATE_UPDATE_FILTER, value }
}

export function uiBrowseUpdateFilter(value) {
  return { type: UI_BROWSE_UPDATE_FILTER, value }
}

export function uiBrowseUpdateList(value) {
  return { type: UI_BROWSE_UPDATE_LIST, result: value }
}

export function uiHarvestUpdateFilter(value) {
  return { type: UI_HARVEST_UPDATE_FILTER, value }
}

export function uiHarvestUpdateQueue(value) {
  return { type: UI_HARVEST_UPDATE_QUEUE, result: value }
}
