import express from 'express';
import payload from 'payload';
import { noReplyEmail } from './utilities/consts';
import session from 'express-session';
import passport from './utilities/passport';
import generator from 'generate-password'
import getCookieExpiration from 'payload/dist/utilities/getCookieExpiration'
import jwt from 'jwt-simple'
import tryCatch from './utilities/tryCatch';
import { seed } from './seed';


type GoogleUserInfo = {
  provider: "google",
  sub: string,
  id: string,
  displayName: string,
  name: {
    givenName: string,
    familyName: string
  },
  given_name: string,
  family_name: string,
  email_verified: boolean,
  verified: boolean,
  language: string,
  email: string,
  picture: string | null
}


require('dotenv').config();
const app = express();

// Redirect root to Admin panel
app.get('/', (_, res) => {
  res.redirect('/admin');
});

async function start() {

  const secret = process.env.PAYLOAD_SECRET
  const mongoURL = process.env.MONGODB_URI

  if (!secret) {
    throw new Error('Missing env var: PAYLOAD_SECRET')
  }

  if (!mongoURL) {
    throw new Error('Missing env var: MONGODB_URI')
  }

  await payload.init({
    secret,
    mongoURL,
    express: app,
    email: {
      transportOptions: {
        host: process.env.SMTP_HOST,
        auth: {
          user: process.env.SMTP_USER,
          pass: process.env.SMTP_PASSWORD
        },
        port: process.env.SMTP_PORT,
        secure: true, // use TLS
        tls: {
          // do not fail on invalid certs
          rejectUnauthorized: false
        }
      },
      fromName: 'LMS Payload Admin',
      fromAddress: noReplyEmail
    },
    onInit: () => {
      payload.logger.info(`Payload Admin URL: ${payload.getAdminURL()}`)
    },
  })


  app.use(session({
    secret,
    resave: false,
    saveUninitialized: true,
    cookie: { secure: true }
  }))

  // Add your own express routes here
  const router = express.Router();

  router.use(payload.authenticate);

  app.use(passport.initialize());
  app.use(passport.session());

  app.get('/google',
    passport.authenticate('google', {
      scope: [
        'https://www.googleapis.com/auth/userinfo.email',
        'https://www.googleapis.com/auth/userinfo.profile',
        'openid',
      ],
    }
  ));

  app.get('/oauth2/callback',
    passport.authenticate('google', {
      failureRedirect: '/api/failed',
    }),

    async function (req: any, res) {
      
      const userInfoInGoogle = req?.user?.profile as GoogleUserInfo
      const googleAccessToken = req?.user?.accessToken as string

      const collectionSlug = 'users'
      let user = null

      const users = await payload.find({
        collection: collectionSlug,
        where: { sub: { equals: userInfoInGoogle['sub'] } },
        showHiddenFields: true,
      })

      if (users.docs && users.docs.length) {
        user = users.docs[0]
        const [userUpdate, err] = await tryCatch(payload.update({
          collection: collectionSlug,
          where: { sub: { equals: userInfoInGoogle['sub'] } },
          data: {
            googleAccessToken
          }
        }))

        if (err) {
          console.log('err', err)
          return res.redirect('/api/failed')
        }

      } else {
        const password = generator.generate({
          length: 20,
          numbers: true
        });
        // Register new user
        user = await payload.create({
          collection: collectionSlug,
          data: {
            firstName: userInfoInGoogle.name.givenName,
            lastName: userInfoInGoogle.name.familyName,
            email: userInfoInGoogle.email,
            googleProfilePicture: userInfoInGoogle.picture,
            googleId: userInfoInGoogle.id,
            sub: userInfoInGoogle.sub,
            profilePicture: userInfoInGoogle.picture,
            name: userInfoInGoogle.displayName,
            googleAccessToken,
            // Stuff breaks when password is missing
            password: password,
          },
          showHiddenFields: true,
        })
      }

      user.canAccessAdmin = true
      user.collection = collectionSlug
      user._strategy = 'oauth2'

      const collectionConfig = payload.collections[collectionSlug].config

      // Sign the JWT
      const token = jwt.encode(user, payload.secret)

      // Set cookie
      res.cookie(`${payload.config.cookiePrefix}-token`, token, {
        path: '/',
        httpOnly: false,
        expires: getCookieExpiration(collectionConfig.auth.tokenExpiration),
        secure: collectionConfig.auth.cookies.secure,
        sameSite: collectionConfig.auth.cookies.sameSite,
        domain: collectionConfig.auth.cookies.domain || undefined,
      })

      res.redirect('http://localhost:3001/dashboard/account')
    }
  );

  if (process.env.PAYLOAD_SEED === 'true') {
    payload.logger.info('Seeding Payload...')
    await seed(payload)
    payload.logger.info('Done.')
  }


  app.listen(process.env.PORT, () => {
    payload.logger.info(`Server running on port ${process.env.PORT}`)
  });
}

start().catch(error => {
  console.error(error)
  process.exit(1)
})


