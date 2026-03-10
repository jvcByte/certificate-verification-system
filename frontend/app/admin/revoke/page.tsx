'use client';

import { useState } from 'react';
import { useAccount, useWriteContract, useWaitForTransactionReceipt } from 'wagmi';
import { WalletConnect } from '@/components/WalletConnect';
import { CONTRACT_ADDRESS, CONTRACT_ABI } from '@/lib/contract';

export default function RevokeCertificatePage() {
  const { isConnected } = useAccount();
  const [certHash, setCertHash] = useState('');

  const { writeContract, data: hash, isPending, error } = useWriteContract();
  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({ hash });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!certHash) return;

    try {
      writeContract({
        address: CONTRACT_ADDRESS,
        abi: CONTRACT_ABI,
        functionName: 'revokeCertificate',
        args: [certHash as `0x${string}`],
      });
    } catch (err) {
      console.error('Error revoking certificate:', err);
      alert('Failed to revoke certificate. Check console for details.');
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
              />
              <p className="text-sm text-gray-500 mt-2">
                Enter the certificate hash you want to revoke
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

      {error && (
        <div className="mt-6 bg-red-50 border-2 border-red-200 rounded-2xl p-6 animate-fade-in">
          <div className="flex items-start space-x-3">
            <svg className="w-6 h-6 text-red-600 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
            <div>
              <h3 className="font-semibold text-red-800 mb-1">Error</h3>
              <p className="text-red-700 text-sm">{error.message}</p>
            </div>
          </div>
        </div>
      )}

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
              href={`https://sepolia.etherscan.io/tx/${hash}`}
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
