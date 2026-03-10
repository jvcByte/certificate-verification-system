# System Architecture

## Overview

The Certificate Verification System is a decentralized application (dApp) that combines blockchain technology with IPFS for secure, tamper-proof certificate management.

## Architecture Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                         Frontend                             │
│                    (Next.js 14 + React)                      │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐   │
│  │  Admin   │  │ Student  │  │ Verifier │  │  Wallet  │   │
│  │  Pages   │  │  Pages   │  │  Pages   │  │ Connect  │   │
│  └──────────┘  └──────────┘  └──────────┘  └──────────┘   │
└─────────────────────────────────────────────────────────────┘
         │                    │                    │
         ▼                    ▼                    ▼
┌─────────────────────────────────────────────────────────────┐
│                      Web3 Layer                              │
│                   (wagmi + viem)                             │
└─────────────────────────────────────────────────────────────┘
         │                                         │
         ▼                                         ▼
┌──────────────────────┐              ┌──────────────────────┐
│   Ethereum Sepolia   │              │    IPFS (Pinata)     │
│   Smart Contract     │              │   File Storage       │
│ CertificateRegistry  │              │   (PDF Files)        │
└──────────────────────┘              └──────────────────────┘
```

## Component Breakdown

### 1. Frontend Layer (Next.js)


**Technology**: Next.js 14 with App Router, TypeScript, TailwindCSS

**Pages**:
- `/` - Home page with navigation
- `/admin/issue` - Certificate issuance interface
- `/admin/revoke` - Certificate revocation interface
- `/student` - Student certificate view
- `/verify` - Public verification interface

**API Routes**:
- `/api/upload` - IPFS file upload endpoint

**Components**:
- `WalletConnect` - MetaMask connection
- `CertificateUpload` - File upload with drag-and-drop
- `CertificateVerifier` - Verification result display

### 2. Web3 Integration Layer

**wagmi**: React hooks for Ethereum
- `useAccount` - Wallet connection state
- `useWriteContract` - Contract write operations
- `useReadContract` - Contract read operations
- `useWaitForTransactionReceipt` - Transaction confirmation

**viem**: Low-level Ethereum utilities
- `keccak256` - Cryptographic hashing
- Contract ABI encoding/decoding
- Transaction formatting

### 3. Smart Contract Layer

**Contract**: `CertificateRegistry.sol`

**Storage**:
```solidity
struct Certificate {
    bytes32 certificateHash;
    string studentId;
    string ipfsHash;
    bool revoked;
    uint256 issuedAt;
    address issuer;
}
```

**Access Control**: Only admin (deployer) can issue/revoke

**Events**:
- `CertificateIssued` - Emitted on issuance
- `CertificateRevoked` - Emitted on revocation

### 4. Storage Layer

**Blockchain**: Ethereum Sepolia Testnet
- Stores certificate metadata
- Immutable record
- Public verification

**IPFS**: Pinata Service
- Stores actual PDF files
- Content-addressed storage
- Decentralized access

## Data Flow

### Certificate Issuance Flow

```
1. Admin uploads PDF file
   ↓
2. Frontend sends file to /api/upload
   ↓
3. API uploads to Pinata IPFS
   ↓
4. Pinata returns IPFS CID
   ↓
5. Frontend computes file hash (keccak256)
   ↓
6. Frontend calls issueCertificate() on smart contract
   ↓
7. Smart contract stores: hash + studentId + IPFS CID
   ↓
8. Transaction confirmed on blockchain
   ↓
9. CertificateIssued event emitted
```

### Certificate Verification Flow

```
1. Verifier uploads file OR enters hash
   ↓
2. If file: compute hash using keccak256
   ↓
3. Call verifyCertificate(hash) on smart contract
   ↓
4. Smart contract returns:
   - exists (bool)
   - revoked (bool)
   - ipfsHash (string)
   - studentId (string)
   - issuedAt (uint256)
   ↓
5. Display verification result
```

## Security Model

### Smart Contract Security
- Access control via `onlyAdmin` modifier
- Input validation on all functions
- Event logging for audit trail
- Immutable certificate records

### Frontend Security
- Client-side hashing (no file upload to blockchain)
- Environment variable protection
- HTTPS enforcement
- CORS configuration

### IPFS Security
- JWT authentication for uploads
- Content addressing (tamper-proof)
- Pin status monitoring

## Scalability Considerations

### Current Limitations
- Single admin address
- Sepolia testnet only
- No batch operations
- No certificate metadata search

### Future Improvements
- Multi-signature admin
- Mainnet deployment
- Batch issuance
- Off-chain indexing (The Graph)
- Layer 2 integration (Polygon, Arbitrum)

## Technology Choices

### Why Next.js?
- Server-side rendering for SEO
- API routes for IPFS integration
- Built-in optimization
- TypeScript support

### Why wagmi + viem?
- Type-safe Web3 interactions
- React hooks integration
- Modern, maintained libraries
- Better than legacy web3.js

### Why Foundry?
- Fast Solidity testing
- Built-in deployment scripts
- Gas optimization tools
- Modern development experience

### Why IPFS?
- Decentralized storage
- Content addressing
- Censorship resistant
- Cost-effective

### Why Sepolia?
- Active testnet
- Faucet availability
- Etherscan support
- Production-like environment

## Performance Metrics

### Smart Contract
- Deployment: ~1.5M gas
- Issue certificate: ~150k gas
- Revoke certificate: ~50k gas
- Verify certificate: Free (view function)

### Frontend
- Initial load: <2s
- IPFS upload: 2-5s (depends on file size)
- Transaction confirmation: 15-30s (Sepolia block time)

## Monitoring & Logging

### Blockchain Events
- Monitor via Etherscan
- Event indexing possible with The Graph
- Transaction history tracking

### IPFS Pins
- Pinata dashboard monitoring
- Pin status API
- Storage usage tracking

### Frontend
- Console logging for debugging
- Error boundaries for React
- Transaction status tracking

## Deployment Architecture

### Development
```
Local Machine
├── Foundry (local blockchain)
├── Next.js dev server
└── MetaMask (localhost)
```

### Staging/Production
```
Vercel (Frontend)
├── Environment variables
├── API routes
└── Static assets

Sepolia Testnet (Blockchain)
├── Smart contract
└── Transaction history

Pinata (IPFS)
└── Certificate files
```

## Cost Analysis

### Development (Free)
- Sepolia testnet ETH
- Pinata free tier (1GB)
- Vercel free tier

### Production (Estimated)
- Mainnet deployment: $50-100
- Per certificate: $5-10
- IPFS storage: $20/month
- Hosting: $0-20/month

## Future Enhancements

1. **Multi-institution support**
2. **Batch operations**
3. **Advanced search**
4. **Email notifications**
5. **Mobile app**
6. **NFT certificates**
7. **Credential revocation lists**
8. **Zero-knowledge proofs**
