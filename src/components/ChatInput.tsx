import { useState } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Send, Shield } from "lucide-react";

interface ChatInputProps {
  onSendMessage: (message: string) => void;
  disabled?: boolean;
}

export const ChatInput = ({ onSendMessage, disabled }: ChatInputProps) => {
  const [message, setMessage] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim()) {
      onSendMessage(message);
      setMessage("");
    }
  };

  return (
    <div className="border-t border-border bg-card/50 backdrop-blur-lg p-4">
      <form onSubmit={handleSubmit} className="container mx-auto flex gap-2">
        <div className="flex-1 relative">
          <Input
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Type your encrypted message..."
            disabled={disabled}
            className="pr-10 bg-secondary border-border focus:border-primary focus:ring-primary"
          />
          <Shield className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-encryption-locked opacity-50" />
        </div>
        <Button 
          type="submit" 
          disabled={disabled || !message.trim()}
          className="bg-primary hover:bg-primary/90 text-primary-foreground shadow-glow"
        >
          <Send className="w-4 h-4" />
        </Button>
      </form>
    </div>
  );
};
