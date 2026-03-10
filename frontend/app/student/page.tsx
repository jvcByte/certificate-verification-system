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
    refetch();
  };

  const generateQRCode = async () => {
    const verifyUrl = `${window.location.origin}/verify?hash=${certHash}`;
    try {
      const qr = await QRCode.toDataURL(verifyUrl);
      setQrCodeUrl(qr);
    } catch (err) {
      console.error('Error generating QR code:', err);
    }
  };

  const certificateData = data as [boolean, boolean, string, string, bigint] | undefined;
  const exists = certificateData?.[0];
  const revoked = certificateData?.[1];
  const ipfsHash = certificateData?.[2];
  const studentId = certificateData?.[3];
  const issuedAt = certificateData?.[4];

  return (
    <div className="max-w-4xl mx-auto animate-fade-in">
      <div className="mb-8">
        <div className="flex items-center space-x-3 mb-4">
          <div className="w-12 h-12 gradient-success rounded-xl flex items-center justify-center">
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-800">Student Portal</h1>
            <p className="text-gray-600">View and share your verified certificates</p>
          </div>
        </div>
      </div>

      <form onSubmit={handleSearch} className="mb-8">
        <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
          <label className="block text-sm font-semibold mb-3 text-gray-700">Certificate Hash</label>
          <div className="flex gap-3">
            <input
              type="text"
              value={certHash}
              onChange={(e) => setCertHash(e.target.value)}
              className="flex-1 border-2 border-gray-200 rounded-xl px-4 py-3 font-mono text-sm focus:border-green-500 focus:ring-2 focus:ring-green-200 transition-all outline-none"
              placeholder="0x..."
              required
            />
            <button
              type="submit"
              disabled={!certHash || isLoading}
              className="bg-gradient-to-r from-green-500 to-emerald-500 text-white px-8 py-3 rounded-xl hover:shadow-lg transition-all disabled:opacity-50 font-semibold"
            >
              {isLoading ? '🔍 Searching...' : '🔍 Search'}
            </button>
          </div>
        </div>
      </form>

      {error && (
        <div className="bg-red-50 border-2 border-red-200 rounded-2xl p-6 animate-fade-in">
          <p className="text-red-800 font-medium">Error loading certificate</p>
        </div>
      )}

      {exists && (
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden animate-fade-in">
          <div className={`p-6 ${revoked ? 'bg-gradient-to-r from-red-500 to-pink-500' : 'bg-gradient-to-r from-green-500 to-emerald-500'}`}>
            <div className="flex items-center justify-between text-white">
              <div>
                <h2 className="text-2xl font-bold mb-1">Certificate Details</h2>
                <p className="text-white/90">Student ID: {studentId}</p>
              </div>
              <div className={`px-6 py-3 rounded-xl font-bold text-lg ${revoked ? 'bg-red-700' : 'bg-green-700'}`}>
                {revoked ? '❌ REVOKED' : '✓ VALID'}
              </div>
            </div>
          </div>

          <div className="p-8 space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-gray-50 rounded-xl p-4">
                <p className="text-sm font-semibold text-gray-600 mb-2">Student ID</p>
                <p className="text-lg font-bold text-gray-800">{studentId}</p>
              </div>

              <div className="bg-gray-50 rounded-xl p-4">
                <p className="text-sm font-semibold text-gray-600 mb-2">Issued Date</p>
                <p className="text-lg font-bold text-gray-800">
                  {new Date(Number(issuedAt) * 1000).toLocaleDateString()}
                </p>
              </div>
            </div>

            <div className="bg-gray-50 rounded-xl p-4">
              <p className="text-sm font-semibold text-gray-600 mb-2">Certificate Hash</p>
              <p className="font-mono text-sm break-all text-gray-800">{certHash}</p>
            </div>

            <div className="bg-gradient-to-r from-blue-50 to-cyan-50 rounded-xl p-4 border-2 border-blue-200">
              <p className="text-sm font-semibold text-gray-700 mb-2">📄 IPFS Document</p>
              <a
                href={getIPFSUrl(ipfsHash || '')}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:text-blue-800 font-medium hover:underline inline-flex items-center"
              >
                View Certificate PDF
                <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
              </a>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <button
                onClick={generateQRCode}
                className="bg-gradient-to-r from-purple-600 to-blue-600 text-white py-3 rounded-xl hover:shadow-lg transition-all font-semibold"
              >
                📱 Generate QR Code
              </button>

              <button
                onClick={() => {
                  const verifyUrl = `${window.location.origin}/verify?hash=${certHash}`;
                  navigator.clipboard.writeText(verifyUrl);
                  alert('Verification link copied to clipboard!');
                }}
                className="bg-gradient-to-r from-cyan-500 to-blue-500 text-white py-3 rounded-xl hover:shadow-lg transition-all font-semibold"
              >
                🔗 Copy Verification Link
              </button>
            </div>

            {qrCodeUrl && (
              <div className="text-center bg-gray-50 rounded-xl p-6 animate-fade-in">
                <p className="text-sm font-semibold text-gray-700 mb-4">
                  Share this QR code for instant verification
                </p>
                <img src={qrCodeUrl} alt="QR Code" className="mx-auto border-4 border-white shadow-lg rounded-xl" />
              </div>
            )}
          </div>
        </div>
      )}

      {certificateData && !exists && (
        <div className="bg-yellow-50 border-2 border-yellow-200 rounded-2xl p-8 text-center animate-fade-in">
          <div className="w-16 h-16 bg-yellow-200 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-yellow-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <h3 className="text-xl font-bold text-yellow-800 mb-2">Certificate Not Found</h3>
          <p className="text-yellow-700">This certificate hash does not exist in the registry</p>
        </div>
      )}
    </div>
  );
}
