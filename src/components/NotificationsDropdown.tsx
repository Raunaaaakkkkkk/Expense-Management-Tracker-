"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";

interface Notification {
  id: string;
  message: string;
  createdAt: string;
  sender: {
    name: string | null;
    email: string;
  };
}

export default function NotificationsDropdown() {
  const { data: session } = useSession();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const fetchNotifications = async () => {
    if (!session?.user) return;
    setLoading(true);
    try {
      const response = await fetch("/api/notifications");
      if (response.ok) {
        const data = await response.json();
        setNotifications(data.notifications);
      }
    } catch (error) {
      console.error("Error fetching notifications:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      fetchNotifications();
    }
  }, [isOpen, session]);

  if (!session?.user) return null;

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100 rounded-lg transition-colors"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-5 5v-5zM4.868 12.683A17.925 17.925 0 0112 21c7.962 0 12-1.21 12-2.683m-12 2.683a17.925 17.925 0 01-7.132-8.317M12 21V9m0 0l-4 4m4-4l4 4" />
        </svg>
        {notifications.length > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
            {notifications.length}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg border border-neutral-200 z-50">
          <div className="p-4 border-b border-neutral-200">
            <h3 className="text-lg font-semibold">Notifications</h3>
          </div>
          <div className="max-h-96 overflow-y-auto">
            {loading ? (
              <div className="p-4 text-center text-neutral-500">Loading...</div>
            ) : notifications.length === 0 ? (
              <div className="p-4 text-center text-neutral-500">No notifications</div>
            ) : (
              notifications.map((notification) => (
                <div key={notification.id} className="p-4 border-b border-neutral-100 hover:bg-neutral-50">
                  <div className="text-sm text-neutral-900">{notification.message}</div>
                  <div className="text-xs text-neutral-500 mt-1">
                    From: {notification.sender.name || notification.sender.email}
                  </div>
                  <div className="text-xs text-neutral-400 mt-1">
                    {new Date(notification.createdAt).toLocaleString()}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}
