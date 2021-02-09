import React, { useEffect } from 'react';
// import postal from 'postal';
import { Switch, Route, Router } from 'react-router-dom';
import { Provider } from 'react-redux';
import store from './store';
import {
  StylesProvider,
  createGenerateClassName,
} from '@material-ui/core/styles';
import { loadUser } from './actions/auth';

import Signin from './components/Signin';
import Signup from './components/Signup';
import Alert from './components/UI/Alert';
import setAuthToken from './helpers/setAuthToken';

const generateClassName = createGenerateClassName({
  productionPrefix: 'au',
});

if (localStorage.jwtToken) {
  setAuthToken(localStorage.jwtToken);
}

export default ({ history, onSignIn }) => {
  useEffect(() => {
    store.dispatch(loadUser());

    // // POSTAL
    // const setRouteEvent = (data, env) => {
    //   console.log('Env', env);
    //   console.log(data);
    // };

    // const subscription = postal.subscribe({
    //   channel: 'route',
    //   topic: 'path',
    //   callback: setRouteEvent,
    // });
    // console.log(subscription);
  }, []);

  return (
    <Provider store={store}>
      <StylesProvider generateClassName={generateClassName}>
        <Router history={history}>
          <Alert />
          <Switch>
            <Route path="/auth/signin">
              <Signin onSignIn={onSignIn} />
            </Route>
            <Route path="/auth/signup">
              <Signup onSignIn={onSignIn} />
            </Route>
          </Switch>
        </Router>
      </StylesProvider>
    </Provider>
  );
};
