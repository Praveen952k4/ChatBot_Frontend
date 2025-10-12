import { useEffect, useState } from "react";
import {
  Command,
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { MessageSquarePlus, Search, Settings, LogOut } from "lucide-react";
import { useApp } from "@/contexts/AppContext";
import { useNavigate } from "react-router-dom";

export function CommandPalette() {
  const [open, setOpen] = useState(false);
  const { conversations, setCurrentConversation, createConversation } = useApp();
  const navigate = useNavigate();

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((open) => !open);
      }
    };

    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);

  const handleAction = (action: () => void) => {
    action();
    setOpen(false);
  };

  return (
    <CommandDialog open={open} onOpenChange={setOpen}>
      <CommandInput placeholder="Type a command or search..." />
      <CommandList>
        <CommandEmpty>No results found.</CommandEmpty>
        
        <CommandGroup heading="Actions">
          <CommandItem onSelect={() => handleAction(createConversation)}>
            <MessageSquarePlus className="mr-2 h-4 w-4" />
            <span>New Chat</span>
            <span className="ml-auto text-xs text-muted-foreground">Ctrl+N</span>
          </CommandItem>
        </CommandGroup>

        <CommandGroup heading="Conversations">
          {conversations.slice(0, 5).map((conv) => (
            <CommandItem
              key={conv.id}
              onSelect={() => handleAction(() => setCurrentConversation(conv))}
            >
              <Search className="mr-2 h-4 w-4" />
              <span>{conv.title}</span>
            </CommandItem>
          ))}
        </CommandGroup>

        <CommandGroup heading="Settings">
          <CommandItem onSelect={() => handleAction(() => navigate("/"))}>
            <Settings className="mr-2 h-4 w-4" />
            <span>Settings</span>
          </CommandItem>
          <CommandItem onSelect={() => handleAction(() => navigate("/login"))}>
            <LogOut className="mr-2 h-4 w-4" />
            <span>Sign Out</span>
          </CommandItem>
        </CommandGroup>
      </CommandList>
    </CommandDialog>
  );
}
