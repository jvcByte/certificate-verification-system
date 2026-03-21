'use client';

import { useState } from 'react';
import { useAccount, useReadContract, useWriteContract, useWaitForTransactionReceipt } from 'wagmi';
import { isAddress } from 'viem';
import { WalletConnect } from '@/components/WalletConnect';
import { CONTRACT_ADDRESS, CONTRACT_ABI } from '@/lib/contract';

type Action = 'add' | 'remove' | 'transfer';

export default function AdminManagementPage() {
  const { address, isConnected } = useAccount();
  const [targetAddress, setTargetAddress] = useState('');
  const [checkAddress, setCheckAddress] = useState('');
  const [action, setAction] = useState<Action>('add');

  const { writeContract, data: txHash, isPending, error, reset } = useWriteContract();
  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({ hash: txHash });

  // Read owner
  const { data: owner } = useReadContract({
    address: CONTRACT_ADDRESS,
    abi: CONTRACT_ABI,
    functionName: 'owner',
  });

  // Check if connected wallet is owner
  const isOwner = address && owner && address.toLowerCase() === (owner as string).toLowerCase();

  // Check role of a queried address
  const { data: isCheckedAdmin, refetch: refetchCheck } = useReadContract({
    address: CONTRACT_ADDRESS,
    abi: CONTRACT_ABI,
    functionName: 'isAdmin',
    args: isAddress(checkAddress) ? [checkAddress as `0x${string}`] : undefined,
    query: { enabled: isAddress(checkAddress) },
  });

  const addressValid = isAddress(targetAddress);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!addressValid) return;
    reset();

    const fnMap: Record<Action, 'addAdmin' | 'removeAdmin' | 'transferOwnership'> = {
      add: 'addAdmin',
      remove: 'removeAdmin',
      transfer: 'transferOwnership',
    };

    writeContract({
      address: CONTRACT_ADDRESS,
      abi: CONTRACT_ABI,
      functionName: fnMap[action],
      args: [targetAddress as `0x${string}`],
    });
  };

  const actionConfig = {
    add: {
      label: 'Add Admin',
      description: 'Grant admin role to an address. Admins can issue and revoke certificates.',
      buttonClass: 'from-purple-600 to-blue-600',
      icon: (
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
          d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
      ),
    },
    remove: {
      label: 'Remove Admin',
      description: 'Revoke admin role from an address. They will no longer be able to issue or revoke certificates.',
      buttonClass: 'from-red-500 to-pink-500',
      icon: (
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
          d="M13 7a4 4 0 11-8 0 4 4 0 018 0zM9 14a6 6 0 00-6 6v1h12v-1a6 6 0 00-6-6zM21 12h-6" />
      ),
    },
    transfer: {
      label: 'Transfer Ownership',
      description: 'Transfer contract ownership to a new address. The new owner will also be granted admin rights.',
      buttonClass: 'from-orange-500 to-amber-500',
      icon: (
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
          d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
      ),
    },
  };

  const current = actionConfig[action];

  return (
    <div className="max-w-3xl mx-auto animate-fade-in">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center space-x-3 mb-4">
          <div className="w-12 h-12 gradient-primary rounded-xl flex items-center justify-center">
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-800">Admin Management</h1>
            <p className="text-gray-600">Manage admin roles and contract ownership</p>
          </div>
        </div>
      </div>

      <WalletConnect />

      {isConnected && (
        <>
          {/* Owner info */}
          <div className="mt-6 bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">Contract Owner</p>
            <p className="font-mono text-sm text-gray-800 break-all">{owner as string ?? '...'}</p>
            {isOwner ? (
              <span className="inline-block mt-2 px-3 py-1 bg-purple-100 text-purple-700 text-xs font-semibold rounded-full">
                You are the owner
              </span>
            ) : (
              <span className="inline-block mt-2 px-3 py-1 bg-gray-100 text-gray-500 text-xs font-semibold rounded-full">
                Owner-only actions are disabled
              </span>
            )}
          </div>

          {/* Not owner warning */}
          {!isOwner && (
            <div className="mt-4 bg-yellow-50 border-2 border-yellow-200 rounded-2xl p-4">
              <div className="flex items-start space-x-3">
                <svg className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
                <p className="text-yellow-800 text-sm">
                  Only the contract owner can add/remove admins or transfer ownership. Connect with the owner wallet to proceed.
                </p>
              </div>
            </div>
          )}

          {/* Action selector */}
          <div className="mt-6 grid grid-cols-3 gap-3">
            {(Object.keys(actionConfig) as Action[]).map((a) => (
              <button
                key={a}
                onClick={() => { setAction(a); reset(); }}
                className={`py-3 px-4 rounded-xl border-2 text-sm font-semibold transition-all ${
                  action === a
                    ? 'border-purple-500 bg-purple-50 text-purple-700'
                    : 'border-gray-200 bg-white text-gray-600 hover:border-gray-300'
                }`}
              >
                {actionConfig[a].label}
              </button>
            ))}
          </div>

          {/* Action form */}
          <form onSubmit={handleSubmit} className="mt-4">
            <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100">
              <p className="text-sm text-gray-500 mb-6">{current.description}</p>

              {action === 'transfer' && (
                <div className="bg-orange-50 border-2 border-orange-200 rounded-xl p-4 mb-6">
                  <div className="flex items-start space-x-3">
                    <svg className="w-5 h-5 text-orange-600 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                    <p className="text-orange-800 text-sm font-medium">
                      Warning: This is irreversible. You will lose owner privileges immediately after this transaction confirms.
                    </p>
                  </div>
                </div>
              )}

              <div>
                <label className="block text-sm font-semibold mb-3 text-gray-700">
                  {action === 'transfer' ? 'New Owner Address' : 'Admin Address'}
                </label>
                <input
                  type="text"
                  value={targetAddress}
                  onChange={(e) => setTargetAddress(e.target.value)}
                  className={`w-full border-2 rounded-xl px-4 py-3 font-mono text-sm transition-all outline-none ${
                    targetAddress && !addressValid
                      ? 'border-red-400 focus:ring-2 focus:ring-red-200'
                      : 'border-gray-200 focus:border-purple-500 focus:ring-2 focus:ring-purple-200'
                  }`}
                  placeholder="0x..."
                  required
                />
                {targetAddress && !addressValid && (
                  <p className="text-red-500 text-xs mt-2">Invalid Ethereum address</p>
                )}
              </div>

              <button
                type="submit"
                disabled={!addressValid || !isOwner || isPending || isConfirming}
                className={`w-full mt-6 bg-gradient-to-r ${current.buttonClass} text-white py-4 rounded-xl hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed font-semibold text-base`}
              >
                <span className="flex items-center justify-center space-x-2">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    {current.icon}
                  </svg>
                  <span>
                    {isPending ? 'Waiting for approval...' : isConfirming ? 'Confirming...' : current.label}
                  </span>
                </span>
              </button>
            </div>
          </form>

          {/* Error */}
          {error && (
            <div className="mt-6 bg-red-50 border-2 border-red-200 rounded-2xl p-6 animate-fade-in">
              <div className="flex items-start space-x-3">
                <svg className="w-6 h-6 text-red-600 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
                <div>
                  <h3 className="font-semibold text-red-800 mb-1">Transaction Failed</h3>
                  <p className="text-red-700 text-sm">{error.message}</p>
                </div>
              </div>
            </div>
          )}

          {/* Success */}
          {isSuccess && (
            <div className="mt-6 bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-200 rounded-2xl p-8 animate-fade-in shadow-lg">
              <div className="text-center mb-4">
                <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-green-800 mb-1">{current.label} Successful</h3>
                <p className="text-green-700 text-sm">The transaction has been confirmed on the blockchain.</p>
              </div>
              <div className="bg-white rounded-xl p-4">
                <p className="text-xs font-semibold text-gray-500 mb-1">Transaction Hash</p>
                <a
                  href={`https://sepolia.etherscan.io/tx/${txHash}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:text-blue-800 font-mono text-xs break-all hover:underline"
                >
                  {txHash}
                </a>
              </div>
            </div>
          )}

          {/* Check role section */}
          <div className="mt-8 bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <h2 className="text-base font-bold text-gray-800 mb-4">Check Admin Role</h2>
            <div className="flex gap-3">
              <input
                type="text"
                value={checkAddress}
                onChange={(e) => setCheckAddress(e.target.value)}
                className="flex-1 border-2 border-gray-200 rounded-xl px-4 py-2.5 font-mono text-sm focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition-all outline-none"
                placeholder="0x..."
              />
              <button
                onClick={() => refetchCheck()}
                disabled={!isAddress(checkAddress)}
                className="px-5 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl text-sm font-medium transition-all disabled:opacity-40 disabled:cursor-not-allowed"
              >
                Check
              </button>
            </div>
            {isAddress(checkAddress) && isCheckedAdmin !== undefined && (
              <div className={`mt-3 px-4 py-3 rounded-xl text-sm font-medium ${
                isCheckedAdmin
                  ? 'bg-green-50 text-green-700 border border-green-200'
                  : 'bg-gray-50 text-gray-600 border border-gray-200'
              }`}>
                {isCheckedAdmin ? '✓ This address has admin role' : '✗ This address is not an admin'}
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}
