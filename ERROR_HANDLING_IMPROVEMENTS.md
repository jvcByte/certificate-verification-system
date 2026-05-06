# Error Handling Improvements

## Problem Summary

When attempting to issue a certificate that already exists on Base Sepolia, the RPC endpoint returns a generic error message "exceeds max transaction gas limit" instead of decoding the custom error `CertificateAlreadyExists()`. This made it difficult to provide users with specific, actionable error messages.

## Root Cause

Base Sepolia RPC (and many other RPC providers) sometimes fail to decode custom Solidity errors, returning generic messages instead. When viem receives these responses, the `ContractFunctionRevertedError.data.errorName` field is empty, making it impossible to determine the actual error from the transaction alone.

## Solution Implemented

### 1. Pre-Transaction Validation

Instead of relying solely on post-transaction error decoding, we now **validate conditions before submitting transactions** by calling view functions:

#### Issue Certificate Page (`frontend/app/admin/issue/page.tsx`)
- Check if certificate already exists using `certificateExists(certHash)`
- Verify user has admin privileges using `isAdmin(address)`
- Show specific error messages before wallet interaction

#### Revoke Certificate Page (`frontend/app/admin/revoke/page.tsx`)
- Check if certificate exists using `certificateExists(certHash)`
- Check if certificate is already revoked by reading `certificates(certHash).revoked`
- Verify user has admin privileges using `isAdmin(address)`

#### Admin Management Page (`frontend/app/admin/admins/page.tsx`)
- Check if address is already an admin before adding
- Check if address is an admin before removing
- Prevent owner from removing their own admin role

### 2. Improved Error Parsing

Updated `frontend/lib/errors.ts`:
- Removed excessive console logging (cleaner production code)
- Improved error message extraction from viem error objects
- Better handling of "exceeds max transaction gas limit" fallback
- Prioritized checking for known error names in messages

### 3. Centralized Error Handling

All admin pages now use:
- `useContractWriteWithError()` custom hook for consistent error handling
- `parseWeb3Error()` function to convert technical errors to user-friendly messages
- `ErrorDisplay` component for consistent error UI
- Pre-validation using `publicClient.readContract()` before write operations

### 4. Removed Unused Code

- Removed complex transaction receipt error decoding (no longer needed with pre-validation)
- Removed unused imports (`decodeErrorResult`, `React` namespace)
- Cleaned up console.log statements

## Benefits

1. **Better UX**: Users see specific error messages (e.g., "Certificate Already Exists") instead of generic blockchain errors
2. **Faster Feedback**: Errors are caught before wallet interaction, saving gas and time
3. **Consistent Behavior**: All admin pages follow the same error handling pattern
4. **Maintainable**: Centralized error parsing logic in one place
5. **Production Ready**: Removed debug logging, cleaner code

## Error Messages Now Shown

- ✅ Certificate Already Exists
- ✅ Certificate Not Found
- ✅ Already Revoked
- ✅ Unauthorized Access (Not Admin)
- ✅ Owner Only
- ✅ Already an Admin
- ✅ Not an Admin
- ✅ Invalid Student ID
- ✅ Invalid File Type/Size
- ✅ Invalid Hash Format
- ✅ Invalid Address Format
- ✅ User Rejected Transaction
- ✅ Insufficient Funds
- ✅ Network Errors
- ✅ Wrong Network

## Files Modified

1. `frontend/app/admin/issue/page.tsx` - Added pre-validation, cleaned up logging
2. `frontend/app/admin/revoke/page.tsx` - Added pre-validation for revoke operations
3. `frontend/app/admin/admins/page.tsx` - Added pre-validation for admin management
4. `frontend/lib/errors.ts` - Improved error parsing, removed console logs
5. `frontend/hooks/useContractWrite.ts` - Removed debug logging

## Testing Recommendations

1. Try issuing the same certificate twice - should see "Certificate Already Exists" immediately
2. Try revoking a non-existent certificate - should see "Certificate Not Found"
3. Try revoking an already revoked certificate - should see "Already Revoked"
4. Try admin operations without admin privileges - should see "Unauthorized Access"
5. Try adding an address that's already an admin - should see "Already an Admin"
6. Try removing an address that's not an admin - should see "Not an Admin"

All errors should appear **before** the wallet popup, providing instant feedback.
