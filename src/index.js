// Copyright (c) Microsoft Corporation and others. Licensed under the MIT license.
// SPDX-License-Identifier: MIT

import React from 'react'
import ReactDOM from 'react-dom'
import './styles/index.css'
import { unregister } from './registerServiceWorker'
import { RehydrationProvider } from './components'
import ReactGA from 'react-ga'
ReactGA.initialize(process.env['REACT_APP_GA_TRACKINGID'])
ReactGA.pageview(window.location.pathname + window.location.search)

ReactDOM.render(<RehydrationProvider />, document.getElementById('root'))
unregister()
