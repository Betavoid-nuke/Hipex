// /twinx/components/AppNotification.tsx
'use client';

import { NotificationMessage } from "../lib/types";

interface AppNotificationProps {
  notification: NotificationMessage;
}

const AppNotification = ({ notification }: AppNotificationProps) => (
  <div
    className={`fixed bottom-5 right-5 bg-[#6366F1] text-white py-2 px-4 rounded-lg shadow-lg transform transition-transform duration-300 ${
      notification.show ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
    }`}
  >
    {notification.message}
  </div>
);

export default AppNotification;