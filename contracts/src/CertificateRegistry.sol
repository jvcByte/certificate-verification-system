// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract CertificateRegistry {

    // ─── Structs ────────────────────────────────────────────────────────────────

    struct Certificate {
        bytes32 certificateHash;
        string studentId;
        string ipfsHash;
        bool revoked;
        uint256 issuedAt;
        address issuer;
    }

    // ─── State ──────────────────────────────────────────────────────────────────

    /// @notice The owner is the deployer and the only one who can manage admins.
    address public owner;

    /// @notice Admins can issue and revoke certificates.
    mapping(address => bool) public admins;

    mapping(bytes32 => Certificate) public certificates;
    mapping(bytes32 => bool) public certificateExists;

    // ─── Events ─────────────────────────────────────────────────────────────────

    event OwnershipTransferred(address indexed previousOwner, address indexed newOwner);
    event AdminAdded(address indexed account);
    event AdminRemoved(address indexed account);

    event CertificateIssued(
        bytes32 indexed certificateHash,
        string studentId,
        string ipfsHash,
        uint256 issuedAt,
        address issuer
    );

    event CertificateRevoked(
        bytes32 indexed certificateHash,
        uint256 revokedAt
    );

    // ─── Errors ─────────────────────────────────────────────────────────────────

    error NotOwner();
    error NotAdmin();
    error ZeroAddress();
    error AlreadyAdmin();
    error NotAnAdmin();
    error CertificateAlreadyExists();
    error CertificateNotFound();
    error CertificateAlreadyRevoked();
    error EmptyStudentId();
    error EmptyIpfsHash();

    // ─── Modifiers ───────────────────────────────────────────────────────────────

    modifier onlyOwner() {
        if (msg.sender != owner) revert NotOwner();
        _;
    }

    modifier onlyAdmin() {
        if (!admins[msg.sender]) revert NotAdmin();
        _;
    }

    // ─── Constructor ─────────────────────────────────────────────────────────────

    constructor() {
        owner = msg.sender;
        // Owner is also an admin by default
        admins[msg.sender] = true;
        emit AdminAdded(msg.sender);
    }

    // ─── Ownership ───────────────────────────────────────────────────────────────

    /// @notice Transfer ownership to a new address. New owner is also granted admin.
    /// @param newOwner The address to transfer ownership to.
    function transferOwnership(address newOwner) external onlyOwner {
        if (newOwner == address(0)) revert ZeroAddress();
        emit OwnershipTransferred(owner, newOwner);
        owner = newOwner;
        if (!admins[newOwner]) {
            admins[newOwner] = true;
            emit AdminAdded(newOwner);
        }
    }

    // ─── Admin Management (owner only) ───────────────────────────────────────────

    /// @notice Grant admin role to an address.
    /// @param account The address to grant admin to.
    function addAdmin(address account) external onlyOwner {
        if (account == address(0)) revert ZeroAddress();
        if (admins[account]) revert AlreadyAdmin();
        admins[account] = true;
        emit AdminAdded(account);
    }

    /// @notice Revoke admin role from an address. Owner cannot remove themselves.
    /// @param account The address to revoke admin from.
    function removeAdmin(address account) external onlyOwner {
        if (!admins[account]) revert NotAnAdmin();
        // Prevent owner from revoking their own admin role
        if (account == owner) revert NotOwner();
        admins[account] = false;
        emit AdminRemoved(account);
    }

    // ─── Certificate Operations (admin only) ─────────────────────────────────────

    /// @notice Issue a new certificate on-chain.
    function issueCertificate(
        bytes32 certHash,
        string memory studentId,
        string memory ipfsHash
    ) external onlyAdmin {
        if (certificateExists[certHash]) revert CertificateAlreadyExists();
        if (bytes(studentId).length == 0) revert EmptyStudentId();
        if (bytes(ipfsHash).length == 0) revert EmptyIpfsHash();

        certificates[certHash] = Certificate({
            certificateHash: certHash,
            studentId: studentId,
            ipfsHash: ipfsHash,
            revoked: false,
            issuedAt: block.timestamp,
            issuer: msg.sender
        });

        certificateExists[certHash] = true;

        emit CertificateIssued(certHash, studentId, ipfsHash, block.timestamp, msg.sender);
    }

    /// @notice Revoke an existing certificate.
    function revokeCertificate(bytes32 certHash) external onlyAdmin {
        if (!certificateExists[certHash]) revert CertificateNotFound();
        if (certificates[certHash].revoked) revert CertificateAlreadyRevoked();

        certificates[certHash].revoked = true;

        emit CertificateRevoked(certHash, block.timestamp);
    }

    // ─── Views ───────────────────────────────────────────────────────────────────

    /// @notice Verify a certificate by its hash.
    function verifyCertificate(bytes32 certHash)
        external
        view
        returns (
            bool exists,
            bool revoked,
            string memory ipfsHash,
            string memory studentId,
            uint256 issuedAt
        )
    {
        exists = certificateExists[certHash];
        if (exists) {
            Certificate memory cert = certificates[certHash];
            revoked = cert.revoked;
            ipfsHash = cert.ipfsHash;
            studentId = cert.studentId;
            issuedAt = cert.issuedAt;
        }
    }

    /// @notice Get full certificate data by hash.
    function getCertificate(bytes32 certHash)
        external
        view
        returns (Certificate memory)
    {
        if (!certificateExists[certHash]) revert CertificateNotFound();
        return certificates[certHash];
    }

    /// @notice Check if an address has admin role.
    function isAdmin(address account) external view returns (bool) {
        return admins[account];
    }
}
