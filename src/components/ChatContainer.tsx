import { useEffect, useRef } from "react";
import { MessageBubble } from "./MessageBubble";

interface Message {
  id: string;
  text: string;
  isOwn: boolean;
  isEncrypted: boolean;
  timestamp: string;
}

interface ChatContainerProps {
  messages: Message[];
}

export const ChatContainer = ({ messages }: ChatContainerProps) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  return (
    <div className="flex-1 overflow-y-auto">
      <div className="container mx-auto px-4 py-6">
        {messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center py-20">
            <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mb-4 animate-float">
              <div className="w-12 h-12 rounded-full bg-primary/20 border-2 border-primary shadow-glow" />
            </div>
            <h2 className="text-2xl font-bold text-foreground mb-2">
              Start a Secure Conversation
            </h2>
            <p className="text-muted-foreground max-w-md">
              All messages are encrypted on-chain. Only you and your recipient can read them.
            </p>
          </div>
        ) : (
          <>
            {messages.map((message) => (
              <MessageBubble
                key={message.id}
                message={message.text}
                isOwn={message.isOwn}
                isEncrypted={message.isEncrypted}
                timestamp={message.timestamp}
              />
            ))}
            <div ref={messagesEndRef} />
          </>
        )}
      </div>
    </div>
  );
};
