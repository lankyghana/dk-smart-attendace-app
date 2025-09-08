import * as React from "react";
import { Eye, EyeOff, Check, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export interface PasswordInputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  showStrengthIndicator?: boolean;
}

const PasswordInput = React.forwardRef<HTMLInputElement, PasswordInputProps>(
  ({ className, showStrengthIndicator = false, ...props }, ref) => {
    const [showPassword, setShowPassword] = React.useState(false);
    const [password, setPassword] = React.useState("");

    const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value;
      setPassword(value);
      props.onChange?.(e);
    };

    const togglePasswordVisibility = () => {
      setShowPassword(!showPassword);
    };

    // Password strength validation
    const getPasswordStrength = (password: string) => {
      const checks = {
        length: password.length >= 8,
        uppercase: /[A-Z]/.test(password),
        lowercase: /[a-z]/.test(password),
        number: /\d/.test(password),
        special: /[!@#$%^&*(),.?":{}|<>]/.test(password),
      };

      const score = Object.values(checks).filter(Boolean).length;
      const strength = score < 2 ? "weak" : score < 4 ? "medium" : "strong";

      return { checks, score, strength };
    };

    const { checks, strength } = getPasswordStrength(password);

    const strengthColors = {
      weak: "bg-red-500",
      medium: "bg-yellow-500",
      strong: "bg-green-500",
    };

    const strengthWidth = {
      weak: "w-1/3",
      medium: "w-2/3",
      strong: "w-full",
    };

    return (
      <div className="space-y-2">
        <div className="relative">
          <Input
            type={showPassword ? "text" : "password"}
            className={cn("pr-10", className)}
            ref={ref}
            value={password}
            onChange={handlePasswordChange}
            {...props}
          />
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
            onClick={togglePasswordVisibility}
            disabled={props.disabled}
          >
            {showPassword ? (
              <EyeOff className="h-4 w-4 text-muted-foreground" />
            ) : (
              <Eye className="h-4 w-4 text-muted-foreground" />
            )}
            <span className="sr-only">
              {showPassword ? "Hide password" : "Show password"}
            </span>
          </Button>
        </div>

        {showStrengthIndicator && password.length > 0 && (
          <div className="space-y-2">
            {/* Strength bar */}
            <div className="flex space-x-1">
              <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
                <div
                  className={cn(
                    "h-full transition-all duration-300",
                    strengthColors[strength],
                    strengthWidth[strength]
                  )}
                />
              </div>
            </div>

            {/* Strength label */}
            <div className="flex items-center justify-between">
              <span className="text-xs text-muted-foreground">
                Password strength:{" "}
                <span
                  className={cn(
                    "font-medium capitalize",
                    strength === "weak" && "text-red-600",
                    strength === "medium" && "text-yellow-600",
                    strength === "strong" && "text-green-600"
                  )}
                >
                  {strength}
                </span>
              </span>
            </div>

            {/* Requirements checklist */}
            <div className="space-y-1">
              <div className="grid grid-cols-1 gap-1 text-xs">
                <div className="flex items-center space-x-2">
                  {checks.length ? (
                    <Check className="h-3 w-3 text-green-600" />
                  ) : (
                    <X className="h-3 w-3 text-red-500" />
                  )}
                  <span
                    className={cn(
                      checks.length ? "text-green-600" : "text-muted-foreground"
                    )}
                  >
                    At least 8 characters
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  {checks.uppercase ? (
                    <Check className="h-3 w-3 text-green-600" />
                  ) : (
                    <X className="h-3 w-3 text-red-500" />
                  )}
                  <span
                    className={cn(
                      checks.uppercase ? "text-green-600" : "text-muted-foreground"
                    )}
                  >
                    One uppercase letter
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  {checks.lowercase ? (
                    <Check className="h-3 w-3 text-green-600" />
                  ) : (
                    <X className="h-3 w-3 text-red-500" />
                  )}
                  <span
                    className={cn(
                      checks.lowercase ? "text-green-600" : "text-muted-foreground"
                    )}
                  >
                    One lowercase letter
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  {checks.number ? (
                    <Check className="h-3 w-3 text-green-600" />
                  ) : (
                    <X className="h-3 w-3 text-red-500" />
                  )}
                  <span
                    className={cn(
                      checks.number ? "text-green-600" : "text-muted-foreground"
                    )}
                  >
                    One number
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  {checks.special ? (
                    <Check className="h-3 w-3 text-green-600" />
                  ) : (
                    <X className="h-3 w-3 text-red-500" />
                  )}
                  <span
                    className={cn(
                      checks.special ? "text-green-600" : "text-muted-foreground"
                    )}
                  >
                    One special character
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }
);

PasswordInput.displayName = "PasswordInput";

export { PasswordInput };
