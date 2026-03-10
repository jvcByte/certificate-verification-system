// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "forge-std/Test.sol";
import "../src/CertificateRegistry.sol";

contract CertificateRegistryTest is Test {
    CertificateRegistry public registry;
    address public admin;
    address public user;

    bytes32 public testHash = keccak256("test-certificate");
    string public testStudentId = "STU123456";
    string public testIpfsHash = "QmTest123";

    event CertificateIssued(
        bytes32 indexed certificateHash,
        string studentId,
        string ipfsHash,
        uint256 issuedAt,
        address issuer
    );

    event CertificateRevoked(bytes32 indexed certificateHash, uint256 revokedAt);

    function setUp() public {
        admin = address(this);
        user = address(0x1);
        registry = new CertificateRegistry();
    }

    function testIssueCertificate() public {
        vm.expectEmit(true, false, false, true);
        emit CertificateIssued(testHash, testStudentId, testIpfsHash, block.timestamp, admin);

        registry.issueCertificate(testHash, testStudentId, testIpfsHash);

        (bool exists, bool revoked, string memory ipfsHash, string memory studentId, uint256 issuedAt) =
            registry.verifyCertificate(testHash);

        assertTrue(exists);
        assertFalse(revoked);
        assertEq(ipfsHash, testIpfsHash);
        assertEq(studentId, testStudentId);
        assertEq(issuedAt, block.timestamp);
    }

    function testCannotIssueDuplicateCertificate() public {
        registry.issueCertificate(testHash, testStudentId, testIpfsHash);

        vm.expectRevert("Certificate already exists");
        registry.issueCertificate(testHash, testStudentId, testIpfsHash);
    }

    function testOnlyAdminCanIssue() public {
        vm.prank(user);
        vm.expectRevert("Only admin can perform this action");
        registry.issueCertificate(testHash, testStudentId, testIpfsHash);
    }

    function testRevokeCertificate() public {
        registry.issueCertificate(testHash, testStudentId, testIpfsHash);

        vm.expectEmit(true, false, false, true);
        emit CertificateRevoked(testHash, block.timestamp);

        registry.revokeCertificate(testHash);

        (bool exists, bool revoked,,,) = registry.verifyCertificate(testHash);
        assertTrue(exists);
        assertTrue(revoked);
    }

    function testCannotRevokeNonexistentCertificate() public {
        vm.expectRevert("Certificate does not exist");
        registry.revokeCertificate(testHash);
    }

    function testCannotRevokeAlreadyRevokedCertificate() public {
        registry.issueCertificate(testHash, testStudentId, testIpfsHash);
        registry.revokeCertificate(testHash);

        vm.expectRevert("Certificate already revoked");
        registry.revokeCertificate(testHash);
    }

    function testOnlyAdminCanRevoke() public {
        registry.issueCertificate(testHash, testStudentId, testIpfsHash);

        vm.prank(user);
        vm.expectRevert("Only admin can perform this action");
        registry.revokeCertificate(testHash);
    }

    function testVerifyNonexistentCertificate() public {
        (bool exists,,,,) = registry.verifyCertificate(testHash);
        assertFalse(exists);
    }
}
