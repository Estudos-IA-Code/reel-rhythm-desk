import { Check, X } from "lucide-react";

interface PasswordStrengthHintProps {
  password: string;
}

const rules = [
  { label: "Mínimo 6 caracteres", test: (p: string) => p.length >= 6 },
  { label: "Uma letra maiúscula", test: (p: string) => /[A-Z]/.test(p) },
  { label: "Um número", test: (p: string) => /\d/.test(p) },
];

const PasswordStrengthHint = ({ password }: PasswordStrengthHintProps) => {
  if (!password) return null;

  return (
    <ul className="space-y-1 text-xs mt-1.5">
      {rules.map((rule) => {
        const pass = rule.test(password);
        return (
          <li key={rule.label} className="flex items-center gap-1.5">
            {pass ? (
              <Check className="h-3 w-3 text-green-400" />
            ) : (
              <X className="h-3 w-3 text-muted-foreground" />
            )}
            <span className={pass ? "text-green-400" : "text-muted-foreground"}>
              {rule.label}
            </span>
          </li>
        );
      })}
    </ul>
  );
};

export default PasswordStrengthHint;
