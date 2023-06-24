import express from 'express';
import payload from 'payload';
import { runInactivateSubscriptionAndCreateRenewalOrder } from './lib/cron';

require('dotenv').config();
const app = express();

// Redirect root to Admin panel
app.get('/', (_, res) => {
  res.redirect('/admin');
});

const secret = process.env.PAYLOAD_SECRET
const mongoURL = process.env.MONGODB_URI

if (!secret) {
  throw new Error('Missing env var: PAYLOAD_SECRET')
}

if (!mongoURL) {
  throw new Error('Missing env var: MONGODB_URI')
}

// Initialize Payload
payload.init({
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
    fromAddress: 'noreply@pincelx.com'
  },
  onInit: () => {
    payload.logger.info(`Payload Admin URL: ${payload.getAdminURL()}`)
  },
})

// Add your own express routes here

app.get('/cron', async (req, res) => {

  runInactivateSubscriptionAndCreateRenewalOrder().then((result) => {
    console.log(result, '<----------- result');
  }).catch((error) => {
    console.log(error, '<----------- error');
  })
})

app.listen(process.env.PORT);
// app.listen(process.env.PORT, () => {
//   payload.logger.info(`Server running on port ${process.env.PORT}`)
// });
