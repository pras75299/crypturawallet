import { generateMnemonic } from 'bip39';
import { Wallet } from 'ethers';
import { Keypair } from '@solana/web3.js';
import * as bip39 from 'bip39';

export const generateNewMnemonic = () => {
  try {
    return generateMnemonic(256);
  } catch (error) {
    console.error("Error generating mnemonic:", error);
    throw new Error("Failed to generate mnemonic");
  }
};

export const createEthereumWallet = async (mnemonic: string) => {
  try {
    const wallet = Wallet.fromPhrase(mnemonic);
    return {
      address: wallet.address,
      privateKey: wallet.privateKey,
    };
  } catch (error) {
    console.error("Error creating Ethereum wallet:", error);
    throw new Error("Failed to create Ethereum wallet");
  }
};

export const createSolanaWallet = async (mnemonic: string) => {
  try {
    const seed = await bip39.mnemonicToSeed(mnemonic);
    const keypair = Keypair.fromSeed(seed.slice(0, 32));
    return {
      address: keypair.publicKey.toString(),
      privateKey: Buffer.from(keypair.secretKey).toString('hex'),
    };
  } catch (error) {
    console.error("Error creating Solana wallet:", error);
    throw new Error("Failed to create Solana wallet");
  }
};