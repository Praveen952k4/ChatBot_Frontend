// ChatSidebar.tsx

import React, { useState, useRef, useEffect } from "react";
import { MessageSquare, Trash2, Pencil, Plus, ChevronLeft, ChevronRight, Mail, Users, Send, X, Loader2 } from "lucide-react";

// --- INTERFACES (No changes needed) ---
interface Conversation {
  id: string;
  title: string;
  messages: any[];
}
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
}
interface ConversationListProps {
  conversations: Conversation[];
  currentConversationId: string | null;
  onSelectConversation: (id: string) => void;
  onDeleteConversation: (id: string) => void;
  onRenameConversation: (id: string, newTitle: string) => void;
}
interface ChatSidebarProps {
  conversations: Conversation[];
  currentConversationId: string | null;
  onSelectConversation: (id: string) => void;
  onDeleteConversation: (id: string) => void;
  onRenameConversation: (id: string, newTitle: string) => void;
  onNewConversation: () => void;
}

// --- SUB-COMPONENTS (No changes needed) ---
const Button: React.FC<ButtonProps> = ({ className, onClick, children, ...props }) => (
  <button onClick={onClick} className={`transition-all duration-150 rounded-md ${className}`} {...props}>
    {children}
  </button>
);

const ConversationList: React.FC<ConversationListProps> = ({ conversations, currentConversationId, onSelectConversation, onDeleteConversation, onRenameConversation }) => {
    // ... (This component's code is unchanged, assuming it's here)
    // For brevity, I'm omitting the full code of this sub-component as it's not modified.
    // If it's in a separate file, no changes are needed there.
    return <div className="flex-1 overflow-y-auto mt-4"> {/* Placeholder */} </div>;
};


// --- UPDATED CHAT SIDEBAR COMPONENT ---
export default function ChatSidebar({
  conversations = [],
  currentConversationId,
  onSelectConversation,
  onDeleteConversation,
  onRenameConversation,
  onNewConversation,
}: ChatSidebarProps) {
  const [collapsed, setCollapsed] = useState(false);
  const [isInviting, setIsInviting] = useState(false);
  const [inviteEmail, setInviteEmail] = useState("");
  const [isSending, setIsSending] = useState(false); // For loading state
  const collapseButtonRef = useRef<HTMLButtonElement>(null);

  const handleNewChat = (e: React.MouseEvent) => {
    e.preventDefault();
    onNewConversation();
  };

  // --- THIS IS THE MODIFIED FUNCTION ---
  const handleSendInvite = async () => {
    if (!inviteEmail.trim() || !inviteEmail.includes('@')) {
      alert("Please enter a valid email address.");
      return;
    }
    
    setIsSending(true); // Start loading

    try {
      // Call your backend API
      const response = await fetch('https://chatbot-backend-tjxu.onrender.com/api/invite', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: inviteEmail }),
      });

      const result = await response.json();

      if (response.ok) {
        alert(result.message); // Show success message from server
        // Reset form
        setInviteEmail("");
        setIsInviting(false);
      } else {
        // Show error message from server
        throw new Error(result.message || 'An unknown error occurred.');
      }
    } catch (error) {
      console.error("API call failed:", error);
      alert(`Error: ${(error as Error).message}`);
    } finally {
      setIsSending(false); // Stop loading regardless of outcome
    }
  };
  
  return (
    <div className={`flex flex-col h-full bg-white border-r border-gray-200 transition-all duration-300 ${collapsed ? "w-14" : "w-64"}`}>
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-100">
        {!collapsed && <h2 className="text-sm font-semibold text-gray-700">Conversations</h2>}
        <Button onClick={() => setCollapsed(!collapsed)} className="p-1 hover:bg-gray-100" ref={collapseButtonRef}>
          {collapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
        </Button>
      </div>

      {/* Middle Section */}
      <div className="flex-1 flex flex-col overflow-y-auto">
        {!collapsed && (
          <div className="px-4 mt-4">
            <Button onClick={handleNewChat} className="w-full py-2 bg-blue-600 text-white hover:bg-blue-700 text-sm flex items-center justify-center gap-2">
              <Plus className="h-4 w-4" /> New Chat
            </Button>
          </div>
        )}
        <div className="flex-1 px-4">
          <ConversationList
            conversations={conversations}
            currentConversationId={currentConversationId}
            onSelectConversation={onSelectConversation}
            onDeleteConversation={onDeleteConversation}
            onRenameConversation={onRenameConversation}
          />
        </div>
      </div>

      {/* Bottom Section (Organisation / Invite) */}
      {!collapsed && (
        <div className="px-4 py-4 border-t border-gray-100">
          <div className="flex items-center gap-2 mb-3">
            <Users className="h-4 w-4 text-gray-500" />
            <span className="text-sm font-medium text-gray-700">Organisation</span>
          </div>
          <div className="space-y-2">
            {!isInviting ? (
              <Button onClick={() => setIsInviting(true)} className="flex items-center gap-2 text-sm text-gray-600 hover:text-blue-600 w-full text-left p-1">
                <Mail className="h-3 w-3" />
                <span>Invite friends via email</span>
              </Button>
            ) : (
              <div className="space-y-2">
                <div className="relative">
                  <Mail className="h-3 w-3 absolute left-2 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    type="email"
                    placeholder="Enter friend's email"
                    value={inviteEmail}
                    onChange={(e) => setInviteEmail(e.target.value)}
                    className="w-full pl-7 pr-2 py-1 text-sm border border-gray-300 rounded-md"
                    autoFocus
                    disabled={isSending}
                  />
                </div>
                <div className="flex items-center justify-end gap-2">
                  <Button onClick={() => setIsInviting(false)} className="p-1 hover:bg-gray-100" disabled={isSending}>
                    <X className="h-3 w-3 text-gray-500"/>
                  </Button>
                  <Button onClick={handleSendInvite} className="p-1 hover:bg-blue-100 flex items-center justify-center w-6 h-6" disabled={isSending}>
                    {isSending ? <Loader2 className="h-3 w-3 animate-spin text-blue-600"/> : <Send className="h-3 w-3 text-blue-600"/>}
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}