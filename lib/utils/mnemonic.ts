import { generateMnemonic } from 'bip39';
import { HDNodeWallet, Wallet } from 'ethers';
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

export const createEthereumWallet = async (mnemonic: string, index: number = 0) => {
  try {
    const path = `m/44'/60'/0'/0/${index}`;
    const wallet = HDNodeWallet.fromPhrase(mnemonic, undefined, path);
    return {
      address: wallet.address,
      privateKey: wallet.privateKey,
    };
  } catch (error) {
    console.error("Error creating Ethereum wallet:", error);
    throw new Error("Failed to create Ethereum wallet");
  }
};

export const createSolanaWallet = async (mnemonic: string, index: number = 0) => {
  try {
    // Generate seed from mnemonic
    const seed = await bip39.mnemonicToSeed(mnemonic);

    // Create an index buffer as a Uint8Array
    const indexBuffer = new Uint8Array(4);
    new DataView(indexBuffer.buffer).setUint32(0, index, true); // Write index in little-endian format

    // Convert seed to Uint8Array if it's not already
    const seedArray = new Uint8Array(seed);

    // Concatenate the seed and index buffer
    const combinedSeed = new Uint8Array(seedArray.length + indexBuffer.length);
    combinedSeed.set(seedArray, 0); // Add seed at the start
    combinedSeed.set(indexBuffer, seedArray.length); // Add index buffer at the end

    // Use only the first 32 bytes for the keypair
    const finalSeed = combinedSeed.slice(0, 32);
    const keypair = Keypair.fromSeed(finalSeed);

    return {
      address: keypair.publicKey.toString(),
      privateKey: Buffer.from(keypair.secretKey).toString('hex'),
    };
  } catch (error) {
    console.error("Error creating Solana wallet:", error);
    throw new Error("Failed to create Solana wallet");
  }
};