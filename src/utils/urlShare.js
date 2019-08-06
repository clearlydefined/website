import protobuf from 'protobufjs'
import pako from 'pako'
import map from 'lodash/map'
import base64js from 'base64-js'
import shareUrlDescriptor from './shareUrlDescriptor.json'
import EntitySpec from './entitySpec.js'

export default class UrlShare {
  constructor(payload) {
    this.payload = payload
    protobuf.configure()
  }

  start() {
    const root = protobuf.Root.fromJSON(shareUrlDescriptor)
    this.ShareUrlMessage = root.lookupType('ShareUrl')
  }

  isValid() {
    const result = this.ShareUrlMessage.verify(this.payload)
    return result !== null ? result : true
  }

  toMessage() {
    return this.ShareUrlMessage.fromObject(this.coordinatesToPath(this.payload))
  }

  coordinatesToPath(payload) {
    const coordinates = payload.coordinates.reduce((previous, current) => {
      const obj = {}
      if (current.changes) obj.changes = current.changes
      previous[EntitySpec.fromObject(current).toPath()] = obj
      return previous
    }, {})
    return { ...payload, coordinates: coordinates }
  }

  encode(message) {
    let buffer = this.ShareUrlMessage.encode(message).finish()
    return base64js.fromByteArray(pako.deflate(buffer))
  }

  decode(message) {
    try {
      const definitionSpec = pako.inflate(base64js.toByteArray(message))
      const decodedMessage = this.ShareUrlMessage.decode(definitionSpec)
      const object = this.ShareUrlMessage.toObject(decodedMessage)
      return this.pathToCoordinates(object)
    } catch (e) {
      return false
    }
  }

  pathToCoordinates(object) {
    const coordinates = map(object.coordinates, (component, path) => {
      const obj = { ...EntitySpec.fromPath(path) }
      if (Object.keys(component).length > 0) {
        obj.changes = component.changes
      }
      return obj
    })
    return { ...object, coordinates: coordinates }
  }
}
