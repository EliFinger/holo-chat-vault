import { Logo } from "./Logo";
import { Button } from "./ui/button";
import { Wallet } from "lucide-react";

interface ChatHeaderProps {
  isConnected: boolean;
  onConnect: () => void;
  address?: string;
}

export const ChatHeader = ({ isConnected, onConnect, address }: ChatHeaderProps) => {
  return (
    <header className="border-b border-border bg-card/50 backdrop-blur-lg sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <Logo />
          
          <div className="text-center flex-1 mx-8">
            <h1 className="text-2xl font-bold text-foreground">
              Conversations, Truly Private.
            </h1>
          </div>

          {!isConnected ? (
            <Button onClick={onConnect} className="bg-primary hover:bg-primary/90 text-primary-foreground shadow-glow">
              <Wallet className="w-4 h-4 mr-2" />
              Connect Wallet
            </Button>
          ) : (
            <div className="flex items-center gap-2 px-4 py-2 bg-secondary rounded-full">
              <div className="w-2 h-2 bg-encryption-locked rounded-full animate-pulse" />
              <span className="text-sm font-mono text-muted-foreground">
                {address?.slice(0, 6)}...{address?.slice(-4)}
              </span>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
