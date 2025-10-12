import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate, Outlet } from "react-router-dom";
import { useState, useCallback } from 'react';
import { v4 as uuidv4 } from 'uuid';

// Import your actual context providers
// Make sure you have created these files
import { AppProvider, useApp } from "./contexts/AppContext";

// Import your page components
// Ensure these files exist in the specified paths
import LoginPage from "./pages/Login";
import SignupPage from "./pages/Signup";
import NotFoundPage from "./pages/NotFound";
import ChatPage from "./pages/Chat";

// Define the Conversation type
type Conversation = {
  id: string;
  title: string;
  messages: {
    role: string;
    content: string;
  }[];
};

// Create a client for React Query
const queryClient = new QueryClient();

/**
 * A component to protect routes that require authentication.
 * It checks if a user is logged in using the AppContext.
 * If the user is logged in, it renders the child route (e.g., ChatPage).
 * If not, it redirects the user to the login page.
 */
const ProtectedRoute = () => {
  // This hook will determine if the user is authenticated.
  // Your AppContext must provide this 'user' object.
  const { user } = useApp();

  // If there's no user object, redirect to the login page
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // If the user is authenticated, render the nested route
  return <Outlet />;
};

/**
 * The main App component that orchestrates all providers and routing.
 */
function App() {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [currentConversationId, setCurrentConversationId] = useState<string | null>(null);

  const handleNewConversation = useCallback(() => {
    // Clear current conversation to show EmptyChatScreen
    setCurrentConversationId(null);
  }, []);

  const handlePromptSelect = useCallback((prompt: string) => {
    // Create new conversation when prompt is selected
    const newConversationId = uuidv4();
    const newConversation = {
      id: newConversationId,
      title: prompt.slice(0, 30) + '...',
      messages: [{
        role: 'user',
        content: prompt
      }]
    };

    setConversations(prev => [...prev, newConversation]);
    setCurrentConversationId(newConversationId);
  }, []);

  return (
    // Provides React Query client to the entire app
    <QueryClientProvider client={queryClient}>
      {/* Provides theme context (e.g., 'dark' or 'light') */}
      <div style={{ backgroundColor: 'white', minHeight: '100vh' }}>

        {/* Provides global application state (user, conversations, etc.) */}
        <AppProvider>
          {/* Enables tooltips throughout the application */}
          <TooltipProvider>
            {/* Renders traditional toasts */}
            <Toaster />
            {/* Renders modern "sonner" toasts */}
            <Sonner />
            {/* Handles all application routing */}
            <BrowserRouter>
              <Routes>
                {/* --- Public Routes --- */}
                {/* Redirect the base URL to the login page */}
                <Route path="/" element={<Navigate to="/login" replace />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/signup" element={<SignupPage />} />

                {/* --- Protected Routes --- */}
                {/* All routes nested inside ProtectedRoute require authentication */}
                <Route path="/chat" element={<ProtectedRoute />}>
                  {/* The 'index' route renders when the path is exactly "/chat" */}
                  <Route index element={<ChatPage />} />
                </Route>

                {/* --- Catch-all Route --- */}
                {/* Renders the NotFoundPage for any route that doesn't match */}
                <Route path="*" element={<NotFoundPage />} />
              </Routes>
            </BrowserRouter>
          </TooltipProvider>
        </AppProvider>
        </div>
    </QueryClientProvider>
  );
}

export default App;
