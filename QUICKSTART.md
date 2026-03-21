# Quick Start Guide

Get the Certificate Verification System running in 10 minutes!

## 1. Install Prerequisites (5 minutes)

### Install Foundry
```bash
curl -L https://foundry.paradigm.xyz | bash
foundryup
```

### Verify Installation
```bash
forge --version
node --version  # Should be 18+
```

## 2. Get Test Resources (3 minutes)

### Get Sepolia ETH
1. Visit https://sepoliafaucet.com
2. Enter your MetaMask address
3. Request test ETH (0.5 ETH is enough)

### Get Infura RPC URL
1. Visit https://infura.io
2. Create free account
3. Create new project
4. Copy Sepolia endpoint URL

### Get Pinata JWT
1. Visit https://pinata.cloud
2. Create free account
3. Go to API Keys → New Key
4. Enable "pinFileToIPFS" permission
5. Copy JWT token

## 3. Deploy Smart Contract (2 minutes)

```bash
cd certificate-verification-system/contracts

# Create .env file
cat > .env << EOF
PRIVATE_KEY=your_metamask_private_key
BASE_SEPOLIA_RPC_URL=https://base-sepolia.infura.io/v3/YOUR_PROJECT_ID
ETHERSCAN_API_KEY=optional
EOF

# Install and test
forge install
forge test

# Deploy
source .env
forge script script/Deploy.s.sol --rpc-url $BASE_SEPOLIA_RPC_URL --broadcast

# Copy the contract address from output!
```

## 4. Run Frontend (2 minutes)

```bash
cd ../frontend

# Install dependencies
npm install

# Create .env.local file
cat > .env.local << EOF
NEXT_PUBLIC_CONTRACT_ADDRESS=0xYOUR_CONTRACT_ADDRESS_FROM_STEP_3
NEXT_PUBLIC_BASE_SEPOLIA_RPC_URL=https://base-sepolia.infura.io/v3/YOUR_PROJECT_ID
PINATA_JWT=YOUR_PINATA_JWT_TOKEN
EOF

# Start development server
npm run dev
```

## 5. Test the System (3 minutes)

### Open Browser
Visit http://localhost:3000

### Connect Wallet
1. Click "Connect MetaMask"
2. Switch to Sepolia network
3. Approve connection

### Issue Test Certificate
1. Go to "Issue Certificate"
2. Enter Student ID: `TEST001`
3. Upload any PDF file
4. Click "Issue Certificate"
5. Approve transaction in MetaMask
6. Wait for confirmation
7. **Copy the certificate hash!**

### Verify Certificate
1. Go to "Verify Certificate"
2. Paste the certificate hash
3. Click "Verify"
4. Should show "✓ VALID"

### Test Revocation
1. Go to "Revoke Certificate"
2. Paste the certificate hash
3. Click "Revoke"
4. Approve transaction
5. Go back to verify page
6. Should now show "❌ REVOKED"

## 🎉 Success!

You now have a working blockchain certificate verification system!

## Next Steps

- Read the full [README.md](README.md) for detailed documentation
- Check [DEPLOYMENT.md](DEPLOYMENT.md) for production deployment
- Explore the smart contract code in `contracts/src/`
- Customize the frontend in `frontend/app/`

## Common Issues

### "Insufficient funds"
- Get more Sepolia ETH from faucet

### "Contract not deployed"
- Check contract address in .env.local
- Verify deployment was successful

### "IPFS upload failed"
- Verify Pinata JWT token
- Check internet connection

### "Transaction failed"
- Ensure you're using admin wallet
- Check gas settings in MetaMask

## Quick Commands Reference

```bash
# Test smart contract
cd contracts && forge test

# Deploy contract
forge script script/Deploy.s.sol --rpc-url $BASE_SEPOLIA_RPC_URL --broadcast

# Run frontend
cd frontend && npm run dev

# Build frontend
npm run build

# Check contract on Etherscan
open https://sepolia.basescan.org/address/YOUR_CONTRACT_ADDRESS
```

## Need Help?

- Check the troubleshooting section in README.md
- Review Foundry docs: https://book.getfoundry.sh
- Review wagmi docs: https://wagmi.sh
- Check Next.js docs: https://nextjs.org/docs
