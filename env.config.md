# Environment Configuration

Create a `.env.local` file in the root directory with the following variables:

```env
VITE_CHAIN_ID=11155111
VITE_RPC_URL=https://sepolia.infura.io/v3/b18fb7e6ca7045ac83c41157ab93f990
VITE_WALLET_CONNECT_PROJECT_ID=2ec9743d0d0cd7fb94dee1a7e6d33475
VITE_INFURA_API_KEY=b18fb7e6ca7045ac83c41157ab93f990
VITE_RPC_URL_ALT=https://1rpc.io/sepolia
```

These environment variables are required for:
- Chain configuration (Sepolia testnet)
- RPC endpoints for blockchain interaction
- Wallet Connect integration
- Infura API access
