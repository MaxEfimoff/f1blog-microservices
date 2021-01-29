import React, { lazy, Suspense, useState, useEffect } from 'react';
import { Router, Route, Switch, Redirect } from 'react-router-dom';
import { createBrowserHistory } from 'history';
import postal from 'postal';

import Progress from './components/Progress';
import Header from './components/Header';

const MarketingLazy = lazy(() => import('./components/MarketingApp'));
const AuthLazy = lazy(() => import('./components/AuthApp'));
const DashboardLazy = lazy(() => import('./components/DashboardApp'));

const history = createBrowserHistory();

export default () => {
  const [isSignedIn, setIsSignedIn] = useState(false);
  const [name, setName] = useState(null);

  useEffect(() => {
    if (localStorage.jwtToken) {
      setIsSignedIn(true);
    }

    // POSTAL
    const handleStorageChange = (data, env) => {
      console.log('Env', env);
      setIsSignedIn(data.isSignedIn);
      setName(data.name);
    };

    const subscription = postal.subscribe({
      channel: 'auth',
      topic: 'login',
      callback: handleStorageChange,
    });

    console.log('Subscribing as, ', subscription);
  }, []);

  return (
    <Router history={history}>
      <div>
        <Header
          onSignOut={() => setIsSignedIn(false)}
          isSignedIn={isSignedIn}
          name={name}
        />
        <Suspense fallback={<Progress />}>
          <Switch>
            <Route path="/auth">
              <AuthLazy onSignIn={() => setIsSignedIn(true)} />
            </Route>
            <Route path="/dashboard">
              {!isSignedIn && <Redirect to="/" />}
              <DashboardLazy />
            </Route>
            <Route path="/">
              <MarketingLazy />
            </Route>
          </Switch>
        </Suspense>
      </div>
    </Router>
  );
};
