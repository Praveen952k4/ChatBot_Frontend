import { ChatHeader } from "../components/chat/ChatHeader";
import { EmptyChatScreen } from "../components/chat/EmptyChatScreen";
import { ChatInput } from "../components/chat/ChatInput";
import { useState, useEffect } from "react";
import ChatSidebar from "@/components/chat/ChatSidebar";
import { chatApi } from "@/services/api";
import { toast } from "react-toastify";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

interface Conversation {
  id: string;
  title: string;
  messages: Message[];
  createdAt: Date;
}

export interface ChatSidebarProps {
  conversations: Conversation[];
  currentConversationId: string | null;
  onNewChat: () => void;
  onSelectConversation: (id: string) => void;
  onDeleteConversation: (id: string) => void;
  onCollapse: () => void;
  isCollapsed: boolean;
}

export default function ChatPage() {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [currentConversationId, setCurrentConversationId] = useState<string | null>(null);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [showNewChat, setShowNewChat] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Load conversations on component mount
  useEffect(() => {
    const fetchConversations = async () => {
      try {
        const response = await chatApi.getSessions();
        setConversations(response.data || []);
      } catch (error) {
        console.error('Failed to load conversations:', error);
        toast.error('Failed to load conversations');
      }
    };

    fetchConversations();
  }, []);

  // Load messages when conversation changes
  useEffect(() => {
    const fetchMessages = async () => {
      if (!currentConversationId) return;
      
      try {
        const response = await chatApi.getMessages(currentConversationId);
        setConversations(prev => 
          prev.map(conv => 
            conv.id === currentConversationId
              ? { ...conv, messages: response.data || [] }
              : conv
          )
        );
      } catch (error) {
        console.error('Failed to load messages:', error);
        toast.error('Failed to load messages');
      }
    };

    fetchMessages();
  }, [currentConversationId]);

  // Get current conversation
  const currentConversation = conversations.find(c => c.id === currentConversationId);
  const currentMessages = currentConversation?.messages || [];

  const handleNewChat = () => {
    setCurrentConversationId(null);
    setShowNewChat(true);
  };

  const handleSendMessage = async (message: string) => {
    if (!message.trim()) return;
    
    setShowNewChat(false);
    setIsLoading(true);
    
    try {
      let conversationId = currentConversationId;
      const userMessage: Message = {
        id: Date.now().toString(),
        role: "user",
        content: message,
        timestamp: new Date(),
      };

      // If no current conversation, create a new one
      if (!conversationId) {
        const response = await chatApi.createSession(
          message.length > 30 ? message.slice(0, 30) + "..." : message
        );
        
        const newConversation: Conversation = {
          id: response.data.id,
          title: response.data.title,
          messages: [userMessage],
          createdAt: new Date(response.data.createdAt),
        };
        
        setConversations(prev => [newConversation, ...prev]);
        setCurrentConversationId(newConversation.id);
        conversationId = newConversation.id;
      } else {
        // Add user message to existing conversation
        setConversations(prev => 
          prev.map(conv => 
            conv.id === conversationId
              ? {
                  ...conv,
                  messages: [...conv.messages, userMessage],
                }
              : conv
          )
        );
      }

      // Send message to backend and get AI response
      const response = await chatApi.postMessage(conversationId, message);
      const aiMessage: Message = {
        id: response.data.id,
        role: "assistant",
        content: response.data.content,
        timestamp: new Date(response.data.timestamp),
      };

      // Update conversation with AI response
      setConversations(prev => 
        prev.map(conv => 
          conv.id === conversationId
            ? {
                ...conv,
                messages: [...conv.messages, aiMessage],
              }
            : conv
        )
      );
    } catch (error) {
      console.error('Error sending message:', error);
      toast.error('Failed to send message');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelectConversation = (id: string) => {
    setCurrentConversationId(id);
  };

  const handleDeleteConversation = async (id: string) => {
    try {
      await chatApi.deleteSession(id);
      setConversations(prev => prev.filter(conv => conv.id !== id));
      
      if (currentConversationId === id) {
        setCurrentConversationId(null);
      }
      
      toast.success('Conversation deleted');
    } catch (error) {
      console.error('Failed to delete conversation:', error);
      toast.error('Failed to delete conversation');
    }
  };

  const handleSidebarCollapse = () => {
    setSidebarCollapsed(!sidebarCollapsed);
  };

  return (
    <div className="flex flex-col h-screen bg-white text-gray-900">
      {/* Header */}
      <ChatHeader />

      {/* Main content: Sidebar + Chat */}
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        
        <ChatSidebar 
          conversations={conversations}
          currentConversationId={currentConversationId}
          onNewChat={handleNewChat}
          onSelectConversation={handleSelectConversation}
          onDeleteConversation={handleDeleteConversation}
          onCollapse={handleSidebarCollapse}
          isCollapsed={sidebarCollapsed}
        />

        {/* Chat area */}
        <main className="flex-1 flex flex-col overflow-hidden">
          <div className="flex-1 flex flex-col overflow-y-auto">
            {/* Show EmptyChatScreen for new chat */}
            {showNewChat && (
              <div className="flex-1">
                <EmptyChatScreen onPromptClick={handleSendMessage} />
              </div>
            )}

            {/* Show previous conversations */}
            {!showNewChat && (
              <div className="flex-1 overflow-y-auto p-4">
                <div className="max-w-4xl mx-auto flex flex-col gap-4">
                  {currentMessages.length === 0 ? (
                    <EmptyChatScreen onPromptClick={handleSendMessage} />
                  ) : (
                    currentMessages.map((message) => (
                      <div
                        key={message.id}
                        className={`p-4 rounded-lg shadow-sm ${
                          message.role === "user" 
                            ? "bg-blue-600 text-white ml-12" 
                            : "bg-gray-50 mr-12"
                        }`}
                      >
                        <p className="text-xs opacity-60 mb-1 capitalize">
                          {message.role}
                        </p>
                        <p className="whitespace-pre-wrap">{message.content}</p>
                        <p className="text-xs opacity-60 mt-2">
                          {message.timestamp.toLocaleTimeString()}
                        </p>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Input always visible at bottom */}
          <div className="border-t p-4">
            <ChatInput onSubmit={handleSendMessage} disabled={isLoading} />
            {isLoading && (
              <p className="text-sm text-gray-500 mt-2">AI is thinking...</p>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}