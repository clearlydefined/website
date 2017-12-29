// Copyright (c) Microsoft Corporation. All rights reserved.
// SPDX-License-Identifier: MIT

export const UI_NAVIGATION = 'UI_NAVIGATION'
export const UI_REDIRECT = 'UI_REDIRECT'

export function uiNavigation(navItem) {
  return { type: UI_NAVIGATION, to: navItem }
}

export function uiRedirect(to) {
  return { type: UI_REDIRECT, to }
}

