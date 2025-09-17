# Vercel Deployment Guide

## Step-by-Step Manual Deployment Instructions

### Prerequisites
- GitHub account
- Vercel account
- Node.js 18+ installed locally (for testing)

### Step 1: Fork the Repository
1. Go to [https://github.com/aurora38Chain/seek-and-reveal](https://github.com/aurora38Chain/seek-and-reveal)
2. Click the "Fork" button in the top-right corner
3. Select your GitHub account as the destination
4. Wait for the fork to complete

### Step 2: Create Vercel Account
1. Go to [https://vercel.com](https://vercel.com)
2. Click "Sign Up" or "Log In"
3. Choose "Continue with GitHub" to link your accounts
4. Authorize Vercel to access your GitHub repositories

### Step 3: Import Project to Vercel
1. In your Vercel dashboard, click "New Project"
2. Click "Import Git Repository"
3. Find and select your forked `seek-and-reveal` repository
4. Click "Import"

### Step 4: Configure Project Settings
1. **Project Name**: `seek-and-reveal` (or your preferred name)
2. **Framework Preset**: Select "Vite"
3. **Root Directory**: Leave as default (`.`)
4. **Build Command**: `npm run build`
5. **Output Directory**: `dist`
6. **Install Command**: `npm install`

### Step 5: Set Environment Variables
In the Vercel project settings, add the following environment variables:

```
VITE_CHAIN_ID=11155111
VITE_RPC_URL=https://sepolia.infura.io/v3/b18fb7e6ca7045ac83c41157ab93f990
VITE_WALLET_CONNECT_PROJECT_ID=2ec9743d0d0cd7fb94dee1a7e6d33475
VITE_INFURA_API_KEY=b18fb7e6ca7045ac83c41157ab93f990
VITE_RPC_URL_ALT=https://1rpc.io/sepolia
```

**How to add environment variables:**
1. Go to your project dashboard
2. Click on "Settings" tab
3. Click on "Environment Variables" in the sidebar
4. Add each variable with the exact names and values above
5. Make sure to set them for "Production", "Preview", and "Development"
6. Click "Save" after adding each variable

### Step 6: Deploy
1. Click "Deploy" button
2. Wait for the build process to complete (usually 2-5 minutes)
3. Your app will be available at the provided Vercel URL

### Step 7: Custom Domain (Optional)
1. In your project settings, go to "Domains"
2. Click "Add Domain"
3. Enter your custom domain name
4. Follow the DNS configuration instructions
5. Wait for DNS propagation (up to 24 hours)

### Step 8: Verify Deployment
1. Visit your deployed URL
2. Test wallet connection functionality
3. Verify all pages load correctly
4. Check that environment variables are working

## Important Configuration Notes

### Build Configuration
- **Framework**: Vite
- **Node.js Version**: 18.x (recommended)
- **Build Command**: `npm run build`
- **Output Directory**: `dist`

### Environment Variables
All environment variables are prefixed with `VITE_` to make them available in the browser. These are required for:
- Blockchain network configuration (Sepolia testnet)
- Wallet Connect integration
- RPC endpoint configuration

### Smart Contract Integration
- The app is configured to work with Sepolia testnet
- Smart contracts need to be deployed separately
- Update the contract address in `src/hooks/useContract.ts` after deployment

### Troubleshooting

#### Build Failures
- Check that all environment variables are set correctly
- Ensure Node.js version is 18+ in Vercel settings
- Verify package.json dependencies are correct

#### Wallet Connection Issues
- Verify Wallet Connect Project ID is correct
- Check that RPC URLs are accessible
- Ensure you're on the correct network (Sepolia)

#### Performance Issues
- Enable Vercel's Edge Functions if needed
- Configure caching headers for static assets
- Monitor build logs for optimization opportunities

## Post-Deployment Checklist

- [ ] App loads without errors
- [ ] Wallet connection works
- [ ] All pages are accessible
- [ ] Environment variables are set
- [ ] Custom domain is configured (if applicable)
- [ ] Analytics are set up (if desired)
- [ ] Error monitoring is configured (if desired)

## Support

If you encounter issues during deployment:
1. Check Vercel's build logs for specific errors
2. Verify all environment variables are correctly set
3. Ensure your GitHub repository is properly forked
4. Contact Vercel support for platform-specific issues

## Security Notes

- Never commit environment variables to your repository
- Use Vercel's environment variable system for sensitive data
- Regularly rotate API keys and access tokens
- Monitor your deployment for unusual activity

---

**Your Seek and Reveal platform is now live! 🚀**
