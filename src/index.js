// Copyright (c) Microsoft Corporation.
// SPDX-License-Identifier: MIT

import React from 'react'
import ReactDOM from 'react-dom'
import './styles/index.css'
import registerServiceWorker from './registerServiceWorker'
import { RehydrationProvider } from './components'

ReactDOM.render(<RehydrationProvider />, document.getElementById('root'))
registerServiceWorker()
