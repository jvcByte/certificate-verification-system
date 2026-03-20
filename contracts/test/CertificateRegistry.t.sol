// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "forge-std/Test.sol";
import "../src/CertificateRegistry.sol";

contract CertificateRegistryTest is Test {
    CertificateRegistry public registry;

    address public owner;
    address public adminA;
    address public adminB;
    address public stranger;

    bytes32 public certHash = keccak256("test-certificate");
    string public studentId = "STU123456";
    string public ipfsHash = "QmTest123";

    event CertificateIssued(
        bytes32 indexed certificateHash,
        string studentId,
        string ipfsHash,
        uint256 issuedAt,
        address issuer
    );
    event CertificateRevoked(bytes32 indexed certificateHash, uint256 revokedAt);
    event AdminAdded(address indexed account);
    event AdminRemoved(address indexed account);
    event OwnershipTransferred(address indexed previousOwner, address indexed newOwner);

    function setUp() public {
        owner = address(this);
        adminA = makeAddr("adminA");
        adminB = makeAddr("adminB");
        stranger = makeAddr("stranger");
        registry = new CertificateRegistry();
    }

    // ─── Deployment ──────────────────────────────────────────────────────────────

    function test_DeployerIsOwner() public view {
        assertEq(registry.owner(), owner);
    }

    function test_DeployerIsAdmin() public view {
        assertTrue(registry.isAdmin(owner));
    }

    // ─── Admin Management ────────────────────────────────────────────────────────

    function test_OwnerCanAddAdmin() public {
        vm.expectEmit(true, false, false, false);
        emit AdminAdded(adminA);

        registry.addAdmin(adminA);
        assertTrue(registry.isAdmin(adminA));
    }

    function test_OwnerCanRemoveAdmin() public {
        registry.addAdmin(adminA);

        vm.expectEmit(true, false, false, false);
        emit AdminRemoved(adminA);

        registry.removeAdmin(adminA);
        assertFalse(registry.isAdmin(adminA));
    }

    function test_RevertWhen_NonOwnerAddsAdmin() public {
        vm.prank(stranger);
        vm.expectRevert(CertificateRegistry.NotOwner.selector);
        registry.addAdmin(adminA);
    }

    function test_RevertWhen_NonOwnerRemovesAdmin() public {
        registry.addAdmin(adminA);

        vm.prank(stranger);
        vm.expectRevert(CertificateRegistry.NotOwner.selector);
        registry.removeAdmin(adminA);
    }

    function test_RevertWhen_AddAdminZeroAddress() public {
        vm.expectRevert(CertificateRegistry.ZeroAddress.selector);
        registry.addAdmin(address(0));
    }

    function test_RevertWhen_AddAlreadyAdmin() public {
        registry.addAdmin(adminA);

        vm.expectRevert(CertificateRegistry.AlreadyAdmin.selector);
        registry.addAdmin(adminA);
    }

    function test_RevertWhen_RemoveNonAdmin() public {
        vm.expectRevert(CertificateRegistry.NotAnAdmin.selector);
        registry.removeAdmin(stranger);
    }

    function test_RevertWhen_OwnerRemovesOwnAdmin() public {
        vm.expectRevert(CertificateRegistry.NotOwner.selector);
        registry.removeAdmin(owner);
    }

    function test_AddedAdminCanIssueCertificate() public {
        registry.addAdmin(adminA);

        vm.prank(adminA);
        registry.issueCertificate(certHash, studentId, ipfsHash);

        (bool exists,,,,) = registry.verifyCertificate(certHash);
        assertTrue(exists);
    }

    function test_RemovedAdminCannotIssueCertificate() public {
        registry.addAdmin(adminA);
        registry.removeAdmin(adminA);

        vm.prank(adminA);
        vm.expectRevert(CertificateRegistry.NotAdmin.selector);
        registry.issueCertificate(certHash, studentId, ipfsHash);
    }

    // ─── Ownership Transfer ──────────────────────────────────────────────────────

    function test_OwnerCanTransferOwnership() public {
        vm.expectEmit(true, true, false, false);
        emit OwnershipTransferred(owner, adminA);

        registry.transferOwnership(adminA);
        assertEq(registry.owner(), adminA);
    }

    function test_TransferOwnershipGrantsAdminToNewOwner() public {
        registry.transferOwnership(adminA);
        assertTrue(registry.isAdmin(adminA));
    }

    function test_RevertWhen_TransferOwnershipToZeroAddress() public {
        vm.expectRevert(CertificateRegistry.ZeroAddress.selector);
        registry.transferOwnership(address(0));
    }

    function test_RevertWhen_NonOwnerTransfersOwnership() public {
        vm.prank(stranger);
        vm.expectRevert(CertificateRegistry.NotOwner.selector);
        registry.transferOwnership(stranger);
    }

    function test_OldOwnerCannotManageAdminsAfterTransfer() public {
        registry.transferOwnership(adminA);

        vm.expectRevert(CertificateRegistry.NotOwner.selector);
        registry.addAdmin(adminB);
    }

    // ─── Issue Certificate ───────────────────────────────────────────────────────

    function test_IssueCertificate() public {
        vm.expectEmit(true, false, false, true);
        emit CertificateIssued(certHash, studentId, ipfsHash, block.timestamp, owner);

        registry.issueCertificate(certHash, studentId, ipfsHash);

        (bool exists, bool revoked, string memory retIpfs, string memory retStudent, uint256 issuedAt) =
            registry.verifyCertificate(certHash);

        assertTrue(exists);
        assertFalse(revoked);
        assertEq(retIpfs, ipfsHash);
        assertEq(retStudent, studentId);
        assertEq(issuedAt, block.timestamp);
    }

    function test_IssueCertificate_StoresIssuerAddress() public {
        registry.addAdmin(adminA);

        vm.prank(adminA);
        registry.issueCertificate(certHash, studentId, ipfsHash);

        CertificateRegistry.Certificate memory cert = registry.getCertificate(certHash);
        assertEq(cert.issuer, adminA);
    }

    function test_RevertWhen_DuplicateCertificate() public {
        registry.issueCertificate(certHash, studentId, ipfsHash);

        vm.expectRevert(CertificateRegistry.CertificateAlreadyExists.selector);
        registry.issueCertificate(certHash, studentId, ipfsHash);
    }

    function test_RevertWhen_StrangerIssues() public {
        vm.prank(stranger);
        vm.expectRevert(CertificateRegistry.NotAdmin.selector);
        registry.issueCertificate(certHash, studentId, ipfsHash);
    }

    function test_RevertWhen_IssueEmptyStudentId() public {
        vm.expectRevert(CertificateRegistry.EmptyStudentId.selector);
        registry.issueCertificate(certHash, "", ipfsHash);
    }

    function test_RevertWhen_IssueEmptyIpfsHash() public {
        vm.expectRevert(CertificateRegistry.EmptyIpfsHash.selector);
        registry.issueCertificate(certHash, studentId, "");
    }

    // ─── Revoke Certificate ──────────────────────────────────────────────────────

    function test_RevokeCertificate() public {
        registry.issueCertificate(certHash, studentId, ipfsHash);

        vm.expectEmit(true, false, false, true);
        emit CertificateRevoked(certHash, block.timestamp);

        registry.revokeCertificate(certHash);

        (bool exists, bool revoked,,,) = registry.verifyCertificate(certHash);
        assertTrue(exists);
        assertTrue(revoked);
    }

    function test_RevertWhen_RevokeNonexistent() public {
        vm.expectRevert(CertificateRegistry.CertificateNotFound.selector);
        registry.revokeCertificate(certHash);
    }

    function test_RevertWhen_RevokeAlreadyRevoked() public {
        registry.issueCertificate(certHash, studentId, ipfsHash);
        registry.revokeCertificate(certHash);

        vm.expectRevert(CertificateRegistry.CertificateAlreadyRevoked.selector);
        registry.revokeCertificate(certHash);
    }

    function test_RevertWhen_StrangerRevokes() public {
        registry.issueCertificate(certHash, studentId, ipfsHash);

        vm.prank(stranger);
        vm.expectRevert(CertificateRegistry.NotAdmin.selector);
        registry.revokeCertificate(certHash);
    }

    // ─── Verify / Get Certificate ────────────────────────────────────────────────

    function test_VerifyNonexistentCertificate() public view {
        (bool exists,,,,) = registry.verifyCertificate(certHash);
        assertFalse(exists);
    }

    function test_GetCertificate() public {
        registry.issueCertificate(certHash, studentId, ipfsHash);

        CertificateRegistry.Certificate memory cert = registry.getCertificate(certHash);
        assertEq(cert.studentId, studentId);
        assertEq(cert.ipfsHash, ipfsHash);
        assertFalse(cert.revoked);
        assertEq(cert.issuer, owner);
    }

    function test_RevertWhen_GetNonexistentCertificate() public {
        vm.expectRevert(CertificateRegistry.CertificateNotFound.selector);
        registry.getCertificate(certHash);
    }

    // ─── Fuzz ────────────────────────────────────────────────────────────────────

    function testFuzz_IssueDifferentHashes(bytes32 hash1, bytes32 hash2) public {
        vm.assume(hash1 != hash2);

        registry.issueCertificate(hash1, studentId, ipfsHash);
        registry.issueCertificate(hash2, studentId, ipfsHash);

        (bool exists1,,,,) = registry.verifyCertificate(hash1);
        (bool exists2,,,,) = registry.verifyCertificate(hash2);

        assertTrue(exists1);
        assertTrue(exists2);
    }

    function testFuzz_OnlyOwnerCanAddAdmin(address caller) public {
        vm.assume(caller != owner);
        vm.assume(caller != address(0));

        vm.prank(caller);
        vm.expectRevert(CertificateRegistry.NotOwner.selector);
        registry.addAdmin(caller);
    }
}
