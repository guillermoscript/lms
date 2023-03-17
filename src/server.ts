import express from 'express';
import payload from 'payload';
import { runInactivateSubscriptionAndCreateRenewalOrder } from './lib/cron';

require('dotenv').config();
const app = express();

// Redirect root to Admin panel
app.get('/', (_, res) => {
  res.redirect('/admin');
});

// Initialize Payload
payload.init({
  secret: process.env.PAYLOAD_SECRET,
  mongoURL: process.env.MONGODB_URI,
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

app.listen(3000);
