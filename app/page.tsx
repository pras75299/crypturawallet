"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Wallet, Copy, Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { WalletCard } from "@/components/ui/wallet-card";
import { BackgroundGradient } from "@/components/background-gradient";
import { ParticlesBackground } from "@/components/particles-background";
import {
  generateNewMnemonic,
  createEthereumWallet,
  createSolanaWallet,
} from "@/lib/utils/mnemonic";
import { toast } from "sonner";

interface WalletData {
  id: string;
  type: "ethereum" | "solana";
  address: string;
  privateKey: string;
}

export default function Home() {
  const [mnemonic, setMnemonic] = useState<string>("");
  const [showMnemonic, setShowMnemonic] = useState(true);
  const [wallets, setWallets] = useState<WalletData[]>([]);

  const generateMnemonic = () => {
    try {
      const newMnemonic = generateNewMnemonic();
      setMnemonic(newMnemonic);
      setShowMnemonic(true);
      setWallets([]);
    } catch (error) {
      toast.error("Failed to generate mnemonic");
    }
  };

  const copyMnemonic = async () => {
    try {
      await navigator.clipboard.writeText(mnemonic);
      toast.success("Mnemonic copied to clipboard");
    } catch (error) {
      toast.error("Failed to copy mnemonic");
    }
  };

  const createWallet = async (type: "ethereum" | "solana") => {
    if (!mnemonic) {
      toast.error("Please generate a mnemonic first");
      return;
    }

    try {
      const wallet =
        type === "ethereum"
          ? await createEthereumWallet(mnemonic)
          : await createSolanaWallet(mnemonic);

      const existingWallet = wallets.find(
        (w) => w.type === type && w.address === wallet.address
      );

      if (existingWallet) {
        toast.error(`This ${type} wallet already exists`);
        return;
      }

      setWallets((prev) => [
        ...prev,
        {
          id: Math.random().toString(36).substr(2, 9),
          type,
          ...wallet,
        },
      ]);

      toast.success(`${type} wallet created successfully`);
    } catch (error) {
      console.error("Wallet creation error:", error);
      toast.error(`Failed to create ${type} wallet`);
    }
  };

  const deleteWallet = (id: string) => {
    try {
      setWallets((prev) => prev.filter((wallet) => wallet.id !== id));
      toast.success("Wallet deleted successfully");
    } catch (error) {
      toast.error("Failed to delete wallet");
    }
  };

  return (
    <main className="min-h-screen w-full bg-background text-foreground pb-16">
      <ParticlesBackground />

      <div className="container mx-auto px-4 py-16 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl md:text-6xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 mb-4 pb-3">
            Crypto Wallet Generator
          </h1>
          <p className="text-lg text-muted-foreground mb-8">
            Generate secure wallets for Ethereum and Solana with a single
            mnemonic phrase
          </p>

          <Button
            size="lg"
            onClick={generateMnemonic}
            className="bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 text-white hover:opacity-90 transition-opacity"
          >
            <Wallet className="mr-2 h-5 w-5" />
            Generate New Mnemonic
          </Button>
        </motion.div>

        <AnimatePresence mode="wait">
          {mnemonic && (
            <motion.div
              key="mnemonic"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="mb-12"
            >
              <Card className="p-6 backdrop-blur-sm bg-card/30 border border-border/50">
                <div className="flex flex-col space-y-4">
                  <div className="flex items-center justify-between">
                    <h2 className="text-xl font-semibold">
                      Your Mnemonic Phrase
                    </h2>
                    <div className="flex gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setShowMnemonic(!showMnemonic)}
                      >
                        {showMnemonic ? (
                          <EyeOff className="h-4 w-4" />
                        ) : (
                          <Eye className="h-4 w-4" />
                        )}
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={copyMnemonic}
                      >
                        <Copy className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-2">
                    {showMnemonic
                      ? mnemonic.split(" ").map((word, index) => (
                          <motion.div
                            key={index}
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: index * 0.03 }}
                            className="relative group"
                          >
                            <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 via-purple-500/10 to-pink-500/10 rounded-md blur-sm" />
                            <div className="relative p-2 rounded-md bg-background/50 border border-border/50 font-mono text-sm">
                              {word}
                            </div>
                          </motion.div>
                        ))
                      : Array(24)
                          .fill("••••")
                          .map((dots, index) => (
                            <motion.div
                              key={index}
                              initial={{ opacity: 0, scale: 0.9 }}
                              animate={{ opacity: 1, scale: 1 }}
                              transition={{ delay: index * 0.03 }}
                              className="relative group"
                            >
                              <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 via-purple-500/10 to-pink-500/10 rounded-md blur-sm" />
                              <div className="relative p-2 rounded-md bg-background/50 border border-border/50 font-mono text-sm">
                                {dots}
                              </div>
                            </motion.div>
                          ))}
                  </div>
                </div>
              </Card>

              <div className="mt-8 flex flex-wrap gap-4 justify-center">
                <Button
                  variant="secondary"
                  onClick={() => createWallet("ethereum")}
                  className="hover:bg-primary/10"
                >
                  Create Ethereum Wallet
                </Button>
                <Button
                  variant="secondary"
                  onClick={() => createWallet("solana")}
                  className="hover:bg-primary/10"
                >
                  Create Solana Wallet
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {wallets.map((wallet) => (
              <WalletCard
                key={wallet.id}
                type={wallet.type}
                address={wallet.address}
                privateKey={wallet.privateKey}
                onDelete={() => deleteWallet(wallet.id)}
              />
            ))}
          </div>
        </AnimatePresence>
      </div>
    </main>
  );
}
