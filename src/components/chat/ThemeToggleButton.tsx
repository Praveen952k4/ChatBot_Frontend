import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";

/**
 * A button component that allows the user to toggle between
 * light and dark color themes for the application.
 */
export function ThemeToggleButton() {
  // The useTheme hook comes from the 'next-themes' library.
  // It provides the current theme and a function to update it.
  const { theme, setTheme } = useTheme();

  return (
    <Button
      variant="ghost"
      size="icon"
      // On click, it checks the current theme and sets it to the opposite value.
      onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
      aria-label="Toggle theme"
    >
      {/* The Sun icon is visible in light mode */}
      <Sun className="h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
      
      {/* The Moon icon is visible in dark mode, controlled by Tailwind's 'dark:' variant */}
      <Moon className="absolute h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
      
      {/* For screen readers */}
      <span className="sr-only">Toggle theme</span>
    </Button>
  );
}