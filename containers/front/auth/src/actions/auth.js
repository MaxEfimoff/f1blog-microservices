import axios from 'axios';
import postal from 'postal';

import { setAlert } from './alert';
import {
  REGISTER_FAIL,
  REGISTER_SUCCESS,
  USER_LOADED,
  AUTH_ERROR,
  LOGIN_FAIL,
  LOGIN_SUCCESS,
  LOGOUT,
} from './types';
import setAuthToken from '../helpers/setAuthToken';

// Load User
export const loadUser = (token) => async (dispatch) => {
  if (token) {
    // Set token to local storage. Local storage only stores strings.
    localStorage.setItem('jwtToken', token);
    // Set token to Auth header
    setAuthToken(token);
  }

  try {
    const res = await axios.get('/api/v1/users/current');

    console.log('CURRET USER', res.data.data.name);

    dispatch({
      type: USER_LOADED,
      payload: res.data,
    });

    // POSTAL
    postal.publish({
      channel: 'auth',
      topic: 'login',
      data: {
        isSignedIn: true,
        name: res.data.data.name,
      },
    });
  } catch (err) {
    console.log(err);
    dispatch({
      type: AUTH_ERROR,
    });
  }
};

// Register User
export const register = ({ name, email, password, password2 }) => async (
  dispatch
) => {
  const config = {
    headers: {
      'Content-Type': 'application/json',
    },
  };

  const body = JSON.stringify({ name, email, password, password2 });

  try {
    const res = await axios.post('/api/v1/users/signup', body, config);

    dispatch({
      type: REGISTER_SUCCESS,
    });
  } catch (err) {
    const errors = err.response.data.errors;

    if (errors) {
      errors.forEach((error) => dispatch(setAlert(error.message, 'danger')));
    }

    dispatch({
      type: REGISTER_FAIL,
    });
  }
};

// LoginUser
export const login = ({ email, password }) => async (dispatch) => {
  const config = {
    headers: {
      'Content-Type': 'application/json',
    },
  };

  const body = JSON.stringify({ email, password });

  try {
    const res = await axios.post('/api/v1/users/login', body, config);

    const { token } = res.data.data;

    dispatch({
      type: LOGIN_SUCCESS,
      payload: res.data,
    });

    dispatch(loadUser(token));
  } catch (err) {
    const errors = err.response.data.errors;

    if (errors) {
      errors.forEach((error) => dispatch(setAlert(error.message, 'danger')));
    }

    dispatch({
      type: LOGIN_FAIL,
    });
  }
};

// Logout User / Clear Profile
export const logout = () => (dispatch) => {
  dispatch({ type: LOGOUT });
};
