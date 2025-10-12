"use client";

import { LogOut, Settings, UserCircle, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useApp } from "@/contexts/AppContext";
import { useNavigate } from "react-router-dom";

export function UserProfileButton() {
  const { user, setUser } = useApp();
  const navigate = useNavigate();

  const handleSignOut = () => {
    // Clear user data and redirect to login
    setUser(null);
    localStorage.removeItem("chatConversations");
    localStorage.removeItem("currentConversationId");
    navigate("/login");
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className="flex items-center gap-2 rounded-full p-1.5 hover:bg-gray-100 transition-colors">
          <UserCircle className="h-6 w-6 text-gray-600" />
          <span className="text-sm font-medium text-gray-700 hidden md:block max-w-[250px] truncate">
            {user?.email || "praveenkalimuthu2004@gmail.com"}
          </span>
          <ChevronDown className="h-4 w-4 text-gray-500 flex-shrink-0" />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56 shadow-lg border border-gray-200">
        <DropdownMenuLabel className="text-gray-900 font-medium">
          {user?.email || "praveenkalimuthu2004@gmail.com"}
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem className="cursor-pointer hover:bg-gray-50">
          <Settings className="mr-2 h-4 w-4 text-gray-600" />
          <span className="text-gray-700">Settings</span>
        </DropdownMenuItem>
        <DropdownMenuItem 
          onClick={handleSignOut}
          className="cursor-pointer hover:bg-gray-50 focus:bg-gray-50"
        >
          <LogOut className="mr-2 h-4 w-4 text-gray-600" />
          <span className="text-gray-700">Sign Out</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}