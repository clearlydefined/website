import protobuf from 'protobufjs'
import pako from 'pako'
import shareUrlDescriptor from './shareUrlDescriptor.json'

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
    return this.ShareUrlMessage.fromObject(this.payload)
  }

  encode(message) {
    let buffer = this.ShareUrlMessage.encode(message).finish()
    return pako.deflate(buffer)
  }

  decode(message) {
    try {
      const definitionSpec = pako.inflate(message)
      const decodedMessage = this.ShareUrlMessage.decode(definitionSpec)
      const object = this.ShareUrlMessage.toObject(decodedMessage, {
        enums: String
      })
      return object
    } catch (e) {
      return false
    }
  }
}
