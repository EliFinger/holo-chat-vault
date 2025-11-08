import { Lock } from "lucide-react";

export const Logo = () => {
  return (
    <div className="flex items-center gap-3">
      <div className="relative">
        {/* Interlocked message bubbles */}
        <div className="relative w-12 h-12">
          {/* First bubble */}
          <div className="absolute top-0 left-0 w-8 h-8 bg-primary/20 rounded-full border-2 border-primary animate-pulse-glow" />
          {/* Second bubble */}
          <div className="absolute bottom-0 right-0 w-8 h-8 bg-primary/20 rounded-full border-2 border-primary animate-pulse-glow" />
          {/* Encryption ring/lock in center */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-6 h-6 bg-background rounded-full flex items-center justify-center shadow-glow">
            <Lock className="w-3 h-3 text-primary" />
          </div>
        </div>
      </div>
      <span className="text-xl font-bold bg-gradient-to-r from-primary to-encryption-locked bg-clip-text text-transparent">
        WhisperLink
      </span>
    </div>
  );
};
