import passport from 'passport';

const googleOauthCallback = () => {
  passport.authenticate('google');
};

export { googleOauthCallback };
