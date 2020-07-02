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
  endpoint: 'https://fcm.googleapis.com/fcm/send/eGKfplFN6O0:APA91bF39pAR41Y3DorXXmK81Xb6nWoAq_csB-aEYvEawduGJUkpWhR74JswVXX1jGMf0LWfMyzkWWGec5GGH_IBoVFn-wPiGltrdwxUTeWCBAccmmawonfhG5YgZ5FdO9ICLL0lK8ej',
  keys: {
    p256dh: 'BBmMEoyQrELNUHEL35XGHzyVl+b8tJujNH2NomZXt1eTz5cTTpQwTPS2hWTWGwXhmE84luQBxPidCI7640nKCuk=',
    auth: 'ZFCRILSGzwGTDVcxFEYTtw==',
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