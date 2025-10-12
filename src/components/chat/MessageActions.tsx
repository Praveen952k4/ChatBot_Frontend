import { Copy, RotateCcw, Edit2, Pin, Volume2, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { toast } from "sonner";

interface MessageActionsProps {
  content: string;
  messageId: string;
  role: "user" | "assistant";
  onRegenerate?: () => void;
  onEdit?: () => void;
  onPin?: () => void;
  isPinned?: boolean;
}

export function MessageActions({
  content,
  role,
  onRegenerate,
  onEdit,
  onPin,
  isPinned,
}: MessageActionsProps) {
  const [copied, setCopied] = useState(false);
  const [speaking, setSpeaking] = useState(false);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(content);
    setCopied(true);
    toast.success("Copied to clipboard");
    setTimeout(() => setCopied(false), 2000);
  };

  const speakText = () => {
    if (speaking) {
      window.speechSynthesis.cancel();
      setSpeaking(false);
      return;
    }

    const utterance = new SpeechSynthesisUtterance(content);
    utterance.onend = () => setSpeaking(false);
    window.speechSynthesis.speak(utterance);
    setSpeaking(true);
  };

  return (
    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
      <Button
        size="icon"
        variant="ghost"
        className="h-7 w-7"
        onClick={copyToClipboard}
      >
        {copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
      </Button>

      {role === "assistant" && (
        <>
          <Button
            size="icon"
            variant="ghost"
            className="h-7 w-7"
            onClick={speakText}
          >
            <Volume2 className={`h-3.5 w-3.5 ${speaking ? "text-primary" : ""}`} />
          </Button>
          {onRegenerate && (
            <Button
              size="icon"
              variant="ghost"
              className="h-7 w-7"
              onClick={onRegenerate}
            >
              <RotateCcw className="h-3.5 w-3.5" />
            </Button>
          )}
        </>
      )}

      {role === "user" && onEdit && (
        <Button size="icon" variant="ghost" className="h-7 w-7" onClick={onEdit}>
          <Edit2 className="h-3.5 w-3.5" />
        </Button>
      )}

      {onPin && (
        <Button size="icon" variant="ghost" className="h-7 w-7" onClick={onPin}>
          <Pin className={`h-3.5 w-3.5 ${isPinned ? "text-primary fill-primary" : ""}`} />
        </Button>
      )}
    </div>
  );
}
