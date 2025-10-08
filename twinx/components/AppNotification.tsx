"use client";

import { useState, useEffect } from "react";

// 🟣 Define the supported types
type NotificationType = "normal" | "warning" | "error" | "notification";

// 🟡 Map types to background colors
const typeColors: Record<NotificationType, string> = {
  normal: "bg-blue-500",
  warning: "bg-yellow-500 text-black",
  error: "bg-red-500",
  notification: "bg-black",
};

// 🟣 Internal handler reference
let showNotificationHandler: ((message: string, type?: NotificationType) => void) | null = null;

// ✅ Global function — can be called from anywhere in the app
export function showNotification(message: string, type: NotificationType = "normal") {
  if (showNotificationHandler) {
    showNotificationHandler(message, type);
  } else {
    console.warn("⚠️ Notification system not ready yet.");
  }
}

// 🟡 Provider component — wrap your app with this in `layout.tsx`
export function NotificationProvider({ children }: { children: React.ReactNode }) {
  const [notification, setNotification] = useState<{
    show: boolean;
    message: string;
    type: NotificationType;
  }>({
    show: false,
    message: "",
    type: "normal",
  });

  // 🟢 Local function that actually shows notification
  const triggerNotification = (message: string, type: NotificationType = "normal") => {
    setNotification({ show: true, message, type });
    setTimeout(() => setNotification({ show: false, message: "", type: "normal" }), 3000);
  };

  // Register global handler
  useEffect(() => {
    showNotificationHandler = triggerNotification;
    return () => {
      showNotificationHandler = null;
    };
  }, []);

  return (
    <>
      {children}

      {/* 🟣 Notification UI */}
      <div
        className={`
          fixed bottom-5 right-5 px-4 py-2 rounded-lg shadow-lg
          text-white transition-all duration-300 transform
          ${notification.show ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0 pointer-events-none"}
          ${typeColors[notification.type]}
        `}
      >
        {notification.message}
      </div>
    </>
  );
}
