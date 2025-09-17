# Environment Configuration

Create a `.env.local` file in the root directory with the following variables:

```env
VITE_CHAIN_ID=11155111
VITE_RPC_URL=your_sepolia_rpc_url_here
VITE_WALLET_CONNECT_PROJECT_ID=your_wallet_connect_project_id_here
VITE_INFURA_API_KEY=your_infura_api_key_here
VITE_RPC_URL_ALT=your_backup_rpc_url_here
```

## Required Environment Variables

### VITE_CHAIN_ID
- **Value**: `11155111`
- **Description**: Ethereum Sepolia testnet chain ID
- **Required**: Yes

### VITE_RPC_URL
- **Value**: Your Sepolia RPC endpoint URL
- **Description**: Primary RPC endpoint for blockchain interactions
- **Required**: Yes
- **Example**: `https://sepolia.infura.io/v3/YOUR_PROJECT_ID`

### VITE_WALLET_CONNECT_PROJECT_ID
- **Value**: Your WalletConnect project ID
- **Description**: Required for wallet connection functionality
- **Required**: Yes
- **How to get**: Create a project at [WalletConnect Cloud](https://cloud.walletconnect.com/)

### VITE_INFURA_API_KEY
- **Value**: Your Infura API key
- **Description**: For accessing Ethereum networks via Infura
- **Required**: Optional (if using Infura RPC)
- **How to get**: Sign up at [Infura](https://infura.io/)

### VITE_RPC_URL_ALT
- **Value**: Backup RPC endpoint URL
- **Description**: Fallback RPC endpoint for redundancy
- **Required**: Optional
- **Example**: `https://1rpc.io/sepolia`

## Getting Your API Keys

### WalletConnect Project ID
1. Visit [WalletConnect Cloud](https://cloud.walletconnect.com/)
2. Sign up or log in
3. Create a new project
4. Copy your Project ID

### Infura API Key
1. Visit [Infura](https://infura.io/)
2. Sign up for a free account
3. Create a new project
4. Copy your Project ID (API Key)

### RPC Endpoints
You can use any of these free Sepolia RPC endpoints:
- Infura: `https://sepolia.infura.io/v3/YOUR_PROJECT_ID`
- Alchemy: `https://eth-sepolia.g.alchemy.com/v2/YOUR_API_KEY`
- Public: `https://1rpc.io/sepolia`

## Security Best Practices

- Never commit your `.env.local` file to version control
- Use different API keys for development and production
- Regularly rotate your API keys
- Monitor your API usage to avoid rate limits

## Troubleshooting

### Common Issues

**Wallet Connection Fails**
- Verify your WalletConnect Project ID is correct
- Check that your RPC URL is accessible
- Ensure you're on the Sepolia network

**Build Errors**
- Make sure all environment variables are prefixed with `VITE_`
- Verify no typos in variable names
- Check that all required variables are set

**Network Issues**
- Test your RPC endpoints manually
- Try using a different RPC provider
- Check your internet connection