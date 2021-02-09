import React from 'react';
// import setAuthToken from './helpers/setAuthToken';
import { Switch, Route, Router, Link } from 'react-router-dom';

// if (localStorage.jwtToken) {
//   setAuthToken(localStorage.jwtToken);
// }

import News from './components/News';
import Blogs from './components/Blogs';

export default ({ history }) => {
  return (
    <Router history={history}>
      <Switch>
        <Route path="/main/blogs" component={Blogs} />
        <Route path="/main/news" component={News} />
      </Switch>
    </Router>
  );
};
