// Copyright (c) Microsoft Corporation and others. Licensed under the MIT license.
// SPDX-License-Identifier: MIT

import React, { Component } from 'react'
import { Typeahead } from 'react-bootstrap-typeahead'
import 'react-bootstrap-typeahead/css/Typeahead.css'

export default class Autocomplete extends Component {
  render() {
    return (
      <Typeahead
        inputProps={{
          autoComplete: 'off',
          'aria-label': 'receptacle-id-autocomplete-is-on'
        }}
        id="given-name"
        ref={typeahead => (this.typeahead = typeahead)}
        {...this.props}
      />
    )
  }
}
