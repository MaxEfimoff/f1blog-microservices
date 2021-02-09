import React, { lazy, Suspense, useState, useEffect } from 'react';
import { BrowserRouter, Route, Switch, Redirect } from 'react-router-dom';
import { createBrowserHistory } from 'history';
import postal from 'postal';
import jwt_decode from 'jwt-decode';

import Progress from './components/Progress';
import Header from './components/Header';
import AuthApp from './components/AuthApp';

const MarketingLazy = lazy(() => import('./components/MarketingApp'));
// const AuthLazy = lazy(() => import('./components/AuthApp'));
const DashboardLazy = lazy(() => import('./components/DashboardApp'));

const history = createBrowserHistory();

export default () => {
  const [isSignedIn, setIsSignedIn] = useState(false);
  const [name, setName] = useState(null);

  useEffect(() => {
    if (localStorage.jwtToken) {
      setIsSignedIn(true);

      // Decode token and get user name
      const decoded = jwt_decode(localStorage.jwtToken);

      setName(decoded.name);

      // Check for expired token
      const currentTime = Date.now() / 1000;
      if (decoded.exp < currentTime) {
        // Logout user
        // this.$store.dispatch('auth/logout');
        // Clear current Profile
        // store.dispatch(clearCurrentProfile());
        // Redirect to login
        window.location.href = '/login';
      }
    }

    // POSTAL
    const loginUserEvent = (data, env) => {
      console.log('Env', env);
      setIsSignedIn(data.isSignedIn);
      setName(data.name);
    };

    const subscription = postal.subscribe({
      channel: 'auth',
      topic: 'login',
      callback: loginUserEvent,
    });

    console.log('Subscribing as, ', subscription);
  }, [isSignedIn]);

  const onSignOut = () => {
    setIsSignedIn(false);

    // Remove token from localStorage
    localStorage.removeItem('jwtToken');

    // Remove auth geader for future requests
    setAuthToken(false);
  };

  return (
    <BrowserRouter history={history}>
      <div>
        <Header onSignOut={onSignOut} isSignedIn={isSignedIn} name={name} />
        <Suspense fallback={<Progress />}>
          <Switch>
            <Route path="/auth">
              <AuthApp onSignIn={() => setIsSignedIn(true)} />
            </Route>
            <Route path="/dashboard">
              {/* {!isSignedIn && <Redirect to="/" />} */}
              <DashboardLazy id="dashboard" />
            </Route>
            <Route path="/">
              <MarketingLazy />
            </Route>
          </Switch>
        </Suspense>
      </div>
    </BrowserRouter>
  );
};
