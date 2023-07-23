import passport from 'passport'
import { Strategy as GoogleStrategy } from 'passport-google-oauth2'

passport.serializeUser(function (user, done) {
	done(null, user);
});

passport.deserializeUser(function (user: any, done) {
	done(null, user);
});

passport.use(new GoogleStrategy({
	clientID: process.env.CLIENT_ID || '',
	clientSecret: process.env.CLIENT_SECRET || '',
	callbackURL: process.env.SERVER_URL + '/oauth2/callback',
	passReqToCallback: true
},

	function (request: any, accessToken: string, refreshToken: any, profile: any, done: any) {
		return done(null, {
			accessToken,
			refreshToken,
			profile
		});
	}
));

export default passport