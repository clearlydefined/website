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

  toValidObject() {
    return this.ShareUrlMessage.toObject(this.payload)
  }

  encode(message) {
    let buffer = this.ShareUrlMessage.encode(message).finish()
    console.log(pako.deflateRaw(buffer).toString())
    return pako.deflate(buffer).toString()
  }

  decode(message) {
    try {
      const definitionSpec = pako.inflate(message)
      var decodedMessage = this.ShareUrlMessage.decode(definitionSpec)
      return decodedMessage
    } catch (e) {
      console.log(e)
      return false
    }
  }
}
