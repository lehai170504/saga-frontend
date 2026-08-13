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
  try {
    messaging = getMessaging(app);
  } catch (e) {
    console.warn("[Firebase] Failed to initialize messaging:", e);
  }
}

export const VAPID_PUBLIC_KEY = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY || "";

export const getFirebaseInstallationId = async () => {
  if (typeof window === "undefined" || !messaging) return null;

  // 1. Kiểm tra trình duyệt có hỗ trợ Notification không
  if (!("Notification" in window)) {
    return null;
  }

  // 2. Nếu quyền Notification chưa được cấp (granted) hoặc bị chặn (blocked/denied) -> Bỏ qua lấy token
  if (Notification.permission !== "granted") {
    return null;
  }

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
    const registration = await navigator.serviceWorker.register(swUrl).catch((swErr) => {
      console.warn("[Firebase] ServiceWorker registration warning:", swErr);
      return null;
    });

    if (!registration) return null;

    if (!VAPID_PUBLIC_KEY) {
      return null;
    }

    const token = await getToken(messaging, {
      vapidKey: VAPID_PUBLIC_KEY,
      serviceWorkerRegistration: registration
    }).catch(() => {
      return null;
    });

    return token;
  } catch {
    return null;
  }
};

export const getFirebaseToken = async () => {
  if (typeof window === "undefined" || !messaging) return null;

  if (!("Notification" in window) || Notification.permission !== "granted") {
    return null;
  }

  try {
    const vapidKey = VAPID_PUBLIC_KEY || process.env.NEXT_PUBLIC_FIREBASE_VAPID_KEY || "";
    const token = await getToken(messaging, { vapidKey }).catch(() => {
      return null;
    });
    return token;
  } catch {
    return null;
  }
};

export { app, messaging, getToken, onMessage };
