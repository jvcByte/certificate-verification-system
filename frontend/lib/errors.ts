import { BaseError, ContractFunctionRevertedError, TransactionExecutionError } from 'viem';

export type ErrorState = {
  title: string;
  message: string;
  details?: string;
};

/**
 * Parse Web3/Contract errors into user-friendly messages
 */
export function parseWeb3Error(error: Error, userAddress?: string): ErrorState {
  if (error instanceof BaseError) {
    // Try to walk the error tree to find contract revert
    const revertError = error.walk((err) => err instanceof ContractFunctionRevertedError);
    
    if (revertError instanceof ContractFunctionRevertedError) {
      const errorName = revertError.data?.errorName ?? '';
      
      if (errorName) {
        return parseContractError(errorName, userAddress);
      }
      
      // Check if there's a reason field in the error
      const reason = (revertError as any).reason;
      
      // If errorName is empty but we have "exceeds max transaction gas limit",
      // it means the RPC couldn't decode the custom error. 
      // This usually happens when the actual error is a custom error but the RPC
      // returns a generic message.
      if (reason === 'exceeds max transaction gas limit' || 
          (revertError.message && revertError.message.includes('exceeds max transaction gas limit'))) {
        // Check the full error message for hints
        const fullMessage = error.message || '';
        const messageError = extractErrorFromMessage(fullMessage);
        if (messageError) {
          return parseContractError(messageError, userAddress);
        }
        
        // Return a helpful message
        return {
          title: 'Transaction Reverted',
          message: 'The smart contract rejected this transaction.',
          details: 'This usually means the certificate already exists, you don\'t have permission, or there\'s a validation error. Please check the transaction on the block explorer for more details.',
        };
      }
    }

    // Check if it's a TransactionExecutionError
    if (error instanceof TransactionExecutionError || error.name === 'TransactionExecutionError') {
      // Try to extract error from the cause chain
      let currentError: any = error;
      let depth = 0;
      while (currentError && depth < 10) {
        if (currentError instanceof ContractFunctionRevertedError) {
          const errorName = currentError.data?.errorName ?? '';
          if (errorName) {
            return parseContractError(errorName, userAddress);
          }
        }
        
        // Check message for known error patterns
        const errorMatch = extractErrorFromMessage(currentError.message || '');
        if (errorMatch) {
          return parseContractError(errorMatch, userAddress);
        }
        
        currentError = currentError.cause;
        depth++;
      }
    }

    // Check the error message for known patterns
    const messageError = extractErrorFromMessage(error.message);
    if (messageError) {
      return parseContractError(messageError, userAddress);
    }

    // Handle user rejection
    if (error.message.includes('User rejected') || error.message.includes('user rejected')) {
      return {
        title: 'Transaction Rejected',
        message: 'You rejected the transaction in your wallet.',
      };
    }

    // Handle insufficient funds
    if (error.message.includes('insufficient funds')) {
      return {
        title: 'Insufficient Funds',
        message: 'You do not have enough ETH to pay for gas fees.',
        details: 'Please add more ETH to your wallet and try again.',
      };
    }

    // Handle network errors
    if (error.message.includes('network') || error.message.includes('connection')) {
      return {
        title: 'Network Error',
        message: 'Unable to connect to the blockchain network.',
        details: 'Please check your internet connection and try again.',
      };
    }

    // Handle chain mismatch
    if (error.message.includes('chain')) {
      return {
        title: 'Wrong Network',
        message: 'Please switch to Base Sepolia network in your wallet.',
        details: 'The contract is deployed on Base Sepolia testnet.',
      };
    }
  }

  // Generic error fallback
  return {
    title: 'Transaction Failed',
    message: 'An unexpected error occurred while processing your transaction.',
    details: error.message,
  };
}

/**
 * Extract error name from error message
 */
function extractErrorFromMessage(message: string): string | null {
  // Check if message contains known error names directly (most reliable)
  const knownErrors = [
    'CertificateAlreadyExists',
    'CertificateNotFound', 
    'CertificateAlreadyRevoked',
    'NotAdmin',
    'NotOwner',
    'EmptyStudentId',
    'EmptyIpfsHash',
    'ZeroAddress',
    'AlreadyAdmin',
    'NotAnAdmin',
  ];

  for (const errorName of knownErrors) {
    if (message.includes(errorName)) {
      return errorName;
    }
  }

  // Try to match common error patterns
  const patterns = [
    /execution reverted:\s*(\w+)/i,
    /reverted with reason string '(\w+)'/i,
    /Error:\s*(\w+)/i,
    /(\w+)\(\)/i, // Match error function calls like "CertificateAlreadyExists()"
    /The contract function "\w+" reverted.*?(\w+Error|Already\w+|Not\w+|Empty\w+|Zero\w+)/i, // Match viem error messages
  ];

  for (const pattern of patterns) {
    const match = message.match(pattern);
    if (match && match[1]) {
      return match[1];
    }
  }

  return null;
}

/**
 * Parse contract error name into user-friendly message
 */
