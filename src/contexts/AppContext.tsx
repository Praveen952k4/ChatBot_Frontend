import React, { createContext, useContext, useState, useEffect } from "react";

export type Message = {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
};

export type Conversation = {
  id: string;
  title: string;
  messages: Message[];
  createdAt: Date;
};

export type Organization = {
  id: string;
  name: string;
  role: "admin" | "member";
  members: { id: string; name: string; email: string; role: string }[];
};

export type Notification = {
  id: string;
  title: string;
  message: string;
  timestamp: Date;
  read: boolean;
};

type User = {
  id: string;
  name: string;
  email: string;
  credits: number;
};

type AppContextType = {
  user: User | null;
  setUser: (user: User | null) => void;
  conversations: Conversation[];
  currentConversation: Conversation | null;
  setCurrentConversation: (conv: Conversation | null) => void;
  addMessage: (message: Omit<Message, "id" | "timestamp">) => void;
  createConversation: () => void;
  deleteConversation: (id: string) => void;
  organizations: Organization[];
  activeOrg: Organization | null;
  setActiveOrg: (org: Organization) => void;
  notifications: Notification[];
  markNotificationRead: (id: string) => void;
  deductCredits: (amount: number) => void;
};

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(() => {
    // Initialize user from local storage
    const storedUser = localStorage.getItem("user");
    return storedUser ? JSON.parse(storedUser) : null;
  });

  const [conversations, setConversations] = useState<Conversation[]>([
    {
      id: "1",
      title: "New Chat",
      messages: [],
      createdAt: new Date(),
    },
  ]);

  const [currentConversation, setCurrentConversation] = useState<Conversation | null>(
    conversations[0]
  );

  const [organizations, setOrganizations] = useState<Organization[]>([
    {
      id: "1",
      name: "My Organization",
      role: "admin",
      members: [
        { id: "1", name: "Demo User", email: "demo@example.com", role: "admin" },
      ],
    },
  ]);

  const [activeOrg, setActiveOrg] = useState<Organization | null>(organizations[0]);

  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: "1",
      title: "Welcome!",
      message: "Welcome to the ChatGPT-style application",
      timestamp: new Date(),
      read: false,
    },
  ]);

  const addMessage = (message: Omit<Message, "id" | "timestamp">) => {
    if (!currentConversation) return;

    const newMessage: Message = {
      ...message,
      id: Date.now().toString(),
      timestamp: new Date(),
    };

    const updatedConversation = {
      ...currentConversation,
      messages: [...currentConversation.messages, newMessage],
      title:
        currentConversation.messages.length === 0
          ? message.content.slice(0, 30) + "..."
          : currentConversation.title,
    };

    setConversations((prev) =>
      prev.map((c) => (c.id === currentConversation.id ? updatedConversation : c))
    );
    setCurrentConversation(updatedConversation);
  };

  const createConversation = () => {
    const newConv: Conversation = {
      id: Date.now().toString(),
      title: "New Chat",
      messages: [],
      createdAt: new Date(),
    };
    setConversations((prev) => [newConv, ...prev]);
    setCurrentConversation(newConv);
  };

  const deleteConversation = (id: string) => {
    setConversations((prev) => prev.filter((c) => c.id !== id));
    if (currentConversation?.id === id) {
      setCurrentConversation(conversations[0] || null);
    }
  };

  const markNotificationRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const deductCredits = (amount: number) => {
    if (user) {
      setUser({ ...user, credits: Math.max(0, user.credits - amount) });
    }
  };

  useEffect(() => {
    // Update local storage when user changes
    if (user) {
      localStorage.setItem("user", JSON.stringify(user));
    } else {
      localStorage.removeItem("user");
    }
  }, [user]);

  return (
    <AppContext.Provider
      value={{
        user,
        setUser,
        conversations,
        currentConversation,
        setCurrentConversation,
        addMessage,
        createConversation,
        deleteConversation,
        organizations,
        activeOrg,
        setActiveOrg,
        notifications,
        markNotificationRead,
        deductCredits,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) throw new Error("useApp must be used within AppProvider");
  return context;
}