// src/components/chat/ChatArea.tsx
import { useState, useRef, useEffect } from "react";
import { useApp } from "@/contexts/AppContext";
import { toast } from "sonner";
import { ScrollArea } from "@/components/ui/scroll-area";

// Assuming you move the message mapping logic into its own component
// For now, we'll keep it here for simplicity but it's a good next step.

import { cn } from "@/lib/utils";
import { Loader2 } from "lucide-react";
import { ChatInput } from "./ChatInput";
import { MessageActions } from "./MessageActions";
import { QuickActions } from "./QuickActions";
import { MessageContent } from "./MessageContent";


const WelcomeScreen = () => (
    <div className="flex-1 flex items-center justify-center">
        <div className="text-center">
            <h2 className="text-2xl font-semibold mb-2">How can I help you today?</h2>
            <p className="text-muted-foreground">Start a conversation by typing a message below.</p>
        </div>
    </div>
);


export function ChatArea() {
  const { currentConversation, addMessage, user, deductCredits } = useApp();
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Auto-scroll to the bottom of the chat
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

    // Simulate API call and streaming response
    setTimeout(() => {
      const demoResponses = [
        `Here's a simple example in **JavaScript**:\n\n\`\`\`javascript\nfunction greet(name) {\n  return \`Hello, \${name}!\`;\n}\n\nconsole.log(greet("World"));\n\`\`\``,
        `I can help with that! Here are some key points:\n\n1. **First point**\n2. **Second point**\n\n> This is a helpful tip!`,
        `Sure! Here's the information you requested about "${messageText}".`
      ];
      addMessage({
        role: "assistant",
        content: demoResponses[Math.floor(Math.random() * demoResponses.length)],
      });
      setIsLoading(false);
    }, 1500);
  };
  
  const handleRegenerate = () => {
    const lastUserMessage = [...(currentConversation?.messages || [])]
      .reverse()
      .find((m) => m.role === "user");

    if (lastUserMessage) {
      handleSendMessage(lastUserMessage.content);
    }
  };

  if (!currentConversation) {
    return (
      <div className="flex h-full items-center justify-center">
        <p className="text-muted-foreground">Select or start a new conversation.</p>
      </div>
    );
  }

  const hasMessages = currentConversation.messages.length > 0;

  return (
    <div className="flex h-full flex-col">
      {hasMessages ? (
          <ScrollArea className="flex-1 p-4" ref={scrollRef}>
              <div className="space-y-6 max-w-4xl mx-auto">
                {currentConversation.messages.map((message, index) => (
                    // This mapping logic can also be moved to a <ChatMessages /> component
                    <div key={message.id} className={cn("group flex gap-3 items-start", message.role === "user" ? "flex-row-reverse" : "flex-row")}>
                        <div className={cn("flex-1 rounded-2xl px-5 py-4 shadow-sm", message.role === "user" ? "bg-primary text-primary-foreground ml-12" : "bg-muted mr-12")}>
                            {/* NOTE: The edit-in-place logic has been removed for simplicity, as resubmitting is a more common pattern. */}
                            <MessageContent content={message.content} />
                            <div className="flex items-center justify-between mt-3 pt-2 border-t border-border/50">
                                <span className="text-xs opacity-60">{new Date(message.timestamp).toLocaleTimeString()}</span>
                                <MessageActions
                                    content={message.content}
                                    messageId={message.id}
                                    role={message.role}
                                    onRegenerate={message.role === 'assistant' && index === currentConversation.messages.length - 1 ? handleRegenerate : undefined}
                                />
                            </div>
                            {message.role === 'assistant' && index === currentConversation.messages.length - 1 && (
                                <QuickActions onAction={handleSendMessage} />
                            )}
                        </div>
                    </div>
                ))}
                {isLoading && (
                    <div className="flex gap-3"><div className="rounded-2xl px-5 py-4 bg-muted"><Loader2 className="h-5 w-5 animate-spin" /></div></div>
                )}
              </div>
          </ScrollArea>
      ) : (
        <WelcomeScreen />
      )}
            <ChatInput onSubmit={handleSendMessage} isLoading={isLoading} />
    </div>
  );
}