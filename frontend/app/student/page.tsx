'use client';

import { useState } from 'react';
import { useReadContract } from 'wagmi';
import { CONTRACT_ADDRESS, CONTRACT_ABI } from '@/lib/contract';
import { getIPFSUrl } from '@/lib/ipfs';
import QRCode from 'qrcode';

export default function StudentPage() {
  const [certHash, setCertHash] = useState('');
  const [qrCodeUrl, setQrCodeUrl] = useState('');

  const { data, isLoading, error, refetch } = useReadContract({
    address: CONTRACT_ADDRESS,
    abi: CONTRACT_ABI,
    functionName: 'verifyCertificate',
    args: certHash ? [certHash as `0x${string}`] : undefined,
    query: {
      enabled: false,
    },
  });

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!certHash) return;
    setQrCodeUrl(''); // Reset QR code
    refetch();
  };

  const generateQRCode = async () => {
    const verifyUrl = `${window.location.origin}/verify?hash=${certHash}`;
    try {
      const qr = await QRCode.toDataURL(verifyUrl, {
        width: 300,
        margin: 2,
        color: {
          dark: '#1f2937',
          light: '#ffffff',
        },
      });
      setQrCodeUrl(qr);
    } catch (err) {
      console.error('Error generating QR code:', err);
    }
  };

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    alert(`${label} copied to clipboard!`);
  };

  const certificateData = data as [boolean, boolean, string, string, bigint] | undefined;
  const exists = certificateData?.[0];
  const revoked = certificateData?.[1];
  const ipfsHash = certificateData?.[2];
  const studentId = certificateData?.[3];
  const issuedAt = certificateData?.[4];

  return (
    <div className="max-w-4xl mx-auto animate-fade-in px-4">
      {/* Header */}
      <div className="mb-6 sm:mb-8">
        <div className="flex items-center space-x-3 mb-3 sm:mb-4">
          <div className="w-10 h-10 sm:w-12 sm:h-12 gradient-success rounded-xl flex items-center justify-center flex-shrink-0">
            <svg className="w-5 h-5 sm:w-6 sm:h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
          </div>
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">Student Portal</h1>
            <p className="text-sm sm:text-base text-gray-600">View and share your certificates</p>
          </div>
        </div>
      </div>

      {/* Search Form */}
      <form onSubmit={handleSearch} className="mb-6 sm:mb-8">
        <div className="bg-white rounded-2xl shadow-lg p-4 sm:p-6 border border-gray-100">
          <label className="block text-sm font-semibold mb-2 sm:mb-3 text-gray-700">Certificate Hash</label>
          <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
            <input
              type="text"
              value={certHash}
              onChange={(e) => setCertHash(e.target.value)}
              className="flex-1 border-2 border-gray-200 rounded-xl px-3 sm:px-4 py-2.5 sm:py-3 font-mono text-xs sm:text-sm focus:border-green-500 focus:ring-2 focus:ring-green-200 transition-all outline-none"
              placeholder="0x..."
              required
            />
            <button
              type="submit"
              disabled={!certHash || isLoading}
              className="bg-gradient-to-r from-green-500 to-emerald-500 text-white px-6 sm:px-8 py-2.5 sm:py-3 rounded-xl hover:shadow-lg transition-all disabled:opacity-50 font-semibold text-sm sm:text-base whitespace-nowrap"
            >
              {isLoading ? '🔍 Searching...' : '🔍 Search'}
            </button>
          </div>
        </div>
      </form>

      {/* Error State */}
      {error && (
        <div className="bg-red-50 border-2 border-red-200 rounded-2xl p-4 sm:p-6 animate-fade-in">
          <p className="text-red-800 font-medium text-sm sm:text-base">Error loading certificate</p>
        </div>
      )}

      {/* Certificate Found */}
      {exists && (
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden animate-fade-in">
          {/* Status Header */}
          <div className={`p-4 sm:p-6 ${revoked ? 'bg-gradient-to-r from-red-500 to-pink-500' : 'bg-gradient-to-r from-green-500 to-emerald-500'}`}>
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <div className="text-white">
                <h2 className="text-xl sm:text-2xl font-bold mb-1">Certificate Details</h2>
                <p className="text-white/90 text-sm sm:text-base">Student ID: {studentId}</p>
              </div>
              <div className={`px-4 sm:px-6 py-2 sm:py-3 rounded-xl font-bold text-sm sm:text-lg ${revoked ? 'bg-red-700' : 'bg-green-700'} text-white text-center`}>
                {revoked ? '❌ REVOKED' : '✓ VALID'}
              </div>
            </div>
          </div>

          {/* Certificate Info */}
          <div className="p-4 sm:p-8 space-y-4 sm:space-y-6">
            {/* Info Grid */}
            <div className="grid sm:grid-cols-2 gap-3 sm:gap-6">
              <div className="bg-gray-50 rounded-xl p-3 sm:p-4">
                <p className="text-xs sm:text-sm font-semibold text-gray-600 mb-1 sm:mb-2">Student ID</p>
                <p className="text-base sm:text-lg font-bold text-gray-800">{studentId}</p>
              </div>

              <div className="bg-gray-50 rounded-xl p-3 sm:p-4">
                <p className="text-xs sm:text-sm font-semibold text-gray-600 mb-1 sm:mb-2">Issued Date</p>
                <p className="text-base sm:text-lg font-bold text-gray-800">
                  {new Date(Number(issuedAt) * 1000).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric',
                  })}
                </p>
              </div>
            </div>

            {/* Certificate Hash */}
            <div className="bg-gray-50 rounded-xl p-3 sm:p-4">
              <div className="flex items-center justify-between mb-2">
                <p className="text-xs sm:text-sm font-semibold text-gray-600">Certificate Hash</p>
                <button
                  onClick={() => copyToClipboard(certHash, 'Hash')}
                  className="text-blue-600 hover:text-blue-800 text-xs sm:text-sm font-medium"
                >
                  📋 Copy
                </button>
              </div>
              <p className="font-mono text-xs break-all text-gray-800">{certHash}</p>
            </div>

            {/* IPFS Document */}
            <div className="bg-gradient-to-r from-blue-50 to-cyan-50 rounded-xl p-3 sm:p-4 border-2 border-blue-200">
              <p className="text-xs sm:text-sm font-semibold text-gray-700 mb-2">📄 IPFS Document</p>
              <a
                href={getIPFSUrl(ipfsHash || '')}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:text-blue-800 font-medium hover:underline inline-flex items-center text-sm sm:text-base"
              >
                View Certificate PDF
                <svg className="w-3 h-3 sm:w-4 sm:h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
              </a>
            </div>

            {/* Action Buttons */}
            <div className="grid sm:grid-cols-2 gap-3 sm:gap-4">
              <button
                onClick={generateQRCode}
                className="bg-gradient-to-r from-purple-600 to-blue-600 text-white py-3 rounded-xl hover:shadow-lg transition-all font-semibold text-sm sm:text-base flex items-center justify-center"
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z" />
                </svg>
                Generate QR Code
              </button>

              <button
                onClick={() => {
                  const verifyUrl = `${window.location.origin}/verify?hash=${certHash}`;
                  copyToClipboard(verifyUrl, 'Verification link');
                }}
                className="bg-gradient-to-r from-cyan-500 to-blue-500 text-white py-3 rounded-xl hover:shadow-lg transition-all font-semibold text-sm sm:text-base flex items-center justify-center"
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
                Copy Verify Link
              </button>
            </div>

            {/* QR Code Display */}
            {qrCodeUrl && (
              <div className="text-center bg-gradient-to-br from-purple-50 to-blue-50 rounded-xl p-4 sm:p-6 animate-fade-in border-2 border-purple-200">
                <p className="text-sm sm:text-base font-semibold text-gray-700 mb-3 sm:mb-4">
                  📱 Share this QR code for instant verification
                </p>
                <div className="inline-block bg-white p-3 sm:p-4 rounded-xl shadow-lg">
                  <img src={qrCodeUrl} alt="QR Code" className="w-48 h-48 sm:w-64 sm:h-64 mx-auto" />
                </div>
                <p className="text-xs sm:text-sm text-gray-600 mt-3 sm:mt-4">
                  Scan with any QR code reader to verify
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Certificate Not Found */}
      {certificateData && !exists && (
        <div className="bg-yellow-50 border-2 border-yellow-200 rounded-2xl p-6 sm:p-8 text-center animate-fade-in">
          <div className="w-12 h-12 sm:w-16 sm:h-16 bg-yellow-200 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4">
            <svg className="w-6 h-6 sm:w-8 sm:h-8 text-yellow-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <h3 className="text-lg sm:text-xl font-bold text-yellow-800 mb-2">Certificate Not Found</h3>
          <p className="text-sm sm:text-base text-yellow-700">This certificate hash does not exist in the registry</p>
        </div>
      )}
    </div>
  );
}
