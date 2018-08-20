import Contribution from './contribution'
import merge from 'lodash/merge'
// Copyright (c) Microsoft Corporation and others. Licensed under the MIT license.
// SPDX-License-Identifier: MIT

// Abstract methods for FileList
export default class FileListSpec {
  static getFileFacets(facets, component, preview, key) {
    if (preview && preview.files && preview.files[key] && preview.files[key].facets) {
      merge(preview.files[key].facets, component.files[key].facets)
      return preview.files[key].facets.map((_, index) =>
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
    if (preview && preview.files && preview.files[key] && preview.files[key].attributions) {
      merge(preview.files[key].attributions, component.files[key].attributions)
      return preview.files[key].attributions.map((_, index) =>
        Contribution.getValueAndIfDifferent(component, preview, `files[${key}].attributions[${index}]`)
      )
    } else {
      if (attributions) {
        return attributions.map(f => {
          return {
            value: f,
            isDifferent: false
          }
        })
      }
    }
  }
}
