// src/components/chat/ChatArea.tsx
"use client";

import { useState, useRef, useEffect } from "react";
import { useApp } from "@/contexts/AppContext";
import { toast } from "sonner";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { Loader2 } from "lucide-react";
import { ChatInput } from "./ChatInput";
import { MessageActions } from "./MessageActions";
import { QuickActions } from "./QuickActions";
import { MessageContent } from "./MessageContent";

const WelcomeScreen = () => (
  <div className="flex-1 flex items-center justify-center bg-background">
    <div className="text-center">
      <h2 className="text-2xl font-semibold mb-2">How can I help you today?</h2>
      <p className="text-muted-foreground">
        Start a conversation by typing a message below.
      </p>
    </div>
  </div>
);

export function ChatArea() {
  const { currentConversation, addMessage, user, deductCredits } = useApp();
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [currentConversation?.messages]);

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
        `This is a mock response to demonstrate the chat functionality.`,
        `Great question! Let me break this down for you...`,
        `Here's the information you requested about "${messageText}".`,
      ];
      addMessage({
        role: "assistant",
        content:
          demoResponses[Math.floor(Math.random() * demoResponses.length)],
      });
      setIsLoading(false);
    }, 1500);
  };

  const handleRegenerate = () => {
    const lastUserMessage = [...(currentConversation?.messages || [])]
      .reverse()
      .find((m) => m.role === "user");
    if (lastUserMessage) handleSendMessage(lastUserMessage.content);
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
    <div className="flex h-full flex-col bg-background border-l">
      {/* Chat Scroll Area */}
      {hasMessages ? (
        <ScrollArea className="flex-1 p-6" ref={scrollRef}>
          <div className="space-y-6 max-w-3xl mx-auto">
            {currentConversation.messages.map((message, index) => (
              <div
                key={message.id}
                className={cn(
                  "flex items-start gap-3",
                  message.role === "user"
                    ? "justify-end text-right"
                    : "justify-start text-left"
                )}
              >
                <div
                  className={cn(
                    "rounded-2xl px-5 py-3 shadow-sm max-w-[80%] transition-all",
                    message.role === "user"
                      ? "bg-primary text-primary-foreground rounded-br-none"
                      : "bg-muted text-foreground rounded-bl-none"
                  )}
                >
                  <MessageContent content={message.content} />

                  <div className="flex justify-between items-center mt-2 border-t border-border/40 pt-1">
                    <span className="text-xs text-muted-foreground">
                      {new Date(message.timestamp).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </span>
                    <MessageActions
                      content={message.content}
                      messageId={message.id}
                      role={message.role}
                      onRegenerate={
                        message.role === "assistant" &&
                        index === currentConversation.messages.length - 1
                          ? handleRegenerate
                          : undefined
                      }
                    />
                  </div>

                  {message.role === "assistant" &&
                    index === currentConversation.messages.length - 1 && (
                      <QuickActions onAction={handleSendMessage} />
                    )}
                </div>
              </div>
            ))}

            {isLoading && (
              <div className="flex items-center justify-start gap-3">
                <div className="bg-muted px-5 py-3 rounded-2xl shadow-sm flex items-center gap-2">
                  <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
                  <span className="text-muted-foreground text-sm">
                    AI Assistant is typing...
                  </span>
                </div>
              </div>
            )}
          </div>
        </ScrollArea>
      ) : (
        <WelcomeScreen />
      )}

      {/* Input Box */}
      <div className="border-t bg-background px-4 py-3">
        <ChatInput onSubmit={handleSendMessage} isLoading={isLoading} />
      </div>
    </div>
  );
}
