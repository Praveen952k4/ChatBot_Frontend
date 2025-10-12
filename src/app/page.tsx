"use client";

import { ChatSidebar } from "@/components/chat/ChatSidebar";
import ChatArea from "@/components/chat/ChatArea";
import { useState } from "react";

export default function Home() {
  const [chats, setChats] = useState<React.ReactNode[]>([]);
  const [activeChat, setActiveChat] = useState<React.ReactNode | null>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true); // State to control sidebar visibility

  const handleNewChat = () => {
    // Save the current chat to the chats array
    if (activeChat) {
      setChats([...chats, activeChat]);
    }

    // Create a new ChatArea and set it as the active chat
    setActiveChat(<ChatArea />);
  };

  const handleSidebarCollapse = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className="flex h-screen">
      {isSidebarOpen && <ChatSidebar onNewChat={handleNewChat} onCollapse={handleSidebarCollapse} />} {/* Conditionally render sidebar */}

      <main className="flex-1 bg-white rounded-md shadow-xl m-4">
        {activeChat}
      </main>
    </div>
  );
}