import { Send } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useState } from "react";

interface ChatInputProps {
  onSubmit?: (message: string) => void;
  isLoading?: boolean;
}

export function ChatInput({ onSubmit, isLoading }: ChatInputProps) {
  const [message, setMessage] = useState("");
  const maxLength = 2000;

  const handleSubmit = () => {
    if (message.trim() && !isLoading) {
      onSubmit?.(message);
      setMessage("");
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  return (
   
      <div className="relative max-w-4xl mx-auto">
        <div className="relative">
          <Textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask me anything..."
            className="min-h-[50px] resize-none pr-16 bg-gray-50 border-gray-200 focus-visible:ring-1 focus-visible:ring-blue-500 rounded-lg"
            disabled={isLoading}
          />
          <Button 
            size="icon" 
            onClick={handleSubmit}
            disabled={!message.trim() || isLoading}
            className="absolute right-3 top-1/2 -translate-y-1/2 bg-blue-600 hover:bg-blue-700 text-white rounded-full w-8 h-8"
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
      
        <div className="flex justify-between items-center mt-2 text-xs text-gray-500">
          <span>Press Enter to send, Shift+Enter for new line</span>
          <span>{message.length}/{maxLength}</span>
        </div>
      </div>

  );
}