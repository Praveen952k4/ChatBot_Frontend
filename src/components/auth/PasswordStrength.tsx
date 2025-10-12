import { useMemo } from "react";
import { CheckCircle2, XCircle } from "lucide-react";
import { cn } from "@/lib/utils";

// Define the validation criteria
const requirements = [
  { id: 1, text: "At least 8 characters", regex: /.{8,}/ },
  { id: 2, text: "One uppercase letter", regex: /[A-Z]/ },
  { id: 3, text: "One lowercase letter", regex: /[a-z]/ },
  { id: 4, text: "One number", regex: /[0-9]/ },
];

interface PasswordStrengthProps {
  password?: string;
}

export function PasswordStrength({ password = "" }: PasswordStrengthProps) {
  // Memoize the validation results to avoid re-calculating on every render
  const validation = useMemo(() => {
    return requirements.map((req) => ({
      ...req,
      isValid: req.regex.test(password),
    }));
  }, [password]);

  return (
    <ul className="space-y-2 mt-2">
      {validation.map(({ id, text, isValid }) => (
        <li
          key={id}
          className={cn(
            "flex items-center text-sm",
            isValid ? "text-green-500" : "text-muted-foreground"
          )}
        >
          {isValid ? (
            <CheckCircle2 className="h-4 w-4 mr-2" />
          ) : (
            <XCircle className="h-4 w-4 mr-2" />
          )}
          {text}
        </li>
      ))}
    </ul>
  );
}
