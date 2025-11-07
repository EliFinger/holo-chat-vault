"use client";

import { useState, useEffect, useCallback } from "react";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { useAccount, useSignMessage } from "wagmi";
import { Logo } from "@/components/Logo";
import { useWhisperVault } from "@/hooks/useWhisperVault";
import {
  Lock,
  Unlock,
  Send,
  RefreshCw,
  Shield,
  MessageSquare,
  Sparkles,
  Eye,
  EyeOff,
  KeyRound,
  LogIn,
  LogOut,
} from "lucide-react";

export default function WhisperChat() {
  const { isConnected, address, chainId } = useAccount();
  const {
    messages,
    loading,
    error,
    loadMessages,
    sendMessage,
    decryptAllMessages,
  } = useWhisperVault();
  
  // Track previous chainId for network switch detection
  const [prevChainId, setPrevChainId] = useState<number | undefined>(undefined);

  const [messageInput, setMessageInput] = useState("");
  const [password, setPassword] = useState("");
  const [sendError, setSendError] = useState<string | null>(null);
  const [encryptionEnabled, setEncryptionEnabled] = useState(true);
  
  // Authentication state
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [authPassword, setAuthPassword] = useState("");
  const [showAuthPassword, setShowAuthPassword] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);
  const [isAuthenticating, setIsAuthenticating] = useState(false);
  const [isSending, setIsSending] = useState(false);
  
  const { signMessageAsync } = useSignMessage();
  
  // Password strength calculation
  const getPasswordStrength = (pwd: string): { level: number; label: string; color: string } => {
    if (!pwd) return { level: 0, label: "", color: "" };
    let score = 0;
    if (pwd.length >= 6) score++;
    if (pwd.length >= 10) score++;
    if (/[A-Z]/.test(pwd)) score++;
    if (/[0-9]/.test(pwd)) score++;
    if (/[^A-Za-z0-9]/.test(pwd)) score++;
    
    if (score <= 2) return { level: 1, label: "Weak", color: "hsl(0,84%,60%)" };
    if (score <= 3) return { level: 2, label: "Medium", color: "hsl(45,93%,47%)" };
    return { level: 3, label: "Strong", color: "hsl(142,71%,45%)" };
  };
  
  const passwordStrength = getPasswordStrength(authPassword);

  // Handle lock vault (logout)
  const handleLockVault = useCallback(() => {
    setIsAuthenticated(false);
    setPassword("");
    setAuthPassword("");
    setAuthError(null);
    setSendError(null);
  }, []);

  // Reset authentication when wallet disconnects
  useEffect(() => {
    if (!isConnected) {
      setIsAuthenticated(false);
      setAuthPassword("");
      setPassword("");
    }
  }, [isConnected]);

  // Handle network switching - reload messages when chain changes
  useEffect(() => {
    if (chainId && prevChainId && chainId !== prevChainId && isAuthenticated) {
      // Network changed while authenticated, reload messages for new network
      setSendError(null);
      loadMessages();
    }
    setPrevChainId(chainId);
  }, [chainId, prevChainId, isAuthenticated, loadMessages]);

  // Load messages when authenticated
  useEffect(() => {
    if (isConnected && address && isAuthenticated) {
      loadMessages();
    }
  }, [isConnected, address, isAuthenticated, loadMessages]);

  // Handle authentication with wallet signature
  const handleAuthenticate = useCallback(async () => {
    if (!authPassword.trim()) {
      setAuthError("Please enter a password");
      return;
    }

    if (authPassword.length < 6) {
      setAuthError("Password must be at least 6 characters");
      return;
    }

    try {
      setIsAuthenticating(true);
      setAuthError(null);

      // Create a message to sign that includes a hash of the password
      const timestamp = Date.now();
      const message = `WhisperVault Authentication\n\nI am signing in to WhisperVault with my encryption key.\n\nTimestamp: ${timestamp}\nAddress: ${address}`;

      // Request wallet signature
      await signMessageAsync({ message });

      // If signature succeeds, user is authenticated
      setPassword(authPassword);
      setIsAuthenticated(true);
    } catch (err) {
      console.error("Authentication failed:", err);
      setAuthError(err instanceof Error ? err.message : "Signature rejected");
    } finally {
      setIsAuthenticating(false);
    }
  }, [authPassword, address, signMessageAsync]);

  const MAX_MESSAGE_LENGTH = 500;
  
  const handleSend = async () => {
    // Prevent double submission
    if (isSending) return;
    
    if (!messageInput.trim() || !password.trim()) {
      setSendError("Please enter both message and password");
      return;
    }
    
    if (messageInput.length > MAX_MESSAGE_LENGTH) {
      setSendError(`Message too long. Maximum ${MAX_MESSAGE_LENGTH} characters allowed.`);
      return;
    }

    try {
      setIsSending(true);
      setSendError(null);
      await sendMessage(messageInput, password);
      setMessageInput("");
    } catch (err) {
      setSendError(err instanceof Error ? err.message : "Failed to send");
    } finally {
      setIsSending(false);
    }
  };

  const handleDecryptAll = async () => {
    if (!password.trim()) {
      setSendError("Please enter password to decrypt");
      return;
    }

    try {
      setSendError(null);
      await decryptAllMessages(password);
    } catch (err) {
      setSendError(err instanceof Error ? err.message : "Failed to decrypt");
    }
  };

  const formatTime = (timestamp: number) => {
    const date = new Date(timestamp * 1000);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / (1000 * 60));
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    
    // Show relative time for recent messages
    if (diffMins < 1) return "Just now";
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    
    // Show full date for older messages
    return date.toLocaleDateString([], {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const truncateHex = (hex: string) => {
    if (hex.length <= 24) return hex;
    return hex.slice(0, 12) + "..." + hex.slice(-10);
  };

  return (
    <div className="flex flex-col h-screen w-full bg-[hsl(230,35%,7%)] overflow-hidden">
      {/* Header */}
      <header className="border-b border-[hsl(230,25%,20%)] bg-[hsl(230,30%,10%)]/50 backdrop-blur-lg sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Logo />

            <div className="text-center flex-1 mx-8 hidden md:block">
              <h1 className="text-2xl font-bold text-[hsl(210,40%,98%)]">
                Conversations, Truly Private.
              </h1>
            </div>

            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <Shield
                  className={`w-4 h-4 ${encryptionEnabled ? "text-[hsl(142,71%,45%)]" : "text-[hsl(215,20%,65%)]"}`}
                />
                <button
                  onClick={() => setEncryptionEnabled(!encryptionEnabled)}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    encryptionEnabled
                      ? "bg-[hsl(189,97%,55%)]"
                      : "bg-[hsl(230,20%,20%)]"
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      encryptionEnabled ? "translate-x-6" : "translate-x-1"
                    }`}
                  />
                </button>
              </div>
              <ConnectButton
                accountStatus={{
                  smallScreen: "avatar",
                  largeScreen: "full",
                }}
                chainStatus={isConnected ? "icon" : "none"}
                showBalance={false}
              />
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 overflow-hidden">
        {!isConnected ? (
          /* Welcome Screen - Not Connected */
          <div className="h-full flex items-center justify-center p-4">
            <div className="max-w-md w-full">
              <div className="bg-[hsl(230,30%,10%)]/80 backdrop-blur-xl rounded-2xl border border-[hsl(230,25%,20%)] p-8 shadow-2xl">
                <div className="text-center space-y-6">
                  {/* Animated Icon */}
                  <div className="relative mx-auto w-24 h-24">
                    <div className="absolute inset-0 bg-[hsl(189,97%,55%)]/20 rounded-full animate-ping" />
                    <div className="absolute inset-2 bg-[hsl(189,97%,55%)]/30 rounded-full animate-pulse" />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-16 h-16 bg-gradient-to-br from-[hsl(189,97%,55%)] to-[hsl(189,97%,55%)] rounded-full flex items-center justify-center shadow-lg shadow-[hsl(189,97%,55%)]/50">
                        <MessageSquare className="w-8 h-8 text-[hsl(230,35%,7%)]" />
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <h2 className="text-2xl font-bold text-[hsl(210,40%,98%)]">
                      Welcome to WhisperLink
                    </h2>
                    <p className="text-[hsl(215,20%,65%)]">
                      Your messages are encrypted client-side and stored
                      securely on-chain. Only you can decrypt them.
                    </p>
                  </div>

                  <div className="flex flex-col gap-3">
                    <div className="flex items-center gap-3 text-sm text-[hsl(215,20%,65%)]">
                      <Lock className="w-4 h-4 text-[hsl(189,97%,55%)]" />
                      <span>End-to-end encryption</span>
                    </div>
                    <div className="flex items-center gap-3 text-sm text-[hsl(215,20%,65%)]">
                      <Shield className="w-4 h-4 text-[hsl(142,71%,45%)]" />
                      <span>On-chain message storage</span>
                    </div>
                    <div className="flex items-center gap-3 text-sm text-[hsl(215,20%,65%)]">
                      <Sparkles className="w-4 h-4 text-[hsl(189,97%,55%)]" />
                      <span>Auto-response system</span>
                    </div>
                  </div>

                  <div className="pt-4">
                    <ConnectButton />
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : !isAuthenticated ? (
          /* Authentication Screen - Connected but not authenticated */
          <div className="h-full flex items-center justify-center p-4">
            <div className="max-w-md w-full">
              <div className="bg-[hsl(230,30%,10%)]/80 backdrop-blur-xl rounded-2xl border border-[hsl(230,25%,20%)] p-8 shadow-2xl">
                <div className="text-center space-y-6">
                  {/* Animated Icon */}
                  <div className="relative mx-auto w-24 h-24">
                    <div className="absolute inset-0 bg-[hsl(142,71%,45%)]/20 rounded-full animate-pulse" />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-16 h-16 bg-gradient-to-br from-[hsl(142,71%,45%)] to-[hsl(189,97%,55%)] rounded-full flex items-center justify-center shadow-lg shadow-[hsl(142,71%,45%)]/50">
                        <KeyRound className="w-8 h-8 text-[hsl(230,35%,7%)]" />
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <h2 className="text-2xl font-bold text-[hsl(210,40%,98%)]">
                      Unlock Your Vault
                    </h2>
                    <p className="text-[hsl(215,20%,65%)]">
                      Enter your encryption password and sign with your wallet to access your messages.
                    </p>
                  </div>

                  {/* Connected Address */}
                  <div className="flex items-center justify-center gap-2 text-sm text-[hsl(215,20%,65%)]">
                    <div className="w-2 h-2 bg-[hsl(142,71%,45%)] rounded-full" />
                    <span>Connected: {address?.slice(0, 6)}...{address?.slice(-4)}</span>
                  </div>

                  {/* Error Display */}
                  {authError && (
                    <div className="p-3 bg-[hsl(0,84%,60%)]/10 border border-[hsl(0,84%,60%)]/30 rounded-lg text-[hsl(0,84%,60%)] text-sm">
                      {authError}
                    </div>
                  )}

                  {/* Password Input */}
                  <div className="space-y-4">
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[hsl(215,20%,65%)] pointer-events-none" />
                      <input
                        type={showAuthPassword ? "text" : "password"}
                        placeholder="Enter encryption password..."
                        className="w-full pl-12 pr-12 py-4 bg-[hsl(230,25%,15%)] border border-[hsl(230,25%,20%)] rounded-xl text-[hsl(210,40%,98%)] placeholder:text-[hsl(215,20%,65%)] focus:outline-none focus:ring-2 focus:ring-[hsl(189,97%,55%)]/50 focus:border-[hsl(189,97%,55%)] transition-all text-center"
                        value={authPassword}
                        onChange={(e) => setAuthPassword(e.target.value)}
                        onKeyDown={(e) => e.key === "Enter" && handleAuthenticate()}
                        autoComplete="off"
                        disabled={isAuthenticating}
                      />
                      <button
                        type="button"
                        onClick={() => setShowAuthPassword(!showAuthPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-[hsl(215,20%,65%)] hover:text-[hsl(210,40%,98%)] transition-colors"
                      >
                        {showAuthPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                      </button>
                    </div>

                    {/* Password Strength Indicator */}
                    {authPassword && (
                      <div className="space-y-1">
                        <div className="flex gap-1">
                          {[1, 2, 3].map((level) => (
                            <div
                              key={level}
                              className="h-1 flex-1 rounded-full transition-colors"
                              style={{
                                backgroundColor: passwordStrength.level >= level ? passwordStrength.color : "hsl(230,25%,20%)"
                              }}
                            />
                          ))}
                        </div>
                        <p className="text-xs text-right" style={{ color: passwordStrength.color }}>
                          {passwordStrength.label}
                        </p>
                      </div>
                    )}

                    <button
                      onClick={handleAuthenticate}
                      disabled={isAuthenticating || !authPassword.trim() || authPassword.length < 6}
                      className="w-full py-4 bg-gradient-to-r from-[hsl(189,97%,55%)] to-[hsl(142,71%,45%)] hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed rounded-xl text-[hsl(230,35%,7%)] font-bold transition-all shadow-lg shadow-[hsl(189,97%,55%)]/25 flex items-center justify-center gap-2"
                    >
                      {isAuthenticating ? (
                        <>
                          <div className="w-5 h-5 border-2 border-[hsl(230,35%,7%)]/30 border-t-[hsl(230,35%,7%)] rounded-full animate-spin" />
                          <span>Waiting for signature...</span>
                        </>
                      ) : (
                        <>
                          <LogIn className="w-5 h-5" />
                          <span>Sign In with Wallet</span>
                        </>
                      )}
                    </button>
                  </div>

                  <p className="text-xs text-[hsl(215,20%,65%)]/60">
                    Your password is used for client-side encryption only. It never leaves your browser.
                  </p>
                </div>
              </div>
            </div>
          </div>
        ) : (
          /* Chat Interface - Connected and Authenticated */
          <div className="h-full flex flex-col max-w-4xl mx-auto">
            {/* Error Display */}
            {(error || sendError) && (
              <div className="mx-4 mt-4 p-4 bg-[hsl(0,84%,60%)]/10 border border-[hsl(0,84%,60%)]/30 rounded-lg text-[hsl(0,84%,60%)] text-sm">
                {error || sendError}
              </div>
            )}

            {/* Password Status Bar */}
            <div className="p-4 border-b border-[hsl(230,25%,20%)] bg-[hsl(230,30%,10%)]/30">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-sm text-[hsl(142,71%,45%)]">
                  <Unlock className="w-4 h-4" />
                  <span>Vault unlocked</span>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={handleDecryptAll}
                    disabled={loading || messages.length === 0}
                    className="px-4 py-2 bg-[hsl(230,25%,15%)] hover:bg-[hsl(230,25%,20%)] disabled:opacity-50 disabled:cursor-not-allowed rounded-lg text-[hsl(210,40%,98%)] text-sm font-medium transition-all flex items-center gap-2"
                  >
                    <Unlock className="w-4 h-4" />
                    <span>Decrypt All</span>
                  </button>
                  <button
                    onClick={handleLockVault}
                    className="px-4 py-2 bg-[hsl(0,84%,60%)]/10 hover:bg-[hsl(0,84%,60%)]/20 border border-[hsl(0,84%,60%)]/30 rounded-lg text-[hsl(0,84%,60%)] text-sm font-medium transition-all flex items-center gap-2"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>Lock</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.length === 0 ? (
                <div className="h-full flex items-center justify-center">
                  <div className="text-center space-y-4">
                    <div className="w-16 h-16 mx-auto bg-[hsl(230,20%,20%)] rounded-full flex items-center justify-center">
                      <MessageSquare className="w-8 h-8 text-[hsl(215,20%,65%)]" />
                    </div>
                    <div>
                      <p className="text-[hsl(215,20%,65%)]">No messages yet</p>
                      <p className="text-sm text-[hsl(215,20%,65%)]/60">
                        Send your first encrypted message below
                      </p>
                    </div>
                  </div>
                </div>
              ) : (
                <>
                  {/* Refresh Button */}
                  <div className="flex justify-center">
                    <button
                      onClick={loadMessages}
                      disabled={loading}
                      className="px-3 py-1 text-xs text-[hsl(215,20%,65%)] hover:text-[hsl(210,40%,98%)] transition-colors flex items-center gap-1"
                    >
                      <RefreshCw
                        className={`w-3 h-3 ${loading ? "animate-spin" : ""}`}
                      />
                      Refresh
                    </button>
                  </div>

                  {/* Message List */}
                  {messages.map((msg) => (
                    <div
                      key={msg.id}
                      className={`flex ${msg.isResponse ? "justify-start" : "justify-end"}`}
                    >
                      <div
                        className={`max-w-[80%] rounded-2xl px-4 py-3 ${
                          msg.isResponse
                            ? "bg-[hsl(230,25%,15%)] text-[hsl(210,40%,98%)] rounded-tl-sm"
                            : "bg-[hsl(189,97%,55%)] text-[hsl(230,35%,7%)] rounded-tr-sm"
                        } ${!msg.decryptedText ? "border border-[hsl(230,25%,20%)]/50" : ""}`}
                      >
                        {/* Message Content */}
                        <div className="space-y-1">
                          {msg.decryptedText ? (
                            <p className="text-sm">{msg.decryptedText}</p>
                          ) : (
                            <div className="flex items-center gap-2">
                              <Lock className="w-3 h-3 opacity-60" />
                              <p className="font-mono text-xs opacity-70 break-all">
                                {truncateHex(msg.encryptedContent)}
                              </p>
                            </div>
                          )}

                          {/* Message Footer */}
                          <div
                            className={`flex items-center gap-2 text-xs ${
                              msg.isResponse
                                ? "text-[hsl(210,40%,98%)]/60"
                                : "text-[hsl(230,35%,7%)]/60"
                            }`}
                          >
                            <span>{msg.isResponse ? "System" : "You"}</span>
                            <span>·</span>
                            <span>{formatTime(msg.timestamp)}</span>
                            {msg.decryptedText && (
                              <>
                                <span>·</span>
                                <span className="text-[hsl(142,71%,45%)] flex items-center gap-1">
                                  <Unlock className="w-3 h-3" />
                                  Decrypted
                                </span>
                              </>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </>
              )}
            </div>

            {/* Input Area */}
            <div className="p-4 border-t border-[hsl(230,25%,20%)] bg-[hsl(230,30%,10%)]/30">
              <div className="flex items-center gap-3">
                <div className="flex-1 relative">
                  <input
                    type="text"
                    placeholder="Type your message..."
                    className="w-full px-4 py-3 bg-[hsl(230,25%,15%)] border border-[hsl(230,25%,20%)] rounded-xl text-[hsl(210,40%,98%)] placeholder:text-[hsl(215,20%,65%)] focus:outline-none focus:ring-2 focus:ring-[hsl(189,97%,55%)]/50 focus:border-[hsl(189,97%,55%)] transition-all disabled:opacity-50"
                    value={messageInput}
                    onChange={(e) => setMessageInput(e.target.value)}
                    onKeyDown={(e) =>
                      e.key === "Enter" && !e.shiftKey && handleSend()
                    }
                    disabled={loading}
                  />
                </div>
                <button
                  onClick={handleSend}
                  disabled={loading || isSending || !messageInput.trim()}
                  className="p-3 bg-[hsl(189,97%,55%)] hover:bg-[hsl(189,97%,55%)]/90 disabled:opacity-50 disabled:cursor-not-allowed rounded-xl text-[hsl(230,35%,7%)] transition-all shadow-lg shadow-[hsl(189,97%,55%)]/25 hover:shadow-[hsl(189,97%,55%)]/40"
                >
                  {(loading || isSending) ? (
                    <div className="w-5 h-5 border-2 border-[hsl(230,35%,7%)]/30 border-t-[hsl(230,35%,7%)] rounded-full animate-spin" />
                  ) : (
                    <Send className="w-5 h-5" />
                  )}
                </button>
              </div>

              {/* Status Bar */}
              <div className="mt-3 flex items-center justify-between text-xs text-[hsl(215,20%,65%)]">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-[hsl(142,71%,45%)] rounded-full animate-pulse" />
                  <span>
                    Connected: {address?.slice(0, 6)}...{address?.slice(-4)}
                  </span>
                </div>
                <div className="flex items-center gap-4">
                  <span className={messageInput.length > MAX_MESSAGE_LENGTH ? "text-[hsl(0,84%,60%)]" : ""}>
                    {messageInput.length}/{MAX_MESSAGE_LENGTH}
                  </span>
                  <div className="flex items-center gap-1">
                    <Shield className="w-3 h-3" />
                    <span>End-to-end encrypted</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
