import Contribution from './contribution'
// Copyright (c) Microsoft Corporation and others. Licensed under the MIT license.
// SPDX-License-Identifier: MIT

// Abstract methods for FileList
export default class FileListSpec {
  static getFileFacets(facets, component, preview, key) {
    if (preview && preview.files && preview.files[key] && preview.files[key].facets) {
      const previewObject = Object.assign([], preview.files[key].facets)
      if (previewObject.length >= component.files[key].facets.length) {
        component.files[key].facets.map(
          (attribution, index) => !previewObject[index] && (previewObject[index] = attribution)
        )
      }
      return previewObject.map((_, index) =>
        Contribution.getValueAndIfDifferent(component, preview, `files[${key}].facets[${index}]`)
      )
    } else {
      if (!facets) {
        return [
          {
            value: 'core',
            isDifferent: false
          }
        ]
      } else {
        return facets.map(f => {
          return {
            value: f,
            isDifferent: false
          }
        })
      }
    }
  }

  static getFileAttributions(attributions, component, preview, key) {
    if (preview && preview.files && preview.files[key]) {
      const previewObject = Object.assign([], preview.files[key].attributions)
      if (previewObject.length >= component.files[key].attributions.length) {
        component.files[key].attributions.map(
          (attribution, index) => !previewObject[index] && (previewObject[index] = attribution)
        )
      }
      return previewObject.map((_, index) =>
        Contribution.getValueAndIfDifferent(component, preview, `files[${key}].attributions[${index}]`)
      )
    } else {
      if (attributions) {
        return Object.assign([], attributions).map(f => {
          return {
            value: f,
            isDifferent: false
          }
        })
      }
    }
  }
}
