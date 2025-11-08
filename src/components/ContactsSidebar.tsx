import { useState } from "react";
import { User, Plus, Search } from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarHeader,
  SidebarTrigger,
  useSidebar,
} from "@/components/ui/sidebar";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface Contact {
  id: string;
  address: string;
  name?: string;
  lastMessage?: string;
  timestamp?: string;
  unread?: number;
}

interface ContactsSidebarProps {
  contacts: Contact[];
  selectedContact?: Contact;
  onSelectContact: (contact: Contact) => void;
  onAddContact: () => void;
}

export const ContactsSidebar = ({
  contacts,
  selectedContact,
  onSelectContact,
  onAddContact,
}: ContactsSidebarProps) => {
  const [searchQuery, setSearchQuery] = useState("");
  const { state } = useSidebar();
  const isCollapsed = state === "collapsed";

  const filteredContacts = contacts.filter(
    (contact) =>
      contact.address.toLowerCase().includes(searchQuery.toLowerCase()) ||
      contact.name?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <Sidebar className={cn("border-r border-border", isCollapsed ? "w-20" : "w-80")}>
      <SidebarHeader className="p-4 border-b border-border">
        <div className="flex items-center justify-between mb-3">
          <h2 className={cn("text-lg font-semibold text-foreground", isCollapsed && "hidden")}>
            Contacts
          </h2>
          <div className="flex items-center gap-2">
            <Button
              size="icon"
              variant="ghost"
              onClick={onAddContact}
              className="hover:bg-primary/10 hover:text-primary"
              title="Add New Contact"
            >
              <Plus className="w-4 h-4" />
            </Button>
            <SidebarTrigger />
          </div>
        </div>

        {!isCollapsed && (
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Search contacts..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 bg-background border-border focus:border-primary"
            />
          </div>
        )}
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className={isCollapsed ? "hidden" : ""}>
            Recent Chats ({filteredContacts.length})
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {filteredContacts.map((contact) => (
                <SidebarMenuItem key={contact.id}>
                  <SidebarMenuButton
                    onClick={() => onSelectContact(contact)}
                    className={cn(
                      "relative h-auto py-3 hover:bg-primary/5 transition-all duration-200",
                      selectedContact?.id === contact.id && "bg-primary/10 border-l-2 border-primary"
                    )}
                    title={contact.name || contact.address}
                  >
                    <div className="flex items-center gap-3 w-full">
                      <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0 border border-primary/30">
                        <User className="w-5 h-5 text-primary" />
                      </div>

                      {!isCollapsed && (
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between mb-1">
                            <p className="font-medium text-sm text-foreground truncate">
                              {contact.name || "Anonymous"}
                            </p>
                            {contact.timestamp && (
                              <span className="text-xs text-muted-foreground">
                                {contact.timestamp}
                              </span>
                            )}
                          </div>
                          <div className="flex items-center justify-between">
                            <p className="text-xs text-muted-foreground font-mono truncate">
                              {contact.address.slice(0, 8)}...{contact.address.slice(-6)}
                            </p>
                            {contact.unread && contact.unread > 0 && (
                              <span className="flex items-center justify-center w-5 h-5 rounded-full bg-primary text-primary-foreground text-xs font-bold">
                                {contact.unread}
                              </span>
                            )}
                          </div>
                          {contact.lastMessage && (
                            <p className="text-xs text-muted-foreground truncate mt-1">
                              {contact.lastMessage}
                            </p>
                          )}
                        </div>
                      )}

                      {isCollapsed && contact.unread && contact.unread > 0 && (
                        <div className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-primary text-primary-foreground text-xs font-bold flex items-center justify-center">
                          {contact.unread}
                        </div>
                      )}
                    </div>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>

            {filteredContacts.length === 0 && (
              <div className={cn("text-center py-8", isCollapsed && "hidden")}>
                <User className="w-12 h-12 mx-auto mb-3 text-muted-foreground opacity-50" />
                <p className="text-sm text-muted-foreground">
                  {searchQuery ? "No contacts found" : "No contacts yet"}
                </p>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={onAddContact}
                  className="mt-3"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add Contact
                </Button>
              </div>
            )}
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
};
