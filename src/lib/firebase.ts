import { initializeApp, getApps, getApp } from "firebase/app";
import { getMessaging, getToken, onMessage } from "firebase/messaging";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || "",
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || "",
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || "",
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || "",
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || "",
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || "",
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID || ""
};

// Initialize Firebase
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();

let messaging: ReturnType<typeof getMessaging> | null = null;
if (typeof window !== "undefined" && "serviceWorker" in navigator) {
  messaging = getMessaging(app);
}

export const VAPID_PUBLIC_KEY = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY || "";

export const getFirebaseInstallationId = async () => {
  if (!messaging) return null;
  try {
    const params = new URLSearchParams({
      apiKey: firebaseConfig.apiKey,
      authDomain: firebaseConfig.authDomain,
      projectId: firebaseConfig.projectId,
      storageBucket: firebaseConfig.storageBucket,
      messagingSenderId: firebaseConfig.messagingSenderId,
      appId: firebaseConfig.appId,
      measurementId: firebaseConfig.measurementId,
    }).toString();

    const swUrl = `/firebase-messaging-sw.js?${params}`;
    console.log("[Firebase] Registering SW with URL:", swUrl);
    const registration = await navigator.serviceWorker.register(swUrl);
    console.log("[Firebase] SW Registration successful, state:", registration.active ? 'active' : (registration.installing ? 'installing' : 'waiting'));

    console.log("[Firebase] Using VAPID Key:", VAPID_PUBLIC_KEY);
    if (!VAPID_PUBLIC_KEY) {
      console.error("[Firebase] VAPID_PUBLIC_KEY is empty! Token subscription will fail.");
    }

    return await getToken(messaging, {
      vapidKey: VAPID_PUBLIC_KEY,
      serviceWorkerRegistration: registration
    });
  } catch (error) {
    console.error("An error occurred while retrieving token. ", error);
    return null;
  }
};

export { app, messaging, getToken, onMessage };
