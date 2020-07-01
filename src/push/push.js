/**
 * NOTE:
 * - This file is not part of project
 * - This file only use to test notification
 */

//  Import
const webPush = require('web-push');
const { 
  PUSH_SENDERKEY, 
  PUSH_VAPIDKEY_PRIVATE, 
  PUSH_VAPIDKEY_PUBLIC 
} = require('../script/const');

// This properties need to changed based on client
const pushSubscription = {
  endpoint: '',
  keys: {
    p256dh: '',
    auth: '',
  },
};

// Message
const payload = 'Hello football app user';

// Webpush options
const options = {
  gcmAPIKey: PUSH_SENDERKEY,
  TTL: 60,
  vapidDetails: {
    subject: 'mailto:labasubagia22@gmail.com',
    publicKey: PUSH_VAPIDKEY_PUBLIC,
    privateKey: PUSH_VAPIDKEY_PRIVATE,
  }
};

// Run webpush
(async () => {
  try {
    console.log(await webPush.sendNotification(pushSubscription, payload, options));
  } catch (error) {
    console.log(error);
  }
})();