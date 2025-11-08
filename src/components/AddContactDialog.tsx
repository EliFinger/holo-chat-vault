import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { UserPlus } from "lucide-react";

interface AddContactDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAddContact: (address: string, name?: string) => void;
}

export const AddContactDialog = ({
  open,
  onOpenChange,
  onAddContact,
}: AddContactDialogProps) => {
  const [address, setAddress] = useState("");
  const [name, setName] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = () => {
    setError("");

    // Basic validation
    if (!address.trim()) {
      setError("Wallet address is required");
      return;
    }

    if (!address.startsWith("0x") || address.length !== 42) {
      setError("Invalid wallet address format");
      return;
    }

    onAddContact(address.trim(), name.trim() || undefined);
    
    // Reset form
    setAddress("");
    setName("");
    onOpenChange(false);
  };

  const handleCancel = () => {
    setAddress("");
    setName("");
    setError("");
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <UserPlus className="w-5 h-5 text-primary" />
            Add New Contact
          </DialogTitle>
          <DialogDescription>
            Enter the wallet address to start a secure conversation
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="address" className="text-sm font-medium">
              Wallet Address *
            </Label>
            <Input
              id="address"
              placeholder="0x..."
              value={address}
              onChange={(e) => {
                setAddress(e.target.value);
                setError("");
              }}
              className="font-mono text-sm"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="name" className="text-sm font-medium">
              Contact Name (Optional)
            </Label>
            <Input
              id="name"
              placeholder="Enter a friendly name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          {error && (
            <p className="text-sm text-destructive">{error}</p>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={handleCancel}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} className="shadow-glow">
            Add Contact
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
