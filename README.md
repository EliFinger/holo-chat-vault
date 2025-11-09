# WhisperVault - Encrypted On-Chain Messaging

A secure, decentralized messaging vault that stores encrypted messages on-chain. Messages are encrypted client-side using AES-GCM before being stored, ensuring only the owner can decrypt their conversations.

## 🎬 Demo

https://github.com/EliFinger/holo-chat-vault/raw/main/holo-chat-vault.mp4

**Live Demo**: [https://holo-chat-vault.vercel.app/](https://holo-chat-vault.vercel.app/)

## ✨ Features

- **End-to-End Encryption**: Messages are AES-GCM encrypted client-side before on-chain storage
- **Wallet Authentication**: Sign in with your wallet and encryption password
- **On-Chain Storage**: All messages stored securely on the blockchain
- **Password Strength Indicator**: Visual feedback for encryption password security
- **Auto-Response System**: Automated encrypted responses for demonstration
- **Network Switching**: Seamless handling when switching between networks
- **Copy to Clipboard**: Easy copying of encrypted or decrypted content
- **Relative Time Display**: Human-friendly message timestamps
- **Session Lock**: Lock your vault without disconnecting wallet

## 🛠️ Tech Stack

### Smart Contracts
- **Solidity** ^0.8.24
- **Hardhat** with FHEVM support
- **Zama FHEVM** for FHE capabilities

### Frontend
- **Next.js 15** with App Router
- **React 18** with TypeScript
- **TailwindCSS** + **DaisyUI** for styling
- **RainbowKit** + **wagmi** for wallet connection
- **ethers.js v6** for blockchain interaction
- **Web Crypto API** for client-side encryption

## 📦 Installation

### Prerequisites

- Node.js >= 20
- pnpm (recommended) or npm

### Smart Contracts

```bash
# Install dependencies
npm install

# Set environment variables
npx hardhat vars set MNEMONIC
npx hardhat vars set INFURA_API_KEY

# Compile contracts
npm run compile

# Run tests
npm run test

# Deploy to local network
npx hardhat node
npx hardhat deploy --network localhost

# Deploy to Sepolia
npx hardhat deploy --network sepolia
```

### Frontend

```bash
cd frontend

# Install dependencies
pnpm install

# Generate ABIs from deployed contracts
pnpm run genabi

# Start development server
pnpm run dev
```

## 📁 Project Structure

```
holo-chat-vault/
├── contracts/
│   └── WhisperVault.sol     # Main encrypted messaging contract
├── deploy/
│   └── deploy.ts            # Deployment script
├── test/
│   └── WhisperVault.ts      # Contract tests
├── tasks/
│   └── WhisperVault.ts      # Hardhat tasks
├── frontend/
│   ├── app/                 # Next.js app router
│   ├── components/
│   │   └── WhisperChat.tsx  # Main chat component
│   ├── hooks/
│   │   ├── useWhisperVault.ts  # Contract interaction hook
│   │   └── useCrypto.ts     # Encryption utilities
│   ├── abi/                 # Generated contract ABIs
│   └── public/
│       └── deployments.json # Dynamic contract addresses
├── hardhat.config.ts
└── package.json
```

## 🔐 How It Works

1. **Connect Wallet**: Connect your MetaMask or other Web3 wallet
2. **Set Password**: Enter an encryption password (stored only in your browser)
3. **Sign Authentication**: Sign a message to verify wallet ownership
4. **Send Messages**: Messages are AES-GCM encrypted before being stored on-chain
5. **Decrypt**: Only you can decrypt messages with your password

## 📜 Smart Contract

The `WhisperVault` contract provides:

- `storeMessage(bytes encryptedContent)` - Store encrypted user message
- `storeResponse(bytes encryptedContent)` - Store encrypted auto-response
- `getAllMessages(address user)` - Batch retrieve all messages
- `getMessageCount(address user)` - Get message count
- `clearMessages()` - Clear all user messages

## 📄 License

This project is licensed under the BSD-3-Clause-Clear License. See the [LICENSE](LICENSE) file for details.

## 🔗 Links

- [FHEVM Documentation](https://docs.zama.ai/fhevm)
- [Zama Discord](https://discord.gg/zama)
