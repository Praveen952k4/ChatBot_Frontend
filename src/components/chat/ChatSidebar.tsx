import React, { useState, useRef, useEffect } from "react";
import { MessageSquare, Trash2, Pencil, Plus, ChevronLeft, ChevronRight } from "lucide-react";

// Add proper TypeScript interfaces
interface Conversation {
  id: string;
  title: string;
  messages: any[]; // Replace 'any' with your message type
}

interface ButtonProps {
  className?: string;
  onClick?: (e: React.MouseEvent) => void;
  children: React.ReactNode;
  'aria-label'?: string;
}

interface ConversationListProps {
  conversations: Conversation[];
  currentConversationId: string | null;
  onSelectConversation: (id: string) => void;
  onDeleteConversation: (id: string) => void;
  onRenameConversation: (id: string, newTitle: string) => void;
}

const Button: React.FC<ButtonProps> = ({ className, onClick, children, ...props }) => (
  <button 
    onClick={onClick} 
    className={`transition-all duration-150 rounded-md ${className}`}
    {...props}
  >
    {children}
  </button>
);

// Update ConversationList component with proper types
const ConversationList: React.FC<ConversationListProps> = ({
  conversations,
  currentConversationId,
  onSelectConversation,
  onDeleteConversation,
  onRenameConversation,
}) => {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [renameValue, setRenameValue] = useState("");
  const renameInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (renameInputRef.current) {
      renameInputRef.current.focus();
    }
  }, [editingId]);

  const handleRenameStart = (e: React.MouseEvent, conversation: Conversation) => {
    e.stopPropagation();
    setEditingId(conversation.id);
    setRenameValue(conversation.title);
  };

  const handleRenameSubmit = () => {
    if (editingId && renameValue.trim()) {
      onRenameConversation(editingId, renameValue.trim());
    }
    setEditingId(null);
    setRenameValue("");
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleRenameSubmit();
    } else if (e.key === "Escape") {
      setEditingId(null);
      setRenameValue("");
    }
  };

  return (
    <div className="flex-1 overflow-y-auto px-4 mt-4">
      {conversations.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-full">
          <div className="bg-gray-200/60 rounded-full p-4 mb-3">
            <MessageSquare className="h-6 w-6 text-gray-500" />
          </div>
          <p className="text-sm text-gray-500 font-medium">No conversations yet</p>
        </div>
      ) : (
        <div className="space-y-2">
          {conversations.map((conversation) => (
            <div
              key={conversation.id}
              className={`group relative p-3 rounded-lg cursor-pointer transition-colors ${
                currentConversationId === conversation.id
                  ? "bg-blue-100 border border-blue-200"
                  : "hover:bg-gray-100"
              }`}
              onClick={() => onSelectConversation(conversation.id)}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1 min-w-0">
                  {editingId === conversation.id ? (
                    <input
                      type="text"
                      value={renameValue}
                      onChange={(e) => setRenameValue(e.target.value)}
                      onBlur={handleRenameSubmit}
                      onKeyDown={handleKeyDown}
                      className="text-sm font-medium bg-white border border-blue-300 rounded p-1 -m-1 w-full focus:outline-none focus:ring-1 focus:ring-blue-500"
                      autoFocus
                      onClick={(e) => e.stopPropagation()}
                      ref={renameInputRef}
                    />
                  ) : (
                    <h3 className="text-sm font-medium text-gray-900 truncate">{conversation.title}</h3>
                  )}
                  <p className="text-xs text-gray-500 mt-1">
                    {conversation.messages.length} messages
                  </p>
                </div>

                <div className="flex items-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <Button
                    className="h-6 w-6 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-md flex items-center justify-center"
                    onClick={(e) => handleRenameStart(e, conversation)}
                  >
                    <Pencil className="h-3 w-3" />
                  </Button>
                  <Button
                    className="h-6 w-6 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-md flex items-center justify-center"
                    onClick={(e) => {
                      e.stopPropagation();
                      onDeleteConversation(conversation.id);
                    }}
                  >
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

interface ChatSidebarProps {
  conversations: Conversation[];
  currentConversationId: string | null;
  onSelectConversation: (id: string) => void;
  onDeleteConversation: (id: string) => void;
  onRenameConversation: (id: string, newTitle: string) => void;
  onNewConversation: () => void;
  onPromptSelect?: (prompt: string) => void;
}

export default function ChatSidebar({
  conversations = [],
  currentConversationId,
  onSelectConversation,
  onDeleteConversation,
  onRenameConversation,
  onNewConversation,
  onPromptSelect
}: ChatSidebarProps) {
  const [collapsed, setCollapsed] = useState(false);
  const collapseButtonRef = useRef<HTMLButtonElement>(null);

  const handleNewChat = (e: React.MouseEvent) => {
    e.preventDefault();
    if (typeof onNewConversation === 'function') {
      onNewConversation();
      // This will trigger the EmptyChatScreen to show in the main chat area
      setCurrentConversationId(null);
    }
  };

  // Add this to handle prompt selection
  const handlePromptClick = (prompt: string) => {
    if (onPromptSelect) {
      onPromptSelect(prompt);
    }
  };

  return (
    <div
      className={`flex flex-col h-full bg-white border-r border-gray-200 transition-all duration-300 ${
        collapsed ? "w-14" : "w-64"
      }`}
    >
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-100">
        {!collapsed && <h2 className="text-sm font-semibold text-gray-700">Conversations</h2>}
        <Button
          onClick={() => {
            setCollapsed(!collapsed);
            if (collapseButtonRef.current) {
              collapseButtonRef.current.focus();
            }
          }}
          className="p-1 hover:bg-gray-100 rounded-md"
          aria-label={collapsed ? "Expand Sidebar" : "Collapse Sidebar"}
          ref={collapseButtonRef}
        >
          {collapsed ? (
            <ChevronRight className="h-4 w-4 text-gray-600" />
          ) : (
            <ChevronLeft className="h-4 w-4 text-gray-600" />
          )}
        </Button>
      </div>

      {/* New Chat Button */}
      {!collapsed && (
        <div className="px-4 mt-4">
          <Button
            onClick={handleNewChat}
            className="w-full py-2 bg-blue-600 text-white hover:bg-blue-700 text-sm flex items-center justify-center gap-2"
            aria-label="Create new chat"
          >
            <Plus className="h-4 w-4" /> New Chat
          </Button>
        </div>
      )}

      {/* Conversation List */}
      {!collapsed && (
        <ConversationList
          conversations={conversations}
          currentConversationId={currentConversationId}
          onSelectConversation={onSelectConversation}
          onDeleteConversation={onDeleteConversation}
          onRenameConversation={onRenameConversation}
        />
      )}
    </div>
  );
}
