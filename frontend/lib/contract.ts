export const CONTRACT_ADDRESS = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS as `0x${string}`;

export const CONTRACT_ABI = [
  {
    type: "constructor",
    inputs: [],
    stateMutability: "nonpayable",
  },
  // ── Ownership ──────────────────────────────────────────────────────────────
  {
    type: "function",
    name: "owner",
    inputs: [],
    outputs: [{ name: "", type: "address", internalType: "address" }],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "transferOwnership",
    inputs: [{ name: "newOwner", type: "address", internalType: "address" }],
    outputs: [],
    stateMutability: "nonpayable",
  },
  // ── Admin Management ───────────────────────────────────────────────────────
  {
    type: "function",
    name: "addAdmin",
    inputs: [{ name: "account", type: "address", internalType: "address" }],
    outputs: [],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "removeAdmin",
    inputs: [{ name: "account", type: "address", internalType: "address" }],
    outputs: [],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "isAdmin",
    inputs: [{ name: "account", type: "address", internalType: "address" }],
    outputs: [{ name: "", type: "bool", internalType: "bool" }],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "admins",
    inputs: [{ name: "", type: "address", internalType: "address" }],
    outputs: [{ name: "", type: "bool", internalType: "bool" }],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "certificateExists",
    inputs: [{ name: "", type: "bytes32", internalType: "bytes32" }],
    outputs: [{ name: "", type: "bool", internalType: "bool" }],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "certificates",
    inputs: [{ name: "", type: "bytes32", internalType: "bytes32" }],
    outputs: [
      { name: "certificateHash", type: "bytes32", internalType: "bytes32" },
      { name: "studentId", type: "string", internalType: "string" },
      { name: "ipfsHash", type: "string", internalType: "string" },
      { name: "revoked", type: "bool", internalType: "bool" },
      { name: "issuedAt", type: "uint256", internalType: "uint256" },
      { name: "issuer", type: "address", internalType: "address" },
    ],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "getCertificate",
    inputs: [{ name: "certHash", type: "bytes32", internalType: "bytes32" }],
    outputs: [
      {
        name: "",
        type: "tuple",
        internalType: "struct CertificateRegistry.Certificate",
        components: [
          { name: "certificateHash", type: "bytes32", internalType: "bytes32" },
          { name: "studentId", type: "string", internalType: "string" },
          { name: "ipfsHash", type: "string", internalType: "string" },
          { name: "revoked", type: "bool", internalType: "bool" },
          { name: "issuedAt", type: "uint256", internalType: "uint256" },
          { name: "issuer", type: "address", internalType: "address" },
        ],
      },
    ],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "issueCertificate",
    inputs: [
      { name: "certHash", type: "bytes32", internalType: "bytes32" },
      { name: "studentId", type: "string", internalType: "string" },
      { name: "ipfsHash", type: "string", internalType: "string" },
    ],
    outputs: [],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "revokeCertificate",
    inputs: [{ name: "certHash", type: "bytes32", internalType: "bytes32" }],
    outputs: [],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "verifyCertificate",
    inputs: [{ name: "certHash", type: "bytes32", internalType: "bytes32" }],
    outputs: [
      { name: "exists", type: "bool", internalType: "bool" },
      { name: "revoked", type: "bool", internalType: "bool" },
      { name: "ipfsHash", type: "string", internalType: "string" },
      { name: "studentId", type: "string", internalType: "string" },
      { name: "issuedAt", type: "uint256", internalType: "uint256" },
    ],
    stateMutability: "view",
  },
  // ── Events ─────────────────────────────────────────────────────────────────
  {
    type: "event",
    name: "AdminAdded",
    inputs: [{ name: "account", type: "address", indexed: true, internalType: "address" }],
    anonymous: false,
  },
  {
    type: "event",
    name: "AdminRemoved",
    inputs: [{ name: "account", type: "address", indexed: true, internalType: "address" }],
    anonymous: false,
  },
  {
    type: "event",
    name: "OwnershipTransferred",
    inputs: [
      { name: "previousOwner", type: "address", indexed: true, internalType: "address" },
      { name: "newOwner", type: "address", indexed: true, internalType: "address" },
    ],
    anonymous: false,
  },
  {
    type: "event",
    name: "CertificateIssued",
    inputs: [
      { name: "certificateHash", type: "bytes32", indexed: true, internalType: "bytes32" },
      { name: "studentId", type: "string", indexed: false, internalType: "string" },
      { name: "ipfsHash", type: "string", indexed: false, internalType: "string" },
      { name: "issuedAt", type: "uint256", indexed: false, internalType: "uint256" },
      { name: "issuer", type: "address", indexed: false, internalType: "address" },
    ],
    anonymous: false,
  },
  {
    type: "event",
    name: "CertificateRevoked",
    inputs: [
      { name: "certificateHash", type: "bytes32", indexed: true, internalType: "bytes32" },
      { name: "revokedAt", type: "uint256", indexed: false, internalType: "uint256" },
    ],
    anonymous: false,
  },
] as const;
