// Copyright (c) Microsoft Corporation and others. Licensed under the MIT license.
// SPDX-License-Identifier: MIT

// Delays loading until the store is rehydrated
import React, { Component } from 'react'
import { persistStore, createTransform } from 'redux-persist'
import {
  ROUTE_ROOT,
  ROUTE_DEFINITIONS,
  ROUTE_INSPECT,
  ROUTE_HARVEST,
  ROUTE_CONTRIBUTION,
  ROUTE_ABOUT,
  ROUTE_DISCORD
} from '../utils/routingConstants'
import { configureStore } from '../configureStore'
import { Provider } from 'react-redux'
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom'
import { App, PageLanding, PageDefinitions, PageInspect, PageHarvest } from './'
import { omit } from 'lodash'
import PageAbout from './PageAbout'
import PageContribution from './PageContribution'
import withTracker from '../utils/withTracker'

const store = configureStore()

// * store only SESSION
// * do not persist isFetching from the session
// * state in, state out, whitelist
const transformRemoveFetchErr = createTransform(state => omit(state, ['isFetching', 'error']), state => state, {
  whitelist: ['session']
})

export default class RehydrationDelayedProvider extends Component {
  constructor(props) {
    super(props)
    this.state = { rehydrated: false }
  }

  componentWillMount() {
    persistStore(store, { whitelist: ['session'], transforms: [transformRemoveFetchErr] }, () => {
      console.log('STORE RECOVERED!')
      console.log(store.getState())
      this.setState({ rehydrated: true })
    })
  }

  render() {
    if (!this.state.rehydrated) return <div className="loading-site-root">Loading...</div>
    return (
      <Provider store={store}>
        <Router>
          <App className="App">
            <Switch>
              <Route path={ROUTE_DEFINITIONS} component={withTracker(PageDefinitions)} />
              <Route path={ROUTE_INSPECT} component={withTracker(PageInspect)} />
              <Route path={ROUTE_CONTRIBUTION} component={withTracker(PageContribution)} />
              <Route path={ROUTE_HARVEST} component={withTracker(PageHarvest)} />
              <Route path={ROUTE_ABOUT} component={withTracker(PageAbout)} />
              <Route path={ROUTE_DISCORD} component={() => (window.location = 'https://discord.gg/wEzHJku')} />
              <Route path={ROUTE_ROOT} component={withTracker(PageLanding)} />
            </Switch>
          </App>
        </Router>
      </Provider>
    )
  }
}
