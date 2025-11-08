import { useState } from "react";
import { ChatHeader } from "@/components/ChatHeader";
import { ChatContainer } from "@/components/ChatContainer";
import { ChatInput } from "@/components/ChatInput";
import { ContactsSidebar } from "@/components/ContactsSidebar";
import { AddContactDialog } from "@/components/AddContactDialog";
import { SidebarProvider } from "@/components/ui/sidebar";
import { useToast } from "@/hooks/use-toast";

interface Message {
  id: string;
  text: string;
  isOwn: boolean;
  isEncrypted: boolean;
  timestamp: string;
}

interface Contact {
  id: string;
  address: string;
  name?: string;
  lastMessage?: string;
  timestamp?: string;
  unread?: number;
}

const Index = () => {
  const [isConnected, setIsConnected] = useState(false);
  const [address, setAddress] = useState<string>();
  const [contacts, setContacts] = useState<Contact[]>([
    {
      id: "1",
      address: "0x1234567890123456789012345678901234567890",
      name: "Alice",
      lastMessage: "Hey! Check out this encrypted message...",
      timestamp: "2m ago",
      unread: 2,
    },
    {
      id: "2",
      address: "0x9876543210987654321098765432109876543210",
      name: "Bob",
      lastMessage: "Thanks for the secure chat!",
      timestamp: "1h ago",
    },
  ]);
  const [selectedContact, setSelectedContact] = useState<Contact | undefined>(contacts[0]);
  const [conversationMessages, setConversationMessages] = useState<Record<string, Message[]>>({
    "1": [],
    "2": [],
  });
  const [showAddContactDialog, setShowAddContactDialog] = useState(false);
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

  const handleSelectContact = (contact: Contact) => {
    setSelectedContact(contact);
    
    // Clear unread count
    setContacts(prev =>
      prev.map(c => c.id === contact.id ? { ...c, unread: 0 } : c)
    );
  };

  const handleAddContact = (newAddress: string, newName?: string) => {
    const newContact: Contact = {
      id: Date.now().toString(),
      address: newAddress,
      name: newName,
    };
    
    setContacts(prev => [...prev, newContact]);
    setConversationMessages(prev => ({ ...prev, [newContact.id]: [] }));
    setSelectedContact(newContact);
    
    toast({
      title: "Contact Added",
      description: `${newName || "Contact"} has been added to your contacts.`,
    });
  };

  const handleSendMessage = (text: string) => {
    if (!selectedContact) return;

    const newMessage: Message = {
      id: Date.now().toString(),
      text,
      isOwn: true,
      isEncrypted: true,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };
    
    setConversationMessages(prev => ({
      ...prev,
      [selectedContact.id]: [...(prev[selectedContact.id] || []), newMessage],
    }));

    // Update contact's last message
    setContacts(prev =>
      prev.map(c =>
        c.id === selectedContact.id
          ? { ...c, lastMessage: text, timestamp: "now" }
          : c
      )
    );
    
    // Simulate receiving an encrypted response
    setTimeout(() => {
      const responseMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: "Message received and decrypted successfully! 🔒",
        isOwn: false,
        isEncrypted: true,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      
      setConversationMessages(prev => ({
        ...prev,
        [selectedContact.id]: [...(prev[selectedContact.id] || []), responseMessage],
      }));

      setContacts(prev =>
        prev.map(c =>
          c.id === selectedContact.id
            ? { ...c, lastMessage: responseMessage.text, timestamp: "now" }
            : c
        )
      );
    }, 1000);
  };

  const currentMessages = selectedContact
    ? conversationMessages[selectedContact.id] || []
    : [];

  return (
    <SidebarProvider defaultOpen={true}>
      <div className="flex h-screen w-full bg-background">
        <ContactsSidebar
          contacts={contacts}
          selectedContact={selectedContact}
          onSelectContact={handleSelectContact}
          onAddContact={() => setShowAddContactDialog(true)}
        />

        <div className="flex flex-col flex-1 min-w-0">
          <ChatHeader 
            isConnected={isConnected} 
            onConnect={handleConnect}
            address={address}
          />
          
          <ChatContainer messages={currentMessages} />
          
          <ChatInput 
            onSendMessage={handleSendMessage}
            disabled={!isConnected || !selectedContact}
          />
        </div>

        <AddContactDialog
          open={showAddContactDialog}
          onOpenChange={setShowAddContactDialog}
          onAddContact={handleAddContact}
        />
      </div>
    </SidebarProvider>
  );
};

export default Index;