function parseContractError(errorName: string, userAddress?: string): ErrorState {
  switch (errorName) {
    case 'CertificateAlreadyExists':
      return {
        title: 'Certificate Already Exists',
        message: 'This certificate has already been issued. Each certificate can only be issued once.',
        details: 'Try using a different certificate file or verify if this certificate was previously issued.',
      };
    
    case 'CertificateNotFound':
      return {
        title: 'Certificate Not Found',
        message: 'No certificate exists with this hash.',
        details: 'Please verify the certificate hash and try again.',
      };
    
    case 'CertificateAlreadyRevoked':
      return {
        title: 'Already Revoked',
        message: 'This certificate has already been revoked.',
      };
    
    case 'NotAdmin':
      return {
        title: 'Unauthorized Access',
        message: 'Your wallet address is not authorized to perform this action.',
        details: userAddress 
          ? `Address: ${userAddress}. Please contact the contract owner to grant admin privileges.`
          : 'Please contact the contract owner to grant admin privileges.',
      };
    
    case 'NotOwner':
      return {
        title: 'Owner Only',
        message: 'Only the contract owner can perform this action.',
        details: userAddress ? `Your address: ${userAddress}` : undefined,
      };
    
    case 'EmptyStudentId':
      return {
        title: 'Invalid Student ID',
        message: 'Student ID cannot be empty.',
      };
    
    case 'EmptyIpfsHash':
      return {
        title: 'IPFS Upload Failed',
        message: 'The certificate file was not properly uploaded to IPFS.',
        details: 'Please try uploading the file again.',
      };
    
    case 'ZeroAddress':
      return {
        title: 'Invalid Address',
        message: 'Cannot use zero address (0x0000...).',
      };
    
    case 'AlreadyAdmin':
      return {
        title: 'Already an Admin',
        message: 'This address is already an admin.',
      };
    
    case 'NotAnAdmin':
      return {
        title: 'Not an Admin',
        message: 'This address is not an admin.',
      };
    
    default:
      return {
        title: 'Contract Error',
        message: errorName || 'An unknown contract error occurred.',
      };
  }
}

/**
 * Validate file upload
 */
export function validateFile(file: File): ErrorState | null {
  // Validate file type
  if (file.type !== 'application/pdf') {
    return {
      title: 'Invalid File Type',
      message: 'Please upload a PDF file only.',
    };
  }

  // Validate file size (max 10MB)
  const maxSize = 10 * 1024 * 1024;
  if (file.size > maxSize) {
    return {
      title: 'File Too Large',
      message: 'File size must be less than 10MB.',
      details: `Current size: ${(file.size / 1024 / 1024).toFixed(2)}MB`,
    };
  }

  return null;
}

/**
 * Validate certificate hash format
 */
export function validateCertHash(hash: string): ErrorState | null {
  if (!hash.trim()) {
    return {
      title: 'Certificate Hash Required',
      message: 'Please enter a certificate hash.',
    };
  }

  if (!hash.startsWith('0x')) {
    return {
      title: 'Invalid Hash Format',
      message: 'Certificate hash must start with 0x.',
      details: 'Example: 0x1234567890abcdef...',
    };
  }

  if (hash.length !== 66) {
    return {
      title: 'Invalid Hash Length',
      message: 'Certificate hash must be exactly 66 characters (including 0x prefix).',
      details: `Current length: ${hash.length} characters`,
    };
  }

  if (!/^0x[0-9a-fA-F]{64}$/.test(hash)) {
    return {
      title: 'Invalid Hash Format',
      message: 'Certificate hash must contain only hexadecimal characters.',
      details: 'Valid characters: 0-9, a-f, A-F',
    };
  }

  return null;
}

/**
 * Validate Ethereum address
 */
export function validateAddress(address: string): ErrorState | null {
  if (!address.trim()) {
    return {
      title: 'Address Required',
      message: 'Please enter an Ethereum address.',
    };
  }

  if (!address.startsWith('0x')) {
    return {
      title: 'Invalid Address Format',
      message: 'Address must start with 0x.',
    };
  }

  if (address.length !== 42) {
    return {
      title: 'Invalid Address Length',
      message: 'Address must be exactly 42 characters (including 0x prefix).',
      details: `Current length: ${address.length} characters`,
    };
  }

  if (!/^0x[0-9a-fA-F]{40}$/.test(address)) {
    return {
      title: 'Invalid Address Format',
      message: 'Address must contain only hexadecimal characters.',
      details: 'Valid characters: 0-9, a-f, A-F',
    };
  }

  return null;
}

/**
 * Validate student ID
 */
export function validateStudentId(studentId: string): ErrorState | null {
  if (!studentId.trim()) {
    return {
      title: 'Student ID Required',
      message: 'Please enter a student ID.',
    };
  }

  if (studentId.trim().length < 3) {
    return {
      title: 'Student ID Too Short',
      message: 'Student ID must be at least 3 characters long.',
    };
  }

  return null;
}
