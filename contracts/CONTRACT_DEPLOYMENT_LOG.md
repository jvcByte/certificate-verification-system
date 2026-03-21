# ======================================================================
#                                        First Deployement
# ======================================================================


== Logs ==

  CertificateRegistry deployed to: 0x1715cE4942218709FCEa7D14B485c778E0A8cB9a

## Setting up 1 EVM.

==========================

Chain 11155111

Estimated gas price: 0.001000018 gwei

Estimated total gas used for script: 1802171

Estimated amount required: 0.000001802203439078 ETH

==========================

##### sepolia
✅  [Success] Hash: 0xfcf70118a806b421728f0eaefade1be4c07dd7411ba2088fc84da0a60c17e84f
Contract Address: 0x1715cE4942218709FCEa7D14B485c778E0A8cB9a
Block: 10423614
Paid: 0.000001386298476574 ETH (1386286 gas * 0.001000009 gwei)

✅ Sequence #1 on sepolia | Total Paid: 0.000001386298476574 ETH (1386286 gas * avg 0.001000009 gwei)
                                                                                                                                                                               

==========================

ONCHAIN EXECUTION COMPLETE & SUCCESSFUL.
##
Start verification for (1) contracts

Start verifying contract `0x1715cE4942218709FCEa7D14B485c778E0A8cB9a` deployed on sepolia

EVM version: shanghai

Compiler version: 0.8.20

Submitting verification for [src/CertificateRegistry.sol:CertificateRegistry] 0x1715cE4942218709FCEa7D14B485c778E0A8cB9a.

Warning: Could not detect the deployment.; waiting 5 seconds before trying again (4 tries remaining)

Submitting verification for [src/CertificateRegistry.sol:CertificateRegistry] 0x1715cE4942218709FCEa7D14B485c778E0A8cB9a.

Warning: Could not detect the deployment.; waiting 5 seconds before trying again (3 tries remaining)

Submitting verification for [src/CertificateRegistry.sol:CertificateRegistry] 0x1715cE4942218709FCEa7D14B485c778E0A8cB9a.

Warning: Could not detect the deployment.; waiting 5 seconds before trying again (2 tries remaining)

Submitting verification for [src/CertificateRegistry.sol:CertificateRegistry] 0x1715cE4942218709FCEa7D14B485c778E0A8cB9a.

Submitted contract for verification:

        Response: `OK`

        GUID: `vnny7rlugduxgi392syj1yeaca2d63t7s4qrnbpkrdxpxsxj8h`

        URL: https://sepolia.etherscan.io/address/0x1715ce4942218709fcea7d14b485c778e0a8cb9a

Contract verification status:
  
Response:  `NOTOK` 00:47

Details: `Pending in queue`

Warning: Verification is still pending...; waiting 15 seconds before trying again (7 tries remaining)

Contract verification status:

Response: `OK`

Details: `Pass - Verified`

Contract successfully verified

All (1) contracts were verified!

Transactions saved to: /home/jvcbyte/Downloads/skifi_cert_software/certificate-verification-system/contracts/broadcast/Deploy.s.sol/11155111/run-latest.json

Sensitive values saved to: /home/jvcbyte/Downloads/skifi_cert_software/certificate-verification-system/contracts/cache/Deploy.s.sol/11155111/run-latest.json


---
---
---
---
---
---
---
---
---
---
---
---
---
---
---
---
---
---


# ======================================================================
#                      Second Deployement
# ======================================================================


```bash
➜ 📁 contracts main 🔋69% 🖥 9% 🧠 49% ⬢ v22.17.1 🦀 1.94.0 🐹 1.25.7 
  :)-> source .env

➜ 📁 contracts main 🔋69% 🖥 9% 🧠 48% ⬢ v22.17.1 🦀 1.94.0 🐹 1.25.7 
  :)-> forge script script/Deploy.s.sol:DeployScript \
    --rpc-url $SEPOLIA_RPC_URL \
    --broadcast \
    --verify \
    -vvvv
```

```
[⠊] Compiling...
[⠃] Compiling 2 files with Solc 0.8.20
[⠊] Solc 0.8.20 finished in 795.16ms
Compiler run successful!
```

### Traces
```
[1584840] DeployScript::run()
├─ [0] VM::envUint("PRIVATE_KEY") [staticcall]
│   └─ ← [Return] <env var value>
├─ [0] VM::startBroadcast(<pk>)
│   └─ ← [Return]
├─ [1542937] → new CertificateRegistry@0x79be55726DF9f77304EA628Ee3E60a3B465f8684
│   ├─ emit AdminAdded(account: 0xBFb3FD95879D2819256feE1ae754D14C9641d10A)
│   └─ ← [Return] 7479 bytes of code
├─ [0] console::log("CertificateRegistry deployed to:", CertificateRegistry: [0x79be55726DF9f77304EA628Ee3E60a3B465f8684]) [staticcall]
│   └─ ← [Stop]
├─ [0] VM::stopBroadcast()
│   └─ ← [Return]
└─ ← [Stop]
```

---

## Script ran successfully

### Logs
```
CertificateRegistry deployed to: 0x79be55726DF9f77304EA628Ee3E60a3B465f8684
```

---

## Setting up 1 EVM

### Simulated On-chain Traces
```
[1542937] → new CertificateRegistry@0x79be55726DF9f77304EA628Ee3E60a3B465f8684
├─ emit AdminAdded(account: 0xBFb3FD95879D2819256feE1ae754D14C9641d10A)
└─ ← [Return] 7479 bytes of code
```

---

## Network Details
```
Chain: 11155111
Estimated gas price: 0.001000022 gwei
Estimated total gas used: 2227150
Estimated amount required: 0.0000022271989973 ETH
```

---

## Deployment (sepolia)
```
✅  [Success] Hash: 0x9722fd47173111a8318e14efe795fab36dea1b5aa0547ed95c0d004f92fd034e
Contract Address: 0x79be55726DF9f77304EA628Ee3E60a3B465f8684
Block: 10487130
Paid: 0.000001713211845123 ETH (1713193 gas * 0.001000011 gwei)

✅ Sequence #1 on sepolia | Total Paid: 0.000001713211845123 ETH
```

---

## Status
```
ONCHAIN EXECUTION COMPLETE & SUCCESSFUL
```

---

## Verification
```
Start verification for (1) contracts

Start verifying contract:
0x79be55726DF9f77304EA628Ee3E60a3B465f8684

EVM version: shanghai
Compiler version: 0.8.20
```

```
Submitting verification for:
[src/CertificateRegistry.sol:CertificateRegistry]

Warning: Could not detect the deployment; retrying...
```

```
Submitted contract for verification:
Response: OK
GUID: vlajphspzhlbtmq6tl5rmmjj88gz9spdw1fazjmlrnypuf2njs
URL: https://sepolia.etherscan.io/address/0x79be55726df9f77304ea628ee3e60a3b465f8684
```

### Result
```
Response: OK
Details: Pass - Verified

Contract successfully verified
All (1) contracts were verified!
```

---

## Output Files
```
Transactions saved to:
/home/jvcbyte/Sofwares/certificatechain.vercel.app/contracts/broadcast/Deploy.s.sol/11155111/run-latest.json

Sensitive values saved to:
/home/jvcbyte/Sofwares/certificatechain.vercel.app/contracts/cache/Deploy.s.sol/11155111/run-latest.json
```