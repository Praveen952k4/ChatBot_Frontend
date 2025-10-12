import { MessageSquare, Sparkles } from "lucide-react";
import { Card } from "@/components/ui/card";

interface EmptyChatScreenProps {
  onPromptClick?: (prompt: string) => void;
}

export function EmptyChatScreen({ onPromptClick }: EmptyChatScreenProps) {
  const suggestedPrompts = [
    "Explain quantum computing in simple terms",
    "Write a Python function to sort a list",
    "What are the benefits of meditation?",
    "Help me plan a weekend trip to Paris"
  ];

  const handlePromptClick = (prompt: string) => {
    if (onPromptClick) {
      onPromptClick(prompt);
    }
  };

  return (
    <div className="flex-1 flex flex-col items-center justify-center text-center p-8">
      {/* Welcome Icon */}
      <div className="mb-6">
        <div className="relative">
          <div className="w-16 h-16 bg-blue-600 rounded-xl flex items-center justify-center">
            <Sparkles className="w-8 h-8 text-white" />
          </div>
          <div className="absolute -top-1 -right-1 w-6 h-6 bg-blue-400 rounded-full border-2 border-white"></div>
        </div>
      </div>

      {/* Welcome Text */}
      <h1 className="text-3xl font-bold mb-3">Welcome to AI Chat</h1>
      <p className="text-muted-foreground mb-8 max-w-md">
        Start a conversation with our AI assistant. Ask questions, get help with tasks, or explore ideas together.
      </p>

      {/* Suggested Prompts */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-2xl w-full">
        {suggestedPrompts.map((prompt, index) => (
          <Card 
            key={index}
            className="p-4 text-left hover:shadow-md transition-shadow cursor-pointer border-gray-200 hover:border-blue-300 hover:bg-blue-50/50"
            onClick={() => handlePromptClick(prompt)}
          >
            <div className="flex items-start gap-3">
              <MessageSquare className="w-5 h-5 text-gray-500 mt-0.5 flex-shrink-0" />
              <span className="text-sm text-gray-700">{prompt}</span>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}