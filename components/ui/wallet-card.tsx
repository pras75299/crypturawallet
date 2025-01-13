"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Copy, Trash2, Eye, EyeOff } from "lucide-react";
import { toast } from "sonner";

interface WalletCardProps {
  type: "ethereum" | "solana";
  address: string;
  privateKey: string;
  onDelete: () => void;
}

export function WalletCard({ type, address, privateKey, onDelete }: WalletCardProps) {
  const [showPrivateKey, setShowPrivateKey] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const copyToClipboard = async (text: string, label: string) => {
    try {
      await navigator.clipboard.writeText(text);
      toast.success(`${label} copied to clipboard`);
    } catch (error) {
      toast.error(`Failed to copy ${label.toLowerCase()}`);
    }
  };

  const truncateAddress = (addr: string) => {
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="relative group"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <motion.div
        animate={{
          opacity: isHovered ? 1 : 0,
          scale: isHovered ? 1 : 0.8,
        }}
        transition={{ duration: 0.2 }}
        className="absolute inset-0 bg-gradient-to-r from-blue-500/20 via-purple-500/20 to-pink-500/20 rounded-xl blur-xl"
      />
      
      <div className="p-6 relative rounded-xl border border-border/50 backdrop-blur-sm bg-card/30 transition-transform duration-300 hover:-translate-y-1">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-semibold capitalize bg-clip-text text-transparent bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500">
            {type} Wallet
          </h3>
          <button
            onClick={onDelete}
            className="p-2 rounded-full hover:bg-destructive/10 text-destructive transition-colors"
          >
            <Trash2 className="h-5 w-5" />
          </button>
        </div>

        <div className="space-y-4">
          <div>
            <label className="text-sm text-muted-foreground">Address</label>
            <div className="flex items-center gap-2 mt-1">
              <code className="flex-1 p-2 rounded bg-background/50 font-mono text-sm">
                {truncateAddress(address)}
              </code>
              <button
                onClick={() => copyToClipboard(address, "Address")}
                className="p-2 rounded-full hover:bg-primary/10 transition-colors"
              >
                <Copy className="h-4 w-4" />
              </button>
            </div>
          </div>

          <div>
            <label className="text-sm text-muted-foreground">Private Key</label>
            <div className="flex items-center gap-2 mt-1">
              <code className="flex-1 p-2 rounded bg-background/50 font-mono text-sm break-all">
                {showPrivateKey ? privateKey : "••••••••••••••••"}
              </code>
              <button
                onClick={() => setShowPrivateKey(!showPrivateKey)}
                className="p-2 rounded-full hover:bg-primary/10 transition-colors"
              >
                {showPrivateKey ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </button>
              <button
                onClick={() => copyToClipboard(privateKey, "Private key")}
                className="p-2 rounded-full hover:bg-primary/10 transition-colors"
              >
                <Copy className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}