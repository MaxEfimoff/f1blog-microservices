import React, { lazy, Suspense, useState, useEffect } from 'react';
import {
  BrowserRouter,
  Router,
  Route,
  Switch,
  Redirect,
} from 'react-router-dom';
import { createBrowserHistory } from 'history';
import postal from 'postal';
import jwt_decode from 'jwt-decode';

import Progress from './components/Progress';
import Header from './components/Header';
import AuthApp from './components/AuthApp';
import MainApp from './components/MainApp';
import MarketingApp from './components/MarketingApp';

const MarketingLazy = lazy(() => import('./components/MarketingApp'));
// const MainLazy = lazy(() => import('./components/MainApp'));
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
  }, []);

  const onSignOut = () => {
    setIsSignedIn(false);

    // Remove token from localStorage
    localStorage.removeItem('jwtToken');

    // Remove auth geader for future requests
    setAuthToken(false);
  };

  return (
    <Router history={history}>
      <div>
        <Header onSignOut={onSignOut} isSignedIn={isSignedIn} name={name} />
        <Suspense fallback={<Progress />}>
          <Switch>
            <Route path="/auth">
              <AuthApp onSignIn={() => setIsSignedIn(true)} />
            </Route>
            <Route path="/dashboard">
              <DashboardLazy id="dashboard" />
            </Route>
            <Route path="/main">
              <MainApp />
            </Route>
            <Route path="/">
              <MarketingApp />
            </Route>
          </Switch>
        </Suspense>
      </div>
    </Router>
  );
};
