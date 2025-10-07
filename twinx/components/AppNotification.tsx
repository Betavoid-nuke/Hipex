"use client";

import { useState, useEffect } from "react";

// 🟣 This will hold the real implementation once the provider mounts
let showNotificationHandler: ((message: string) => void) | null = null;

// ✅ Exported global function you can call from anywhere
export function showNotification(message: string) {
  if (showNotificationHandler) {
    showNotificationHandler(message);
  } else {
    console.warn("⚠️ Notification system not ready yet.");
  }
}

// 🟡 Provider component — put this in your root layout
export function NotificationProvider({ children }: { children: React.ReactNode }) {
  const [notification, setNotification] = useState<{ show: boolean; message: string }>({
    show: false,
    message: "",
  });

  // Local function to actually show notification
  const triggerNotification = (message: string) => {
    setNotification({ show: true, message });
    setTimeout(() => setNotification({ show: false, message: "" }), 3000);
  };

  // When provider mounts, register the global handler
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
        className={`fixed bottom-5 right-5 bg-[#6366F1] text-white py-2 px-4 rounded-lg shadow-lg transform transition-all duration-300 ${
          notification.show ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0 pointer-events-none"
        }`}
      >
        {notification.message}
      </div>
    </>
  );
}
