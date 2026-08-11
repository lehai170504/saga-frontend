importScripts('https://www.gstatic.com/firebasejs/10.9.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.9.0/firebase-messaging-compat.js');

// TBD: Thay thế bằng config thật của Firebase (hoặc tự động inject lúc build)
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_AUTH_DOMAIN",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_STORAGE_BUCKET",
  messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
  appId: "YOUR_APP_ID"
};

try {
  firebase.initializeApp(firebaseConfig);
  const messaging = firebase.messaging();

  messaging.onBackgroundMessage((payload) => {
    console.log('[firebase-messaging-sw.js] Received background message ', payload);
    const notificationTitle = payload.notification?.title || 'SAGA Thông báo';
    const notificationOptions = {
      body: payload.notification?.body,
      icon: '/favicon.ico',
      data: payload.data
    };

    self.registration.showNotification(notificationTitle, notificationOptions);
  });
} catch (e) {
  console.log("Firebase SW init failed", e);
}
