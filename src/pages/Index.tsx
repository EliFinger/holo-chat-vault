import { useState } from "react";
import { ChatHeader } from "@/components/ChatHeader";
import { ChatContainer } from "@/components/ChatContainer";
import { ChatInput } from "@/components/ChatInput";
import { useToast } from "@/hooks/use-toast";

interface Message {
  id: string;
  text: string;
  isOwn: boolean;
  isEncrypted: boolean;
  timestamp: string;
}

const Index = () => {
  const [isConnected, setIsConnected] = useState(false);
  const [address, setAddress] = useState<string>();
  const [messages, setMessages] = useState<Message[]>([]);
  const { toast } = useToast();

  const handleConnect = async () => {
    // Mock wallet connection - in production, integrate with Rainbow Wallet
    try {
      // Simulate wallet connection
      const mockAddress = "0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb0";
      setAddress(mockAddress);
      setIsConnected(true);
      
      toast({
        title: "Wallet Connected",
        description: "Your wallet has been successfully connected.",
      });
    } catch (error) {
      toast({
        title: "Connection Failed",
        description: "Failed to connect wallet. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleSendMessage = (text: string) => {
    const newMessage: Message = {
      id: Date.now().toString(),
      text,
      isOwn: true,
      isEncrypted: true,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };
    
    setMessages([...messages, newMessage]);
    
    // Simulate receiving an encrypted response
    setTimeout(() => {
      const responseMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: "Message received and decrypted successfully! 🔒",
        isOwn: false,
        isEncrypted: true,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages(prev => [...prev, responseMessage]);
    }, 1000);
  };

  return (
    <div className="flex flex-col h-screen bg-background">
      <ChatHeader 
        isConnected={isConnected} 
        onConnect={handleConnect}
        address={address}
      />
      
      <ChatContainer messages={messages} />
      
      <ChatInput 
        onSendMessage={handleSendMessage}
        disabled={!isConnected}
      />
    </div>
  );
};

export default Index;
