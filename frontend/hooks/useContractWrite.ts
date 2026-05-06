import { useState, useEffect } from 'react';
import { useAccount, useWriteContract, useWaitForTransactionReceipt } from 'wagmi';
import { ErrorState, parseWeb3Error } from '@/lib/errors';

/**
 * Custom hook that wraps wagmi's useWriteContract with error handling
 */
export function useContractWriteWithError() {
  const { address } = useAccount();
  const [errorState, setErrorState] = useState<ErrorState | null>(null);
  
  const { 
    writeContract, 
    data: hash, 
    isPending, 
    error: contractError, 
    reset 
  } = useWriteContract();
  
  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({ hash });

  // Parse contract errors when they occur
  const displayError = contractError 
    ? parseWeb3Error(contractError, address) 
    : errorState;

  const clearError = () => {
    setErrorState(null);
    reset();
  };

  const setError = (error: ErrorState) => {
    setErrorState(error);
  };

  return {
    writeContract,
    hash,
    isPending,
    isConfirming,
    isSuccess,
    error: displayError,
    setError,
    clearError,
    reset,
  };
}
