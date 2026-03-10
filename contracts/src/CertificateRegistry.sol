// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract CertificateRegistry {
    struct Certificate {
        bytes32 certificateHash;
        string studentId;
        string ipfsHash;
        bool revoked;
        uint256 issuedAt;
        address issuer;
    }

    mapping(bytes32 => Certificate) public certificates;
    mapping(bytes32 => bool) public certificateExists;
    
    address public admin;

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

    modifier onlyAdmin() {
        require(msg.sender == admin, "Only admin can perform this action");
        _;
    }

    constructor() {
        admin = msg.sender;
    }

    function issueCertificate(
        bytes32 certHash,
        string memory studentId,
        string memory ipfsHash
    ) external onlyAdmin {
        require(!certificateExists[certHash], "Certificate already exists");
        require(bytes(studentId).length > 0, "Student ID cannot be empty");
        require(bytes(ipfsHash).length > 0, "IPFS hash cannot be empty");

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

    function revokeCertificate(bytes32 certHash) external onlyAdmin {
        require(certificateExists[certHash], "Certificate does not exist");
        require(!certificates[certHash].revoked, "Certificate already revoked");

        certificates[certHash].revoked = true;

        emit CertificateRevoked(certHash, block.timestamp);
    }

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

    function getCertificate(bytes32 certHash)
        external
        view
        returns (Certificate memory)
    {
        require(certificateExists[certHash], "Certificate does not exist");
        return certificates[certHash];
    }
}
