import React from 'react';
import postal from 'postal';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import { makeStyles } from '@material-ui/core/styles';
import { Link } from 'react-router-dom';

const useStyles = makeStyles((theme) => ({
  '@global': {
    ul: {
      margin: 0,
      padding: 0,
      listStyle: 'none',
    },
    a: {
      textDecoration: 'none',
    },
  },
  appBar: {
    borderBottom: `1px solid ${theme.palette.divider}`,
  },
  toolbar: {
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  link: {
    margin: theme.spacing(1, 1.5),
  },
  heroContent: {
    padding: theme.spacing(8, 0, 6),
  },
  cardHeader: {
    backgroundColor:
      theme.palette.type === 'light'
        ? theme.palette.grey[200]
        : theme.palette.grey[700],
  },
  cardPricing: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'baseline',
    marginBottom: theme.spacing(2),
  },
  footer: {
    borderTop: `1px solid ${theme.palette.divider}`,
    marginTop: theme.spacing(8),
    paddingTop: theme.spacing(3),
    paddingBottom: theme.spacing(3),
    [theme.breakpoints.up('sm')]: {
      paddingTop: theme.spacing(6),
      paddingBottom: theme.spacing(6),
    },
  },
}));

export default function Header({ isSignedIn, onSignOut, name }) {
  const classes = useStyles();

  const onClick = () => {
    if (isSignedIn && onSignOut) {
      onSignOut();
    }
  };

  // POSTAL
  const sendRoute = () => {
    console.log('Click on header');
    postal.publish({
      channel: 'route',
      topic: 'path',
      data: {
        path: '/',
      },
    });
  };

  return (
    <React.Fragment>
      <AppBar
        position="static"
        color="default"
        elevation={0}
        className={classes.appBar}
      >
        <Toolbar className={classes.toolbar}>
          <Link to="/" onClick={sendRoute}>
            App
          </Link>
          <Link to="/dashboard">Dashboard</Link>
          <Link to="/main/news">Main Page</Link>
          <Link to={isSignedIn ? '/' : '/auth/signin'} onClick={onClick}>
            {isSignedIn ? 'Logout' : 'Login'}
          </Link>
          {isSignedIn && name ? <div>Hello {name}</div> : null}
          {isSignedIn ? null : <Link to="/auth/signup">Register</Link>}
        </Toolbar>
      </AppBar>
    </React.Fragment>
  );
}
