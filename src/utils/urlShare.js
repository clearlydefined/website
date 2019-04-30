import protobuf from 'protobufjs'
import shareUrlDescriptor from './shareUrlDescriptor.json'

export default class UrlShare {
  constructor(payload) {
    this.payload = payload
    protobuf.configure()
  }

  start() {
    const root = protobuf.Root.fromJSON(shareUrlDescriptor)
    this.ShareUrlMessage = root.lookupType('ShareUrl')
    console.log(this.ShareUrlMessage)
  }

  isValid() {
    return this.ShareUrlMessage.verify(this.payload)
  }
}
