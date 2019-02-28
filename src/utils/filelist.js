// Copyright (c) Microsoft Corporation and others. Licensed under the MIT license.
// SPDX-License-Identifier: MIT
import orderBy from 'lodash/orderBy'
import Contribution from './contribution'

// Abstract methods for FileList
let key = 0
export default class FileListSpec {
  static pathToTreeFolders(files, component, preview) {
    const newFiles = files.map((file, index) => {
      return { ...file, id: index, folders: file.path.split('/') }
    })
    const orderedFiles = orderBy(newFiles, [file => file.path.split('/').length, 'path'], ['desc', 'asc'])
    const treeFolders = orderedFiles.reduce((result, file) => {
      result = this.getFolders(file, result, component, preview, key)
      return result
    }, [])
    key = 0
    return treeFolders
  }

  static getFolders(file, result, component, preview) {
    if (file.folders.length === 1) {
      key++
      result.push({
        ...file,
        key,
        name: file.folders[file.folders.length - 1],
        license: file.license || '',
        facets: this.getFileFacets(file.facets, component, preview, file.id),
        attributions: this.getFileAttributions(file.attributions, component, preview, file.id)
      })
    } else {
      const folderName = file.folders[0]
      file.folders.splice(0, 1)

      const index = result.findIndex(folder => folder.name === folderName)
      if (index !== -1) {
        result[index].children = this.getFolders({ ...file }, result[index].children, component, preview)
      } else {
        key++
        result.push({
          ...file,
          key,
          name: folderName,
          children: this.getFolders({ ...file }, [], component, preview)
        })
      }
    }
    return result
  }

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
