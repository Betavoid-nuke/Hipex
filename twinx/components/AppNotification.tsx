"use client";

import { toast } from "sonner";

type NotificationType = "normal" | "warning" | "error" | "notification";

// 🟡 Map types to styles
const typeStyles: Record<NotificationType, { title: string; }> = {
  normal: { title: "success" },
  warning: { title: "Warning" },
  error: { title: "Error" },
  notification: { title: "info" },
};

// ✅ Global function — call from anywhere
export function showNotification(message: string, type: NotificationType = "normal") {
  const { title } = typeStyles[type];
  switch (title) {
    case "error":
      toast.error(message);
      break;
    case "warning":
      toast.warning(message);
      break;
    case "info":
      toast.info(message);
      break;
    case "success":
      toast.success(message);
      break;
    case "description":
      toast(message, {
        description: "More details available.",
      });
      break;
    default:
      toast(message);
      break;
  }
}

// ✅ Dummy provider (kept for compatibility)
export function NotificationProvider({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
