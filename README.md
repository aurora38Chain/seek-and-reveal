# Seek and Reveal

A decentralized treasure hunting platform built on blockchain technology with fully homomorphic encryption (FHE) for secure data protection.

## 🚀 Features

- **Decentralized Treasure Maps**: Create and share encrypted treasure maps on the blockchain
- **FHE Security**: All sensitive data is encrypted using fully homomorphic encryption
- **Wallet Integration**: Connect with popular Web3 wallets like Rainbow, MetaMask, and more
- **Expedition Tracking**: Track your treasure hunting expeditions and progress
- **Leaderboard System**: Compete with other treasure hunters globally
- **Privacy-First**: Your treasure locations and clues remain encrypted and private

## 🛠️ Technology Stack

- **Frontend**: React 18, TypeScript, Vite
- **UI Components**: shadcn/ui, Tailwind CSS
- **Blockchain**: Ethereum (Sepolia Testnet)
- **Encryption**: FHE (Fully Homomorphic Encryption) via Zama
- **Wallet Integration**: RainbowKit, Wagmi, Viem
- **State Management**: TanStack Query

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ and npm
- A Web3 wallet (MetaMask, Rainbow, etc.)
- Sepolia ETH for gas fees

### Installation

```bash
# Clone the repository
git clone https://github.com/aurora38Chain/seek-and-reveal.git

# Navigate to the project directory
cd seek-and-reveal

# Install dependencies
npm install

# Start the development server
npm run dev
```

### Environment Variables

Create a `.env.local` file in the root directory:

```env
NEXT_PUBLIC_CHAIN_ID=11155111
NEXT_PUBLIC_RPC_URL=https://sepolia.infura.io/v3/b18fb7e6ca7045ac83c41157ab93f990
NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID=2ec9743d0d0cd7fb94dee1a7e6d33475
NEXT_PUBLIC_INFURA_API_KEY=b18fb7e6ca7045ac83c41157ab93f990
NEXT_PUBLIC_RPC_URL=https://1rpc.io/sepolia
```

## 🎮 How to Play

1. **Connect Wallet**: Connect your Web3 wallet to the platform
2. **Create Treasure Map**: Design and encrypt your treasure map with clues
3. **Join Expeditions**: Participate in community treasure hunts
4. **Track Progress**: Monitor your expedition progress and achievements
5. **Claim Rewards**: Discover treasures and claim your rewards

## 🔐 Security Features

- **FHE Encryption**: All treasure data is encrypted using fully homomorphic encryption
- **Zero-Knowledge Proofs**: Verify treasure discoveries without revealing locations
- **Decentralized Storage**: Treasure maps are stored on the blockchain
- **Privacy Protection**: Your personal data and treasure locations remain private

## 🏗️ Smart Contracts

The platform uses smart contracts deployed on Sepolia testnet:

- **TreasureMap Contract**: Manages treasure map creation and encryption
- **Expedition Contract**: Handles expedition tracking and rewards
- **Reward Contract**: Manages treasure rewards and payouts

## 🚀 Deployment

### Vercel Deployment

1. Fork this repository
2. Connect your GitHub account to Vercel
3. Import the project in Vercel
4. Set environment variables in Vercel dashboard
5. Deploy!

### Manual Deployment

```bash
# Build the project
npm run build

# Deploy to your preferred hosting platform
# The build files will be in the 'dist' directory
```

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guidelines](CONTRIBUTING.md) for details.

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🔗 Links

- **Website**: [Coming Soon]
- **Documentation**: [Coming Soon]
- **Discord**: [Coming Soon]
- **Twitter**: [Coming Soon]

## ⚠️ Disclaimer

This is a testnet application. Do not use real funds or sensitive data. Always verify smart contract addresses before interacting with them.

## 🆘 Support

If you encounter any issues or have questions:

1. Check the [Issues](https://github.com/aurora38Chain/seek-and-reveal/issues) page
2. Join our Discord community
3. Contact us at support@seekandreveal.com

---

**Happy Treasure Hunting! 🏴‍☠️**