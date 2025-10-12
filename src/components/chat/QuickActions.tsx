import { Button } from "@/components/ui/button";
import { Sparkles, Languages, BookOpen } from "lucide-react";

interface QuickActionsProps {
  onAction: (prompt: string) => void;
}

export function QuickActions({ onAction }: QuickActionsProps) {
  const actions = [
    {
      label: "Summarize",
      icon: BookOpen,
      prompt: "Please provide a brief summary of your last response.",
    },
    {
      label: "Simplify",
      icon: Sparkles,
      prompt: "Can you explain this in simpler terms?",
    },
    {
      label: "Translate",
      icon: Languages,
      prompt: "Can you translate this to Spanish?",
    },
  ];

  return (
    <div className="flex gap-2 flex-wrap mt-3">
      {actions.map((action) => (
        <Button
          key={action.label}
          size="sm"
          variant="outline"
          className="text-xs h-7"
          onClick={() => onAction(action.prompt)}
        >
          <action.icon className="h-3 w-3 mr-1" />
          {action.label}
        </Button>
      ))}
    </div>
  );
}
