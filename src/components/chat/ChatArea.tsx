import { useState, useRef, useEffect } from "react";
import { useApp } from "@/contexts/AppContext";
import { toast } from "sonner";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { Bot, User } from "lucide-react";
import { ChatInput } from "./ChatInput";

const WelcomeScreen = () => (
  <div className="flex-1 flex items-center justify-center bg-background">
    <div className="text-center px-4">
      <h2 className="text-2xl font-semibold mb-2 text-foreground">How can I help you today?</h2>
      <p className="text-muted-foreground">
        Start a conversation by typing a message below.
      </p>
    </div>
  </div>
);

const TypingIndicator = () => (
  <div className="flex items-start gap-3 px-6">
    <div className="flex-shrink-0 w-9 h-9 rounded-full bg-[hsl(var(--chat-avatar-assistant))] flex items-center justify-center">
      <Bot className="w-5 h-5 text-white" />
    </div>
    <div className="flex flex-col gap-1">
      <div className="flex items-center gap-2">
        <span className="text-sm font-medium text-foreground">AI Assistant</span>
      </div>
      <div className="flex gap-1">
        <div className="w-2 h-2 rounded-full bg-muted-foreground/40 animate-bounce [animation-delay:0ms]" />
        <div className="w-2 h-2 rounded-full bg-muted-foreground/40 animate-bounce [animation-delay:150ms]" />
        <div className="w-2 h-2 rounded-full bg-muted-foreground/40 animate-bounce [animation-delay:300ms]" />
      </div>
    </div>
  </div>
);

export function ChatArea() {
  const { currentConversation, addMessage, user, deductCredits } = useApp();
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      const scrollElement = scrollRef.current.querySelector('[data-radix-scroll-area-viewport]');
      if (scrollElement) {
        scrollElement.scrollTop = scrollElement.scrollHeight;
      }
    }
  }, [currentConversation?.messages, isLoading]);

  const handleSendMessage = async (messageText: string) => {
    if (!messageText.trim() || isLoading) return;

    if (!user || user.credits < 1) {
      toast.error("Insufficient credits!");
      return;
    }

    setIsLoading(true);
    addMessage({ role: "user", content: messageText });
    deductCredits(1);

    // Mock assistant response
    setTimeout(() => {
      const demoResponses = [
        `Based on your message, I can provide some insights... This is a mock response to demonstrate the chat functionality. In a real application, this would be connected to an actual AI service.`,
        `Great question! Let me break this down for you. This is a demonstration of how the chat interface works with proper message formatting and styling.`,
        `Here's the information you requested about "${messageText}". This response showcases the clean, modern design of our chat interface.`,
      ];
      addMessage({
        role: "assistant",
        content:
          demoResponses[Math.floor(Math.random() * demoResponses.length)],
      });
      setIsLoading(false);
    }, 1500);
  };

  if (!currentConversation) {
    return (
      <div className="flex h-full items-center justify-center bg-background">
        <p className="text-muted-foreground">
          Select or start a new conversation.
        </p>
      </div>
    );
  }

  const hasMessages = currentConversation.messages.length > 0;

  return (
    <div className="flex h-full flex-col bg-background">
      {/* Chat Messages Area */}
      {hasMessages || isLoading ? (
        <ScrollArea className="flex-1" ref={scrollRef}>
          <div className="py-6 space-y-6">
            {currentConversation.messages.map((message) => (
              <div key={message.id} className="flex items-start gap-3 px-6">
                {/* Avatar */}
                <div
                  className={cn(
                    "flex-shrink-0 w-9 h-9 rounded-full flex items-center justify-center",
                    message.role === "user"
                      ? "bg-[hsl(var(--chat-avatar-user))]"
                      : "bg-[hsl(var(--chat-avatar-assistant))]"
                  )}
                >
                  {message.role === "user" ? (
                    <User className="w-5 h-5 text-foreground" />
                  ) : (
                    <Bot className="w-5 h-5 text-white" />
                  )}
                </div>

                {/* Message Content */}
                <div className="flex-1 space-y-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-foreground">
                      {message.role === "user" ? "You" : "AI Assistant"}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {new Date(message.timestamp).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </span>
                  </div>
                  <div
                    className={cn(
                      "rounded-2xl px-4 py-3 inline-block max-w-full break-words",
                      message.role === "user"
                        ? "bg-[hsl(var(--chat-user-bg))] text-[hsl(var(--chat-user-fg))] border border-border"
                        : "bg-[hsl(var(--chat-assistant-bg))] text-[hsl(var(--chat-assistant-fg))]"
                    )}
                  >
                    <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                  </div>
                </div>
              </div>
            ))}

            {isLoading && <TypingIndicator />}
          </div>
        </ScrollArea>
      ) : (
        <WelcomeScreen />
      )}

      {/* Input Box */}
      <div className="border-t border-border bg-background px-6 py-4">
        <ChatInput onSubmit={handleSendMessage} isLoading={isLoading} />
      </div>
    </div>
  );
}