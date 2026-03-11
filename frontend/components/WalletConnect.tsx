'use client';

import { useAccount, useConnect, useDisconnect } from 'wagmi';

export function WalletConnect() {
  const { address, isConnected } = useAccount();
  const { connect, connectors } = useConnect();
  const { disconnect } = useDisconnect();

  if (isConnected && address) {
    return (
      <div className="bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-200 rounded-2xl p-4 sm:p-6 shadow-lg">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4">
          <div className="flex items-center space-x-3 sm:space-x-4 w-full sm:w-auto">
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center flex-shrink-0">
              <svg className="w-5 h-5 sm:w-6 sm:h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-xs sm:text-sm font-medium text-gray-600">Connected Wallet</p>
              <p className="font-mono text-xs sm:text-sm font-semibold text-gray-800 truncate">{address.slice(0, 6)}...{address.slice(-4)}</p>
            </div>
          </div>
          <button
            onClick={() => disconnect()}
            className="w-full sm:w-auto bg-white border-2 border-red-200 text-red-600 px-4 sm:px-6 py-2 rounded-xl hover:bg-red-50 transition-all font-medium text-sm"
          >
            Disconnect
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-r from-yellow-50 to-orange-50 border-2 border-yellow-200 rounded-2xl p-4 sm:p-6 shadow-lg">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4">
        <div className="flex items-center space-x-3 sm:space-x-4">
          <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-full flex items-center justify-center flex-shrink-0">
            <svg className="w-5 h-5 sm:w-6 sm:h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </div>
          <div>
            <p className="text-xs sm:text-sm font-medium text-gray-600">Wallet Required</p>
            <p className="text-xs sm:text-sm text-gray-500">Connect to continue</p>
          </div>
        </div>
        {connectors.map((connector) => (
          <button
            key={connector.id}
            onClick={() => connect({ connector })}
            className="w-full sm:w-auto bg-gradient-to-r from-purple-600 to-blue-600 text-white px-4 sm:px-6 py-2.5 sm:py-3 rounded-xl hover:shadow-lg transition-all font-medium text-sm"
          >
            Connect {connector.name}
          </button>
        ))}
      </div>
    </div>
  );
}
