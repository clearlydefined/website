// Copyright (c) Microsoft Corporation. All rights reserved.
// SPDX-License-Identifier: MIT

// Delays loading untill the store is rehydrated
import React, { Component } from 'react';
import { persistStore, createTransform } from 'redux-persist'
import { ROUTE_ROOT, ROUTE_COMPONENTS, ROUTE_CURATE, ROUTE_CURATION, ROUTE_HARVEST, ROUTE_ABOUT } from '../utils/routingConstants'
import { configureStore } from '../configureStore'
import { Provider } from 'react-redux'
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom'
import { App, Landing, PageCuration, PageCurate, PageComponents, PageHarvest } from './'
import { omit } from 'lodash'
import PageAbout from './PageAbout';

const store = configureStore()

// * store only SESSION
// * do not persist isFetching from the session
// * state in, state out, whitelist
const transformRemoveFetchErr = createTransform((state) => omit(state, ['isFetching', 'error']), (state) => (state), { whitelist: ['session'] })

export default class RehydrationDelayedProvider extends Component {

  constructor(props) {
    super(props)
    this.state = { rehydrated: false }
  }

  componentWillMount() {
    persistStore(store,
      { whitelist: ['session'], transforms: [transformRemoveFetchErr] },
      () => {
        console.log('STORE RECOVERED!')
        console.log(store.getState())
        this.setState({ rehydrated: true })
      })
  }

  render() {
    if (!this.state.rehydrated)
      return <div className="loading-site-root">Loading...</div>
    return (
      <Provider store={store}>
        <Router>
          <App className="App">
            <Switch>
              <Route path={ROUTE_COMPONENTS} component={PageComponents} />
              <Route path={ROUTE_CURATE} component={PageCurate} />
              <Route path={ROUTE_CURATION} component={PageCuration} />
              <Route path={ROUTE_HARVEST} component={PageHarvest} />
              <Route path={ROUTE_ABOUT} component={PageAbout} />
              <Route path={ROUTE_ROOT} component={Landing} />
            </Switch>
          </App>
        </Router>
      </Provider>
    )
  }
}
