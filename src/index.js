// Copyright (c) Microsoft Corporation and others. Licensed under the MIT license.
// SPDX-License-Identifier: MIT

import React from 'react'
import ReactDOM from 'react-dom'
import './styles/index.css'
import "bootstrap/dist/css/bootstrap.min.css";
import "./styles/style.css"
import { unregister } from './registerServiceWorker'
import { RehydrationProvider } from './components'
import ReactGA from 'react-ga'
if (process.env.NODE_ENV === 'production') {
    ReactGA.initialize(process.env['REACT_APP_GA_TRACKINGID'])
    ReactGA.pageview(window.location.pathname + window.location.search)
}

if (!Array.prototype.includes)
    alert(
        'You need a browser that supports modern JavaScript features to view this site. Please switch to another browser.'
    )
ReactDOM.render(< RehydrationProvider />, document.getElementById('root'))
unregister()