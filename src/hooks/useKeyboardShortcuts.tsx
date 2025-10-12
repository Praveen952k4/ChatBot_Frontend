import { useEffect } from "react";
import { useApp } from "@/contexts/AppContext";

export function useKeyboardShortcuts() {
  const { createConversation } = useApp();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ctrl/Cmd + N - New Chat
      if ((e.ctrlKey || e.metaKey) && e.key === "n") {
        e.preventDefault();
        createConversation();
      }

      // Escape - Stop speech synthesis
      if (e.key === "Escape") {
        if (window.speechSynthesis.speaking) {
          window.speechSynthesis.cancel();
        }
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [createConversation]);
}
