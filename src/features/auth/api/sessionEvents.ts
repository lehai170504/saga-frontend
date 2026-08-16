import { useAuthStore } from '@/stores/authStore';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL ?? "https://saga-backend-production-3951.up.railway.app";
let events: EventSource | null = null;

export const sessionEvents = {
  start: () => {
    if (events) return; // already started

    events = new EventSource(`${API_BASE_URL}/api/auth/session-events`, { withCredentials: true });

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    events.addEventListener("account-disabled", (_event) => {
      if (events) {
        events.close();
        events = null;
      }

      const authStore = useAuthStore.getState();
      authStore.setAuthError("Tài khoản của bạn đã bị vô hiệu hóa. Vui lòng liên hệ Quản trị viên.");
      authStore.logoutLocalOnlyOrClearState();

      // Use window.location.replace to force a full unmount and go to landing page
      window.location.replace("/");
    });

    // Ignore heartbeat
    events.addEventListener("heartbeat", () => { });

    events.onerror = () => {
      // Browser will auto-reconnect, we do not need to do anything.
      // If we are getting 401, the browser might stop or keep retrying,
      // but our Axios interceptor will catch the 401 on other requests anyway.
    };
  },

  stop: () => {
    if (events) {
      events.close();
      events = null;
    }
  }
};
