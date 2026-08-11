import { initializeApp, getApps, getApp } from "firebase/app";
import { getMessaging, getToken, onMessage } from "firebase/messaging";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || "",
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || "",
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || "",
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || "",
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || "",
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || ""
};

// Initialize Firebase
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();

let messaging: ReturnType<typeof getMessaging> | null = null;
if (typeof window !== "undefined" && "serviceWorker" in navigator) {
  messaging = getMessaging(app);
}

export const VAPID_PUBLIC_KEY = "BFA7q3HsgAZ5rrG2xBNNPwkMqPYhPpox3PKGHdBB4hjZ1ITtJzZBugzGlBPYdqkzlomlpeUatQFrt2KkZogC8yI";

export const getFirebaseInstallationId = async () => {
  if (!messaging) return null;
  try {
    return await getToken(messaging, { vapidKey: VAPID_PUBLIC_KEY });
  } catch (error) {
    console.error("An error occurred while retrieving token. ", error);
    return null;
  }
};

export { app, messaging, getToken, onMessage };
