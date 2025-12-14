"use client";

import { Lock, MessageSquare } from "lucide-react";

export const Logo = () => {
  return (
    <div className="flex items-center gap-3">
      <div className="relative w-12 h-12">
        {/* Glow effect */}
        <div className="absolute inset-0 bg-gradient-to-br from-sky-300 to-blue-400 rounded-xl opacity-30 blur-lg animate-pulse" />
        
        {/* Main container */}
        <div className="relative w-full h-full bg-gradient-to-br from-blue-50 to-sky-50 rounded-xl border border-sky-300/40 flex items-center justify-center glow-cyan shadow-sm">
          <MessageSquare className="w-6 h-6 text-sky-500" />
          
          {/* Lock badge */}
          <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-white rounded-full flex items-center justify-center border border-sky-400/50 shadow-sm">
            <Lock className="w-3 h-3 text-sky-500" />
          </div>
        </div>
      </div>
      
      <div>
        <span className="text-xl font-bold bg-gradient-to-r from-sky-500 via-blue-500 to-sky-400 bg-clip-text text-transparent">
          WhisperLink
        </span>
        <p className="text-xs text-slate-500">Encrypted Messaging</p>
      </div>
    </div>
  );
};
