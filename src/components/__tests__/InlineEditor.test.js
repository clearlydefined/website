import React from 'react'
import { shallow } from 'enzyme'
import InlineEditor from '../InlineEditor'

describe('InlineEditor', () => {
  it('renders without crashing', () => {
    shallow(<InlineEditor onChange={() => {}} placeholder={'test'} type={'text'} field={'licensed.declared'} />)
  })
})
