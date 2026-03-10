# Blockchain-Based Certificate Verification System

A complete prototype system for issuing, managing, and verifying academic certificates using blockchain technology and IPFS.

## 🎯 Features

### Admin (University)
- Issue certificates with PDF upload
- Store certificate files on IPFS
- Store certificate hash on Ethereum blockchain
- Revoke certificates

### Student
- View certificate metadata
- Access IPFS certificate files
- Generate QR codes for verification
- Share verification links

### Verifier (Employer/Institution)
- Upload certificate file or enter hash
- Verify certificate validity via blockchain
- View certificate status (valid/revoked)

## 🛠 Tech Stack

- **Frontend + Backend**: Next.js 14 (App Router), TypeScript
- **Web3**: wagmi, viem
- **Smart Contracts**: Solidity 0.8.20
- **Contract Tooling**: Foundry (forge + cast)
- **Blockchain**: Ethereum Sepolia Testnet
- **File Storage**: IPFS via Pinata API
- **Wallet**: MetaMask
- **Hashing**: SHA256 via viem

## 📁 Project Structure

```
certificate-verification-system/
├── contracts/              # Foundry smart contract project
│   ├── src/
│   │   └── CertificateRegistry.sol
│   ├── script/
│   │   └── Deploy.s.sol
│   ├── test/
│   │   └── CertificateRegistry.t.sol
│   └── foundry.toml
└── frontend/              # Next.js application
    ├── app/
    │   ├── admin/
    │   │   ├── issue/
    │   │   └── revoke/
    │   ├── student/
    │   ├── verify/
    │   └── api/upload/
    ├── components/
    └── lib/
```

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- Foundry (https://book.getfoundry.sh/getting-started/installation)
- MetaMask wallet
- Sepolia testnet ETH (from faucet)
- Pinata account (https://pinata.cloud)

### 1. Smart Contract Deployment


#### Step 1: Navigate to contracts directory
```bash
cd certificate-verification-system/contracts
```

#### Step 2: Install dependencies
```bash
forge install
```

#### Step 3: Run tests
```bash
forge test
```

#### Step 4: Create .env file
```bash
cp .env.example .env
```

Edit `.env` and add:
```
PRIVATE_KEY=your_metamask_private_key
SEPOLIA_RPC_URL=https://sepolia.infura.io/v3/YOUR_INFURA_KEY
ETHERSCAN_API_KEY=your_etherscan_api_key
```

#### Step 5: Deploy to Sepolia
```bash
source .env
forge script script/Deploy.s.sol --rpc-url $SEPOLIA_RPC_URL --broadcast --verify
```

Save the deployed contract address!

### 2. Frontend Setup

#### Step 1: Navigate to frontend directory
```bash
cd ../frontend
```

#### Step 2: Install dependencies
```bash
npm install
```

#### Step 3: Create .env.local file
```bash
cp .env.example .env.local
```

Edit `.env.local` and add:
```
NEXT_PUBLIC_CONTRACT_ADDRESS=0x... # From deployment
NEXT_PUBLIC_SEPOLIA_RPC_URL=https://sepolia.infura.io/v3/YOUR_INFURA_KEY
PINATA_JWT=your_pinata_jwt_token
```

#### Step 4: Run development server
```bash
npm run dev
```

Open http://localhost:3000

## 📝 Usage Guide

### Issuing a Certificate

1. Navigate to "Issue Certificate" page
2. Connect MetaMask wallet (must be admin address)
3. Enter student ID
4. Upload certificate PDF
5. Click "Issue Certificate"
6. Approve transaction in MetaMask
7. Wait for confirmation
8. Save the certificate hash for future reference

### Revoking a Certificate

1. Navigate to "Revoke Certificate" page
2. Connect MetaMask wallet (must be admin address)
3. Enter certificate hash
4. Click "Revoke Certificate"
5. Approve transaction in MetaMask

### Viewing Certificate (Student)

1. Navigate to "Student View" page
2. Enter certificate hash
3. View certificate details
4. Generate QR code for sharing
5. Copy verification link

### Verifying a Certificate

1. Navigate to "Verify Certificate" page
2. Either:
   - Upload the certificate PDF file, OR
   - Enter the certificate hash
3. Click "Verify Certificate"
4. View verification result:
   - ✓ VALID - Certificate is authentic
   - ❌ REVOKED - Certificate was revoked
   - ❌ NOT FOUND - Certificate doesn't exist

## 🔐 Security Notes

- Only the admin (contract deployer) can issue and revoke certificates
- Certificate hashes are computed using keccak256
- All transactions are recorded on the blockchain
- IPFS ensures decentralized file storage

## 🧪 Testing

### Smart Contract Tests
```bash
cd contracts
forge test -vvv
```

### Test Coverage
```bash
forge coverage
```

## 📊 Smart Contract Functions

### issueCertificate
```solidity
function issueCertificate(
    bytes32 certHash,
    string memory studentId,
    string memory ipfsHash
) external onlyAdmin
```

### revokeCertificate
```solidity
function revokeCertificate(bytes32 certHash) external onlyAdmin
```

### verifyCertificate
```solidity
function verifyCertificate(bytes32 certHash)
    external view
    returns (
        bool exists,
        bool revoked,
        string memory ipfsHash,
        string memory studentId,
        uint256 issuedAt
    )
```

## 🌐 Certificate Verification Flow

1. **Issuance**:
   - Admin uploads PDF → IPFS
   - System computes file hash
   - Smart contract stores: hash + studentId + IPFS CID
   - Event emitted on blockchain

2. **Verification**:
   - Verifier uploads file OR enters hash
   - System queries blockchain
   - Returns: exists, revoked status, metadata
   - Display result to verifier

## 🔗 Useful Links

- Sepolia Faucet: https://sepoliafaucet.com
- Sepolia Explorer: https://sepolia.etherscan.io
- Pinata: https://pinata.cloud
- Foundry Book: https://book.getfoundry.sh

## 📄 License

MIT License - This is a prototype for educational purposes.

## 🎓 Thesis Notes

This system demonstrates:
- Blockchain immutability for certificate records
- Decentralized storage with IPFS
- Smart contract access control
- Web3 integration with modern frontend
- Cryptographic verification
- Event-driven architecture

## 🐛 Troubleshooting

### MetaMask Connection Issues
- Ensure you're on Sepolia network
- Check that you have test ETH

### Transaction Failures
- Verify you're using the admin wallet
- Check gas settings
- Ensure contract address is correct

### IPFS Upload Failures
- Verify Pinata JWT token
- Check file size limits
- Ensure API endpoint is accessible

## 👨‍💻 Development

Built with ❤️ for university thesis project.