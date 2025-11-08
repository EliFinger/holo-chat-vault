import { Lock, LockOpen } from "lucide-react";
import { cn } from "@/lib/utils";

interface MessageBubbleProps {
  message: string;
  isOwn: boolean;
  isEncrypted: boolean;
  timestamp: string;
}

export const MessageBubble = ({ message, isOwn, isEncrypted, timestamp }: MessageBubbleProps) => {
  return (
    <div className={cn(
      "flex items-end gap-2 mb-4",
      isOwn ? "flex-row-reverse" : "flex-row"
    )}>
      <div className={cn(
        "max-w-[70%] rounded-2xl px-4 py-3 relative group transition-all",
        isOwn 
          ? "bg-primary text-primary-foreground rounded-br-sm" 
          : "bg-secondary text-secondary-foreground rounded-bl-sm",
        isEncrypted && "shadow-glow"
      )}>
        <div className="flex items-start gap-2">
          <p className="text-sm break-words">{message}</p>
          {isEncrypted && (
            <div className="flex-shrink-0">
              {isOwn ? (
                <LockOpen className="w-4 h-4 text-encryption-unlocked animate-pulse" />
              ) : (
                <Lock className="w-4 h-4 text-encryption-locked animate-pulse" />
              )}
            </div>
          )}
        </div>
        <span className="text-xs opacity-60 mt-1 block">{timestamp}</span>
        
        {/* Glow effect on hover */}
        {isEncrypted && (
          <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
            <div className="absolute inset-0 rounded-2xl shadow-glow" />
          </div>
        )}
      </div>
    </div>
  );
};
