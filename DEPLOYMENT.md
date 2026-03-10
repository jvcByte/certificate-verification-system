# Deployment Guide

## Prerequisites Checklist

- [ ] Foundry installed (`curl -L https://foundry.paradigm.xyz | bash && foundryup`)
- [ ] Node.js 18+ installed
- [ ] MetaMask wallet with Sepolia ETH
- [ ] Infura or Alchemy account for RPC
- [ ] Pinata account for IPFS
- [ ] Etherscan API key (optional, for verification)

## Step-by-Step Deployment

### Phase 1: Smart Contract Deployment

#### 1. Setup Foundry Project
```bash
cd certificate-verification-system/contracts
forge install
```

#### 2. Configure Environment
Create `.env` file:
```bash
PRIVATE_KEY=0xYOUR_PRIVATE_KEY_HERE
SEPOLIA_RPC_URL=https://sepolia.infura.io/v3/YOUR_PROJECT_ID
ETHERSCAN_API_KEY=YOUR_ETHERSCAN_API_KEY
```

⚠️ **Security Warning**: Never commit `.env` file to git!

#### 3. Test Smart Contract
```bash
forge test
```

Expected output:
```
Running 8 tests for test/CertificateRegistry.t.sol:CertificateRegistryTest
[PASS] testIssueCertificate() (gas: 123456)
[PASS] testRevokeCertificate() (gas: 123456)
...
Test result: ok. 8 passed; 0 failed
```

#### 4. Deploy to Sepolia
```bash
source .env
forge script script/Deploy.s.sol:DeployScript \
  --rpc-url $SEPOLIA_RPC_URL \
  --broadcast \
  --verify \
  -vvvv
```

#### 5. Save Contract Address
The deployment will output:
```
CertificateRegistry deployed to: 0x1234567890abcdef...
```

**IMPORTANT**: Copy this address for frontend configuration!

#### 6. Verify on Etherscan (if not auto-verified)
```bash
forge verify-contract \
  --chain-id 11155111 \
  --compiler-version v0.8.20 \
  0xYOUR_CONTRACT_ADDRESS \
  src/CertificateRegistry.sol:CertificateRegistry \
  --etherscan-api-key $ETHERSCAN_API_KEY
```

### Phase 2: Frontend Deployment

#### 1. Setup Frontend
```bash
cd ../frontend
npm install
```

#### 2. Configure Environment
Create `.env.local` file:
```bash
NEXT_PUBLIC_CONTRACT_ADDRESS=0xYOUR_DEPLOYED_CONTRACT_ADDRESS
NEXT_PUBLIC_SEPOLIA_RPC_URL=https://sepolia.infura.io/v3/YOUR_PROJECT_ID
PINATA_JWT=YOUR_PINATA_JWT_TOKEN
```

#### 3. Get Pinata JWT Token
1. Go to https://app.pinata.cloud
2. Sign up / Log in
3. Go to API Keys
4. Create new key with permissions:
   - pinFileToIPFS
5. Copy the JWT token

#### 4. Test Locally
```bash
npm run dev
```

Open http://localhost:3000 and test:
- Wallet connection
- Certificate issuance
- Certificate verification

#### 5. Build for Production
```bash
npm run build
```

#### 6. Deploy to Vercel (Recommended)

**Option A: Using Vercel CLI**
```bash
npm install -g vercel
vercel
```

**Option B: Using Vercel Dashboard**
1. Push code to GitHub
2. Go to https://vercel.com
3. Import repository
4. Add environment variables:
   - `NEXT_PUBLIC_CONTRACT_ADDRESS`
   - `NEXT_PUBLIC_SEPOLIA_RPC_URL`
   - `PINATA_JWT`
5. Deploy

**Option C: Other Platforms**
- Netlify: `npm run build && netlify deploy`
- AWS Amplify: Connect GitHub repo
- Railway: Connect GitHub repo

## Post-Deployment Verification

### 1. Test Smart Contract
```bash
# Check contract on Etherscan
open https://sepolia.etherscan.io/address/YOUR_CONTRACT_ADDRESS

# Test read function
cast call YOUR_CONTRACT_ADDRESS "admin()" --rpc-url $SEPOLIA_RPC_URL
```

### 2. Test Frontend
1. Visit deployed URL
2. Connect MetaMask
3. Switch to Sepolia network
4. Test certificate issuance
5. Test certificate verification

### 3. Test Complete Flow
1. **Issue Certificate**:
   - Upload test PDF
   - Enter student ID: "TEST001"
   - Confirm transaction
   - Save certificate hash

2. **Verify Certificate**:
   - Go to verify page
   - Enter saved hash
   - Confirm it shows "VALID"

3. **Revoke Certificate**:
   - Go to revoke page
   - Enter certificate hash
   - Confirm transaction

4. **Re-verify**:
   - Go to verify page
   - Enter same hash
   - Confirm it shows "REVOKED"

## Troubleshooting

### Contract Deployment Fails
```bash
# Check balance
cast balance YOUR_ADDRESS --rpc-url $SEPOLIA_RPC_URL

# Get Sepolia ETH from faucet
open https://sepoliafaucet.com
```

### Frontend Build Fails
```bash
# Clear cache
rm -rf .next node_modules
npm install
npm run build
```

### IPFS Upload Fails
- Verify Pinata JWT token is correct
- Check Pinata dashboard for quota
- Test with curl:
```bash
curl -X POST "https://api.pinata.cloud/pinning/pinFileToIPFS" \
  -H "Authorization: Bearer YOUR_JWT" \
  -F "file=@test.pdf"
```

### MetaMask Connection Issues
- Clear MetaMask cache
- Re-import account
- Check network is Sepolia (Chain ID: 11155111)

## Production Considerations

### Security
- [ ] Use hardware wallet for admin operations
- [ ] Implement multi-sig for admin functions
- [ ] Add rate limiting to API routes
- [ ] Enable CORS restrictions
- [ ] Add input validation

### Monitoring
- [ ] Set up Etherscan alerts for contract
- [ ] Monitor IPFS pin status
- [ ] Track transaction costs
- [ ] Set up error logging (Sentry)

### Scaling
- [ ] Consider IPFS pinning service redundancy
- [ ] Implement caching for blockchain reads
- [ ] Add database for metadata indexing
- [ ] Consider L2 solutions for lower costs

## Cost Estimation

### Sepolia Testnet (Free)
- Contract deployment: ~0.01 ETH (test)
- Issue certificate: ~0.001 ETH (test)
- Revoke certificate: ~0.0005 ETH (test)

### Mainnet (Production)
- Contract deployment: ~$50-100
- Issue certificate: ~$5-10 per transaction
- Revoke certificate: ~$3-5 per transaction

### IPFS (Pinata)
- Free tier: 1GB storage
- Paid plans: Starting at $20/month

## Maintenance

### Regular Tasks
- Monitor contract events
- Check IPFS pin status
- Update dependencies
- Review transaction costs
- Backup certificate hashes

### Updates
```bash
# Update smart contract (requires new deployment)
cd contracts
forge build
forge script script/Deploy.s.sol --rpc-url $SEPOLIA_RPC_URL --broadcast

# Update frontend
cd frontend
npm update
npm run build
vercel --prod
```

## Support Resources

- Foundry: https://book.getfoundry.sh
- wagmi: https://wagmi.sh
- Next.js: https://nextjs.org/docs
- Pinata: https://docs.pinata.cloud
- Sepolia: https://sepolia.dev
