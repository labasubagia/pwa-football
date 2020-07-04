import { PUSH_VAPID_KEY_PUBLIC } from './const';

/**
 * Change base64string to uint8Array
 * @param {String} base64String
 * @return {Uint8Array}
 */
const urlB64ToUint8Array = (base64String) => {
  const padding = '='.repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding)
    .replace(/\-/g, '+')
    .replace(/_/g, '/');
  const rawData = atob(base64);
  const outputArray = new Uint8Array(rawData.length);
  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
};

/**
 * Change Uint8Array to String
 * @param {Uint8Array} uInt8Array
 * @return {String}
 */
const uInt8ArrayToStr = (uInt8Array) => {
  return btoa(String.fromCharCode.apply(null, new Uint8Array(uInt8Array)));
};

/**
 * Ask notification permission to user
 */
const permissionNotification = async () => {
  const LOG_LABEL = '[Notification]';

  // Check browser support
  if ('Notification' in window) {
    // User response
    const result = await Notification.requestPermission();

    // User answer
    if (result === 'denied') {
      console.log(`${LOG_LABEL} access denied`);
      return;
    } else if (result === 'default') {
      console.log(`${LOG_LABEL} User close permission modal`);
      return;
    } else {
      // Notification permission allowed
      if ('PushManager' in window) {
        const LOG_LABEL = '[Push Manager]';

        try {
          // Get registration from service worker
          const registration = await navigator.serviceWorker.getRegistration();

          // Subscribe to FCM
          const subscription = await registration.pushManager.subscribe({
            applicationServerKey: urlB64ToUint8Array(PUSH_VAPID_KEY_PUBLIC),
            userVisibleOnly: true,
          });

          // Show push subscription
          console.log(`${LOG_LABEL} Endpoint \n${subscription.endpoint}`);
          console.log(
            `${LOG_LABEL} p256dh key \n${uInt8ArrayToStr(
              subscription.getKey('p256dh'),
            )}`,
          );
          console.log(
            `${LOG_LABEL} Auth key \n${uInt8ArrayToStr(
              subscription.getKey('auth'),
            )}`,
          );
        } catch (error) {
          console.error(`${LOG_LABEL} ${error.message}`);
        }
      }
    }
  }
};

export { permissionNotification };
