import { useState, useRef, useEffect } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { Bot } from "lucide-react";
import { ChatInput } from "./ChatInput"; // Assuming you have this component

// Mock data starts with an empty conversation
const useApp = () => ({
  currentConversation: {
    id: "1",
    messages: [], // Start with no messages
  },
});

const TypingIndicator = () => (
  <div className="flex items-start gap-4">
    {/* Avatar */}
    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center">
      <Bot className="w-5 h-5 text-white" />
    </div>
    {/* Typing Bubble */}
    <div className="bg-gray-100 rounded-lg px-4 py-3 flex items-center">
      <div className="flex gap-1.5">
        <div className="w-2 h-2 rounded-full bg-gray-400 animate-bounce [animation-delay:0ms]" />
        <div className="w-2 h-2 rounded-full bg-gray-400 animate-bounce [animation-delay:150ms]" />
        <div className="w-2 h-2 rounded-full bg-gray-400 animate-bounce [animation-delay:300ms]" />
      </div>
    </div>
  </div>
);

export function ChatArea() {
  const { currentConversation } = useApp();
  const [messages, setMessages] = useState(currentConversation?.messages || []);
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to the latest message
  useEffect(() => {
    if (scrollRef.current) {
      const viewport = scrollRef.current.querySelector('[data-radix-scroll-area-viewport]');
      if (viewport) {
        viewport.scrollTop = viewport.scrollHeight;
      }
    }
  }, [messages, isLoading]);

  const handleSendMessage = async (messageText: string) => {
    if (!messageText.trim()) return;

    const userMessage = { id: Date.now().toString(), role: "user", content: messageText, timestamp: new Date() };
    setMessages(prev => [...prev, userMessage]);
    setIsLoading(true);

    // Mock assistant response after 1.5 seconds
    setTimeout(() => {
      const assistantMessage = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: "Based on your message, I can provide some insights... This is a mock response to demonstrate the chat functionality. In a real application, this would be connected to an actual AI service.",
        timestamp: new Date()
      };
      setMessages(prev => [...prev, assistantMessage]);
      setIsLoading(false);
    }, 1500);
  };

  return (
    <div className="flex h-full flex-col bg-white">
      <ScrollArea className="flex-1" ref={scrollRef}>
        <div className="py-6 px-4 space-y-6">
          {messages.map((message) => {
            const isUser = message.role === "user";
            return (
              <div
                key={message.id}
                className={cn("flex items-start gap-3", isUser && "justify-end flex-row-reverse")}
              >
                {/* Avatar */}
                <div
                  className={cn(
                    "flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center",
                    isUser ? "bg-gray-200" : "bg-blue-600"
                  )}
                >
                  {!isUser && <Bot className="w-5 h-5 text-white" />}
                </div>

                {/* Message Block (Timestamp + Bubble) */}
                <div className={cn("flex flex-col gap-1", isUser && "items-end")}>
                  <span className="text-xs text-gray-500 px-2">
                    {new Date(message.timestamp).toLocaleTimeString([], {
                      hour: 'numeric',
                      minute: '2-digit',
                      hour12: true
                    }).toLowerCase()}
                  </span>
                  <div
                    className={cn(
                      "rounded-xl px-4 py-2 max-w-md break-words",
                      isUser
                        ? "bg-white border border-gray-200"
                        : "bg-gray-100"
                    )}
                  >
                    <p className="text-sm text-gray-800">{message.content}</p>
                  </div>
                </div>
              </div>
            );
          })}
          {isLoading && <TypingIndicator />}
        </div>
      </ScrollArea>

      <div className="border-t border-gray-200 bg-white px-4 py-3">
        {/* Make sure your ChatInput component calls onSubmit */}
        <ChatInput onSubmit={handleSendMessage} isLoading={isLoading} />
      </div>
    </div>
  );
}
