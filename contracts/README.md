# CertificateRegistry — Contracts

Smart contract for issuing, revoking, and verifying academic certificates on Ethereum.

Built with [Foundry](https://book.getfoundry.sh/).

---

## Prerequisites

- [Foundry](https://book.getfoundry.sh/getting-started/installation) installed
- MetaMask wallet with Sepolia ETH ([faucet](https://sepoliafaucet.com))
- Infura (or any Sepolia RPC) API key
- Etherscan API key for verification

---

## Setup

### 1. Install dependencies

```shell
forge install
```

### 2. Configure environment

```shell
cp .env.example .env
```

Edit `.env` and fill in your values:

```env
PRIVATE_KEY=your_wallet_private_key
SEPOLIA_RPC_URL=https://sepolia.infura.io/v3/your_infura_key
ETHERSCAN_API_KEY=your_etherscan_api_key
```

Then load the variables into your shell:

```shell
source .env
```

---

## Build & Test

```shell
# Compile contracts
forge build

# Run all tests
forge test

# Run tests with verbose output
forge test -vvv

# Check test coverage
forge coverage
```

---

## Deploy to Sepolia

Uses `script/Deploy.s.sol`. The script reads `PRIVATE_KEY` from your environment, deploys the contract, and logs the deployed address.

```shell
forge script script/Deploy.s.sol:DeployScript \
  --rpc-url $SEPOLIA_RPC_URL \
  --broadcast \
  --verify \
  -vvvv
```

- `--broadcast` submits the transaction on-chain
- `--verify` automatically verifies the contract on Etherscan after deployment
- `-vvvv` shows full deployment logs including the deployed address

Save the deployed contract address from the output — you'll need it for the frontend `.env.local`.

> Broadcast artifacts are saved to `broadcast/Deploy.s.sol/11155111/run-latest.json`

---

## Verify an Already-Deployed Contract

If verification failed during deployment or you need to re-verify:

```shell
forge verify-contract <DEPLOYED_ADDRESS> \
  src/CertificateRegistry.sol:CertificateRegistry \
  --chain sepolia \
  --etherscan-api-key $ETHERSCAN_API_KEY \
  --watch
```

Replace `<DEPLOYED_ADDRESS>` with your contract address, e.g. `0x1715cE4942218709FCEa7D14B485c778E0A8cB9a`.

- `--watch` polls Etherscan until verification completes

---

## Admin Management

The contract uses a two-tier access model:
- **Owner** — the deployer. Can add/remove admins and transfer ownership.
- **Admins** — can issue and revoke certificates.

All admin management is done via `cast` using your owner private key.

### Add an admin

```shell
cast send <DEPLOYED_ADDRESS> \
  "addAdmin(address)" <NEW_ADMIN_ADDRESS> \
  --rpc-url $SEPOLIA_RPC_URL \
  --private-key $PRIVATE_KEY
```

### Remove an admin

```shell
cast send <DEPLOYED_ADDRESS> \
  "removeAdmin(address)" <ADMIN_ADDRESS> \
  --rpc-url $SEPOLIA_RPC_URL \
  --private-key $PRIVATE_KEY
```

### Check if an address is an admin

```shell
cast call <DEPLOYED_ADDRESS> \
  "isAdmin(address)" <ADDRESS> \
  --rpc-url $SEPOLIA_RPC_URL
```

### Transfer ownership

```shell
cast send <DEPLOYED_ADDRESS> \
  "transferOwnership(address)" <NEW_OWNER_ADDRESS> \
  --rpc-url $SEPOLIA_RPC_URL \
  --private-key $PRIVATE_KEY
```

> Transferring ownership automatically grants the new owner admin rights.

---

## Useful Commands

```shell
# Format code
forge fmt

# Gas snapshot
forge snapshot

# Start local node
anvil

# Deploy to local anvil node (for testing)
forge script script/Deploy.s.sol:DeployScript \
  --rpc-url http://localhost:8545 \
  --broadcast
```

---

## Contract Functions

| Function | Access | Description |
|---|---|---|
| `issueCertificate(bytes32, string, string)` | Admin | Issue a new certificate |
| `revokeCertificate(bytes32)` | Admin | Revoke an existing certificate |
| `verifyCertificate(bytes32)` | Public | Verify a certificate by hash |
| `getCertificate(bytes32)` | Public | Get full certificate data |
| `addAdmin(address)` | Owner | Grant admin role |
| `removeAdmin(address)` | Owner | Revoke admin role |
| `transferOwnership(address)` | Owner | Transfer contract ownership |
| `isAdmin(address)` | Public | Check if address is admin |

---

## Resources

- [Foundry Book](https://book.getfoundry.sh)
- [Sepolia Etherscan](https://sepolia.etherscan.io)
- [Sepolia Faucet](https://sepoliafaucet.com)
