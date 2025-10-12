import { Eye, Bell } from "lucide-react";
import { UserProfileButton } from "./UserProfileButton";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";

interface Notification {
  id: number;
  title: string;
  message: string;
  time: string;
  read: boolean;
  category?: string;
}

export function ChatHeader() {
  const user = { credits: 1248 }; // Match the exact number from image
  
  const initialNotifications: Notification[] = [
    {
      id: 1,
      title: "Welcome!",
      message: "Welcome to AI Chat. You have 1,250 credits to start with.",
      time: "6m ago",
      read: false,
      category: "system"
    },
    {
      id: 2,
      title: "Feature Update",
      message: "New conversation export feature is now available.",
      time: "2h ago",
      read: true,
      category: "update"
    }
  ];

  const [notifications, setNotifications] = useState<Notification[]>(initialNotifications);
  const unreadCount = notifications.filter((n) => !n.read).length;

  const getCategoryColor = (category?: string) => {
    switch (category) {
      case "system":
        return "bg-green-500";
      case "update":
        return "bg-blue-500";
      default:
        return "bg-gray-400";
    }
  };

  const handleMarkAllRead = () => {
    setNotifications(notifications.map(n => ({ ...n, read: true })));
  };


  return (
    <header className="flex h-16 items-center justify-between border-b border-gray-200 px-6 bg-white">
      {/* Left side: AI Chat title */}
      <h1 className="text-lg font-bold text-gray-900">AI Chat</h1>

      {/* Right side: icons */}
      <div className="flex items-center gap-4">
        {/* Credits - Eye icon with blue color */}
        <div className="flex items-center gap-1.5 rounded-lg bg-gray-100 px-3 py-1.5">
          <Eye className="h-4 w-4 text-blue-600" />
          <span className="text-sm font-medium text-blue-600">{user.credits.toLocaleString()}</span>
        </div>

        {/* Notifications Dropdown */}
        <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <Badge
              variant="destructive"
              className="absolute -right-1 -top-1 h-5 w-5 justify-center rounded-full p-0 text-xs"
            >
              {unreadCount}
            </Badge>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-80 p-0">
        {/* Header Section */}
        <div className="flex items-center justify-between p-3 border-b">
          <h3 className="text-sm font-semibold">Notifications</h3>
          <Button
            variant="link"
            size="sm"
            className="p-0 h-auto text-blue-600"
            onClick={handleMarkAllRead}
          >
            Mark all read
          </Button>
        </div>

        {/* List Section */}
        <ScrollArea className="max-h-80">
          {notifications.length > 0 ? (
            notifications.map((notification) => (
              <DropdownMenuItem
                key={notification.id}
                className={cn(
                  "flex items-start gap-3 p-3 border-b last:border-b-0",
                  !notification.read && "bg-secondary"
                )}
              >
                <div
                  className={cn(
                    "w-2 h-2 rounded-full flex-shrink-0 mt-1.5",
                    getCategoryColor(notification.category)
                  )}
                />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <h4 className="text-sm font-medium">{notification.title}</h4>
                    <p className="text-xs text-muted-foreground">{notification.time}</p>
                  </div>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    {notification.message}
                  </p>
                </div>
                {/* Unread Indicator */}
                {!notification.read && (
                    <div className="w-2 h-2 bg-blue-500 rounded-full flex-shrink-0 mt-1.5 ml-2"></div>
                )}
              </DropdownMenuItem>
            ))
          ) : (
            <div className="p-4 text-center">
              <p className="text-sm text-muted-foreground">No new notifications</p>
            </div>
          )}
        </ScrollArea>
      </DropdownMenuContent>
    </DropdownMenu>

        {/* User profile */}
        <UserProfileButton />
      </div>
    </header>
  );
}
