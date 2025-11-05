"use client";

import { Lock, MessageSquare } from "lucide-react";

export const Logo = () => {
  return (
    <div className="flex items-center gap-3">
      <div className="relative w-12 h-12">
        {/* Glow effect */}
        <div className="absolute inset-0 bg-gradient-to-br from-cyan-400 to-purple-500 rounded-xl opacity-20 blur-lg animate-pulse" />
        
        {/* Main container */}
        <div className="relative w-full h-full bg-gradient-to-br from-slate-800 to-slate-900 rounded-xl border border-cyan-500/30 flex items-center justify-center glow-cyan">
          <MessageSquare className="w-6 h-6 text-cyan-400" />
          
          {/* Lock badge */}
          <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-slate-900 rounded-full flex items-center justify-center border border-cyan-500/50">
            <Lock className="w-3 h-3 text-cyan-400" />
          </div>
        </div>
      </div>
      
      <div>
        <span className="text-xl font-bold bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 bg-clip-text text-transparent">
          WhisperLink
        </span>
        <p className="text-xs text-slate-400">Encrypted Messaging</p>
      </div>
    </div>
  );
};
