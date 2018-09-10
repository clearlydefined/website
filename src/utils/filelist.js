// Copyright (c) Microsoft Corporation and others. Licensed under the MIT license.
// SPDX-License-Identifier: MIT
import Contribution from './contribution'

// Abstract methods for FileList
export default class FileListSpec {
  static getFileFacets(facets, component, preview, key) {
    if (!preview || !preview.files || !preview.files[key] || !preview.files[key].facets) {
      if (!facets)
        return [
          {
            value: 'core',
            isDifferent: false
          }
        ]
      return facets.map(f => {
        return {
          value: f,
          isDifferent: false
        }
      })
    }
    const previewObject = Object.assign([], preview.files[key].facets)
    if (component.files[key].facets && previewObject.length >= component.files[key].facets.length) {
      component.files[key].facets.map(
        (attribution, index) => !previewObject[index] && (previewObject[index] = attribution)
      )
    }
    return previewObject.map((_, index) =>
      Contribution.getValueAndIfDifferent(component, preview, `files[${key}].facets[${index}]`)
    )
  }

  static getFileAttributions(attributions, component, preview, key) {
    if (!preview || !preview.files || !preview.files[key] || !preview.files[key].attributions) {
      if (!attributions) return
      return Object.assign([], attributions).map(f => {
        return {
          value: f,
          isDifferent: false
        }
      })
    }
    const previewObject = Object.assign([], preview.files[key].attributions)
    if (component.files[key].attributions && previewObject.length >= component.files[key].attributions.length) {
      component.files[key].attributions.map(
        (attribution, index) => !previewObject[index] && (previewObject[index] = attribution)
      )
    }
    return previewObject.map((_, index) =>
      Contribution.getValueAndIfDifferent(component, preview, `files[${key}].attributions[${index}]`)
    )
  }
}
