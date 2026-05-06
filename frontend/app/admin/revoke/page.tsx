'use client';

import { useState } from 'react';
import { useAccount, usePublicClient } from 'wagmi';
import { WalletConnect } from '@/components/WalletConnect';
import { ErrorDisplay } from '@/components/ErrorDisplay';
import { CONTRACT_ADDRESS, CONTRACT_ABI } from '@/lib/contract';
import { validateCertHash, parseWeb3Error } from '@/lib/errors';
import { useContractWriteWithError } from '@/hooks/useContractWrite';

export default function RevokeCertificatePage() {
  const { isConnected, address } = useAccount();
  const publicClient = usePublicClient();
  const [certHash, setCertHash] = useState('');

  const { 
    writeContract, 
    hash, 
    isPending, 
    isConfirming, 
    isSuccess, 
    error, 
    setError, 
    clearError 
  } = useContractWriteWithError();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    clearError();

    const validationError = validateCertHash(certHash);
    if (validationError) {
      setError(validationError);
      return;
    }

    if (!isConnected || !address) {
      setError({
        title: 'Wallet Not Connected',
        message: 'Please connect your wallet to continue.',
      });
      return;
    }

    // Pre-validate: Check if certificate exists
    if (publicClient) {
      try {
        const exists = await publicClient.readContract({
          address: CONTRACT_ADDRESS,
          abi: CONTRACT_ABI,
          functionName: 'certificateExists',
          args: [certHash as `0x${string}`],
        });

        if (!exists) {
          setError({
            title: 'Certificate Not Found',
            message: 'No certificate exists with this hash.',
            details: 'Please verify the certificate hash and try again.',
          });
          return;
        }

        // Check if already revoked
        const cert = await publicClient.readContract({
          address: CONTRACT_ADDRESS,
          abi: CONTRACT_ABI,
          functionName: 'certificates',
          args: [certHash as `0x${string}`],
        });

        if (cert && (cert as any).revoked) {
          setError({
            title: 'Already Revoked',
            message: 'This certificate has already been revoked.',
          });
          return;
        }
      } catch (err) {
        console.error('Error checking certificate:', err);
        // Continue anyway - let the contract handle it
      }

      // Pre-validate: Check if user is admin
      try {
        const isUserAdmin = await publicClient.readContract({
          address: CONTRACT_ADDRESS,
          abi: CONTRACT_ABI,
          functionName: 'isAdmin',
          args: [address],
        });

        if (!isUserAdmin) {
          setError({
            title: 'Unauthorized Access',
            message: 'Your wallet address is not authorized to perform this action.',
            details: `Address: ${address}. Please contact the contract owner to grant admin privileges.`,
          });
          return;
        }
      } catch (err) {
        console.error('Error checking admin status:', err);
        // Continue anyway - let the contract handle it
      }
    }

    try {
      writeContract(
        {
          address: CONTRACT_ADDRESS,
          abi: CONTRACT_ABI,
          functionName: 'revokeCertificate',
          args: [certHash as `0x${string}`],
        },
        {
          onError: (error) => {
            console.error('Transaction error:', error);
            const parsedError = parseWeb3Error(error, address);
            setError(parsedError);
          },
        }
      );
    } catch (err) {
      console.error('Error revoking certificate:', err);
      setError({
        title: 'Revocation Error',
        message: err instanceof Error ? err.message : 'An unexpected error occurred.',
      });
    }
  };

  return (
    <div className="max-w-3xl mx-auto animate-fade-in">
      <div className="mb-8">
        <div className="flex items-center space-x-3 mb-4">
          <div className="w-12 h-12 gradient-danger rounded-xl flex items-center justify-center">
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
            </svg>
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-800">Revoke Certificate</h1>
            <p className="text-gray-600">Permanently revoke a certificate from the blockchain</p>
          </div>
        </div>
      </div>

      <WalletConnect />

      {isConnected && (
        <form onSubmit={handleSubmit} className="mt-8 space-y-6">
          <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100">
            <div className="bg-red-50 border-2 border-red-200 rounded-xl p-4 mb-6">
              <div className="flex items-start space-x-3">
                <svg className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
                <div>
                  <h3 className="font-semibold text-red-800 text-sm mb-1">Warning: This action is irreversible</h3>
                  <p className="text-red-700 text-sm">Once revoked, the certificate will be permanently marked as invalid on the blockchain.</p>
                </div>
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold mb-3 text-gray-700">Certificate Hash</label>
              <input
                type="text"
                value={certHash}
                onChange={(e) => setCertHash(e.target.value)}
                className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 font-mono text-sm focus:border-red-500 focus:ring-2 focus:ring-red-200 transition-all outline-none"
                placeholder="0x..."
                required
                disabled={isPending || isConfirming}
              />
              <p className="text-sm text-gray-500 mt-2">
                Enter the 32-byte certificate hash (66 characters including 0x prefix)
              </p>
            </div>

            <button
              type="submit"
              disabled={!certHash || isPending || isConfirming}
              className="w-full mt-8 bg-gradient-to-r from-red-500 to-pink-500 text-white py-4 rounded-xl hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed font-semibold text-lg"
            >
              {isPending
                ? '⏳ Waiting for approval...'
                : isConfirming
                ? '⏳ Confirming transaction...'
                : '🚫 Revoke Certificate'}
            </button>
          </div>
        </form>
      )}

      {error && <ErrorDisplay error={error} onDismiss={clearError} />}

      {isSuccess && (
        <div className="mt-6 bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-200 rounded-2xl p-8 animate-fade-in shadow-lg">
          <div className="text-center mb-6">
            <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h3 className="text-2xl font-bold text-green-800 mb-2">Certificate Revoked Successfully!</h3>
            <p className="text-green-700">The certificate has been marked as revoked on the blockchain</p>
          </div>
          
          <div className="bg-white rounded-xl p-4">
            <p className="text-sm font-semibold text-gray-600 mb-2">Transaction Hash</p>
            <a
              href={`https://sepolia.basescan.org/tx/${hash}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:text-blue-800 font-mono text-sm break-all hover:underline"
            >
              {hash}
            </a>
          </div>
        </div>
      )}
    </div>
  );
}
