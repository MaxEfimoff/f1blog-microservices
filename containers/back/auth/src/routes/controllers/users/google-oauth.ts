import passport from 'passport';

const googleOauth = () => {
  passport.authenticate('google', {
    scope: ['profile', 'email'],
  });
};

export { googleOauth };
