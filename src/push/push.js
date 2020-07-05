/**
 * NOTE:
 * - This file is not part of project
 * - This file only use to test notification
 */

//  Import
const webPush = require('web-push');
const {
  PUSH_SENDER_KEY,
  PUSH_VAPID_KEY_PRIVATE,
  PUSH_VAPID_KEY_PUBLIC,
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

// Web push options
const options = {
  gcmAPIKey: PUSH_SENDER_KEY,
  TTL: 60,
  vapidDetails: {
    subject: 'mailto:labasubagia22@gmail.com',
    publicKey: PUSH_VAPID_KEY_PUBLIC,
    privateKey: PUSH_VAPID_KEY_PRIVATE,
  },
};

// Run web push
(async () => {
  try {
    console.log(
      await webPush.sendNotification(pushSubscription, payload, options),
    );
  } catch (error) {
    console.log(error);
  }
})();
