import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate, Outlet } from "react-router-dom";
import { useState, useCallback } from "react";
import { v4 as uuidv4 } from "uuid";

import { AppProvider, useApp } from "./contexts/AppContext";

import LoginPage from "./pages/Login";
import SignupPage from "./pages/Signup";
import NotFoundPage from "./pages/NotFound";
import ChatPage from "./pages/Chat";

type Conversation = {
  id: string;
  title: string;
  messages: {
    role: string;
    content: string;
  }[];
};

const queryClient = new QueryClient();

const ProtectedRoute = () => {
  const { user } = useApp();
  return user ? <Outlet /> : <Navigate to="/login" replace />;
};

function App() {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [currentConversationId, setCurrentConversationId] = useState<string | null>(null);

  const handleNewConversation = useCallback(() => {
    setCurrentConversationId(null);
  }, []);

  const handlePromptSelect = useCallback((prompt: string) => {
    const newConversationId = uuidv4();
    const newConversation = {
      id: newConversationId,
      title: prompt.slice(0, 30) + "...",
      messages: [{ role: "user", content: prompt }],
    };

    setConversations((prev) => [...prev, newConversation]);
    setCurrentConversationId(newConversationId);
  }, []);

  return (
    <BrowserRouter>
      <QueryClientProvider client={queryClient}>
        <AppProvider>
          <TooltipProvider>
            <Toaster />
            <Sonner />
            <div style={{ backgroundColor: "white", minHeight: "100vh" }}>
              <Routes>
                {/* Public Routes */}
                <Route path="/" element={<Navigate to="/login" replace />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/signup" element={<SignupPage />} />

                {/* Protected Routes */}
                <Route path="/chat" element={<ProtectedRoute />}>
                  <Route index element={<ChatPage />} />
                </Route>

                {/* 404 Fallback */}
                <Route path="*" element={<NotFoundPage />} />
              </Routes>
            </div>
          </TooltipProvider>
        </AppProvider>
      </QueryClientProvider>
    </BrowserRouter>
  );
}

export default App;
