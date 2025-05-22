import { useState } from "react";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Bell } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";

interface Notification {
  id: string;
  title: string;
  message: string;
  time: Date;
  read: boolean;
}

function formatRelativeTime(date: Date) {
  const now = new Date();
  const diff = Math.floor((now.getTime() - date.getTime()) / 1000);
  if (diff < 60) return "less than a minute ago";
  if (diff < 3600) return `${Math.floor(diff / 60)} minute(s) ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)} hour(s) ago`;
  return `${Math.floor(diff / 86400)} day(s) ago`;
}

const NotificationSheet = () => {
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: "1",
      title: "Task Assignment",
      message: "You have been assigned to the task: demo 1",
      time: new Date(),
      read: false
    },
    // Add more mock notifications as needed
  ]);

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map(n => ({ ...n, read: true })));
  };

  const markAsRead = (id: string) => {
    setNotifications((prev) => prev.map(n => n.id === id ? { ...n, read: true } : n));
  };

  const clearNotification = (id: string) => {
    setNotifications((prev) => prev.filter(n => n.id !== id));
  };

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" aria-label="Notifications" className="relative">
          <Bell className="h-5 w-5 text-gray-600" />
          {notifications.some(n => !n.read) && (
            <span className="absolute top-2 right-2 h-2 w-2 bg-red-500 rounded-full" />
          )}
        </Button>
      </SheetTrigger>
      <SheetContent className="w-[400px] sm:w-[440px] bg-blue-50">
        <SheetHeader>
          <SheetTitle className="text-2xl font-semibold">Notifications</SheetTitle>
        </SheetHeader>
        <div className="mt-4 flex justify-start">
          <Button
            variant="outline"
            size="sm"
            className="rounded-md"
            onClick={markAllAsRead}
            disabled={notifications.every(n => n.read)}
          >
            Mark all as read
          </Button>
        </div>
        <ScrollArea className="h-[calc(100vh-160px)] mt-4 pr-2">
          <div className="space-y-4">
            {notifications.length === 0 ? (
              <div className="text-center text-gray-500 py-8">
                No notifications
              </div>
            ) : (
              notifications.map((notification) => (
                <div
                  key={notification.id}
                  className={`p-4 rounded-xl border flex flex-col gap-2 ${
                    notification.read ? 'bg-white' : 'bg-blue-100 border-blue-200'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="font-semibold text-lg">{notification.title}</div>
                    <div className="flex gap-2">
                      {!notification.read && (
                        <Button size="sm" variant="outline" onClick={() => markAsRead(notification.id)}>
                          Mark as read
                        </Button>
                      )}
                      <Button size="sm" variant="outline" onClick={() => clearNotification(notification.id)}>
                        Clear
                      </Button>
                    </div>
                  </div>
                  <div className="text-gray-700 text-base">{notification.message}</div>
                  <div className="text-xs text-gray-500 mt-1">
                    {formatRelativeTime(notification.time)}
                  </div>
                  <div className="text-xs text-gray-400">
                    {notification.time.toLocaleString()}
                  </div>
                </div>
              ))
            )}
          </div>
        </ScrollArea>
      </SheetContent>
    </Sheet>
  );
};

export default NotificationSheet;
