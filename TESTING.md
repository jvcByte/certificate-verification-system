# Testing Guide

## Smart Contract Testing

### Running Tests

```bash
cd contracts
forge test
```

### Verbose Output
```bash
forge test -vvv
```

### Test Coverage
```bash
forge coverage
```

### Gas Report
```bash
forge test --gas-report
```

### Test Specific Function
```bash
forge test --match-test testIssueCertificate
```

### Test Structure

All tests are in `test/CertificateRegistry.t.sol`:

1. **testIssueCertificate** - Verify certificate issuance
2. **testCannotIssueDuplicateCertificate** - Prevent duplicates
3. **testOnlyAdminCanIssue** - Access control
4. **testRevokeCertificate** - Certificate revocation
5. **testCannotRevokeNonexistentCertificate** - Error handling
6. **testCannotRevokeAlreadyRevokedCertificate** - Prevent double revocation
7. **testOnlyAdminCanRevoke** - Access control
8. **testVerifyNonexistentCertificate** - Handle missing certificates

### Expected Output
```
Running 8 tests for test/CertificateRegistry.t.sol:CertificateRegistryTest
[PASS] testIssueCertificate() (gas: 123456)
[PASS] testCannotIssueDuplicateCertificate() (gas: 123456)
[PASS] testOnlyAdminCanIssue() (gas: 123456)
[PASS] testRevokeCertificate() (gas: 123456)
[PASS] testCannotRevokeNonexistentCertificate() (gas: 123456)
[PASS] testCannotRevokeAlreadyRevokedCertificate() (gas: 123456)
[PASS] testOnlyAdminCanRevoke() (gas: 123456)
[PASS] testVerifyNonexistentCertificate() (gas: 123456)
Test result: ok. 8 passed; 0 failed; finished in 10ms
```

## Frontend Testing

### Manual Testing Checklist

#### 1. Wallet Connection
- [ ] Connect MetaMask
- [ ] Switch to Sepolia network
- [ ] Display connected address
- [ ] Disconnect wallet

#### 2. Certificate Issuance
- [ ] Upload PDF file
- [ ] Enter student ID
- [ ] Submit transaction
- [ ] Approve in MetaMask
- [ ] Wait for confirmation
- [ ] Display transaction hash
- [ ] Display certificate hash
- [ ] Display IPFS link

#### 3. Certificate Revocation
- [ ] Enter certificate hash
- [ ] Submit transaction
- [ ] Approve in MetaMask
- [ ] Wait for confirmation
- [ ] Display success message

#### 4. Student View
- [ ] Enter certificate hash
- [ ] Display certificate details
- [ ] Show valid/revoked status
- [ ] Generate QR code
- [ ] Copy verification link
- [ ] Open IPFS document

#### 5. Certificate Verification
- [ ] Upload certificate file
- [ ] Compute hash automatically
- [ ] Enter hash manually
- [ ] Display verification result
- [ ] Show valid certificate
- [ ] Show revoked certificate
- [ ] Show not found message

### Test Scenarios

#### Scenario 1: Happy Path
1. Admin issues certificate
2. Student views certificate
3. Verifier confirms validity
4. Admin revokes certificate
5. Verifier sees revoked status

#### Scenario 2: Invalid Certificate
1. Verifier enters random hash
2. System shows "not found"

#### Scenario 3: Non-Admin Access
1. Non-admin tries to issue
2. Transaction fails
3. Error message displayed

#### Scenario 4: Duplicate Certificate
1. Admin issues certificate
2. Admin tries to issue same hash
3. Transaction fails
4. Error message displayed

## Integration Testing

### End-to-End Test

```bash
# Terminal 1: Start frontend
cd frontend
npm run dev

# Terminal 2: Test flow
# 1. Open http://localhost:3000
# 2. Connect MetaMask
# 3. Issue test certificate
# 4. Copy certificate hash
# 5. Verify certificate
# 6. Revoke certificate
# 7. Re-verify (should show revoked)
```

### API Testing

Test IPFS upload endpoint:

```bash
curl -X POST http://localhost:3000/api/upload \
  -H "Content-Type: multipart/form-data" \
  -F "file=@test.pdf"
```

Expected response:
```json
{
  "ipfsHash": "QmXxx...",
  "pinSize": 12345,
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

## Performance Testing

### Smart Contract Gas Usage

```bash
forge test --gas-report
```

Expected gas costs:
- Deploy: ~1,500,000 gas
- Issue: ~150,000 gas
- Revoke: ~50,000 gas
- Verify: 0 gas (view function)

### Frontend Performance

Use Chrome DevTools:
1. Open Network tab
2. Measure page load time
3. Check bundle size
4. Monitor API response times

Target metrics:
- Initial load: <2s
- Time to interactive: <3s
- Bundle size: <500KB

## Security Testing

### Smart Contract Security

```bash
# Static analysis with Slither
pip install slither-analyzer
slither contracts/src/CertificateRegistry.sol
```

### Manual Security Checks

- [ ] Access control enforced
- [ ] Input validation present
- [ ] No reentrancy vulnerabilities
- [ ] Events emitted correctly
- [ ] Gas optimization applied

### Frontend Security

- [ ] Environment variables not exposed
- [ ] No private keys in code
- [ ] HTTPS enforced
- [ ] Input sanitization
- [ ] XSS prevention

## Regression Testing

After any changes, run:

```bash
# Smart contract tests
cd contracts
forge test

# Build frontend
cd ../frontend
npm run build

# Check for TypeScript errors
npm run lint
```

## Test Data

### Sample Student IDs
- STU001
- STU002
- TEST123

### Sample Certificate Hashes
Generate with:
```bash
cast keccak "test-certificate-1"
```

## Continuous Integration

### GitHub Actions Example

```yaml
name: Tests
on: [push, pull_request]
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Install Foundry
        uses: foundry-rs/foundry-toolchain@v1
      - name: Run tests
        run: |
          cd contracts
          forge test
```

## Troubleshooting Tests

### Test Failures

**"Insufficient funds"**
- Check test account has ETH
- Use `vm.deal()` in tests

**"Transaction reverted"**
- Check access control
- Verify input parameters
- Review error messages

**"RPC error"**
- Check RPC URL
- Verify network connection
- Try different RPC provider

### Frontend Test Issues

**"Cannot connect wallet"**
- Install MetaMask
- Switch to Sepolia
- Unlock wallet

**"IPFS upload fails"**
- Check Pinata JWT
- Verify file size
- Check API limits

## Test Reports

Generate test report:

```bash
forge test --json > test-report.json
```

View coverage report:

```bash
forge coverage --report lcov
genhtml lcov.info -o coverage
open coverage/index.html
```

## Best Practices

1. Run tests before every commit
2. Test on Sepolia before mainnet
3. Use test fixtures for consistency
4. Mock external dependencies
5. Test edge cases
6. Document test scenarios
7. Keep tests fast
8. Use descriptive test names
