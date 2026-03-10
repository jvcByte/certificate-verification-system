'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { useReadContract } from 'wagmi';
import { CONTRACT_ADDRESS, CONTRACT_ABI } from '@/lib/contract';
import { hashFile } from '@/lib/hash';
import { getIPFSUrl } from '@/lib/ipfs';

export default function VerifyPage() {
  const searchParams = useSearchParams();
  const [certHash, setCertHash] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [computedHash, setComputedHash] = useState<string>('');

  useEffect(() => {
    const hashFromUrl = searchParams.get('hash');
    if (hashFromUrl) {
      setCertHash(hashFromUrl);
    }
  }, [searchParams]);

  const { data, isLoading, error, refetch } = useReadContract({
    address: CONTRACT_ADDRESS,
    abi: CONTRACT_ABI,
    functionName: 'verifyCertificate',
    args: certHash ? [certHash as `0x${string}`] : undefined,
    query: {
      enabled: false,
    },
  });

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      setFile(selectedFile);
      
      const hash = await hashFile(selectedFile);
      setComputedHash(hash);
      setCertHash(hash);
    }
  };

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!certHash) return;
    refetch();
  };

  const certificateData = data as [boolean, boolean, string, string, bigint] | undefined;
  const exists = certificateData?.[0];
  const revoked = certificateData?.[1];
  const ipfsHash = certificateData?.[2];
  const studentId = certificateData?.[3];
  const issuedAt = certificateData?.[4];

  return (
    <div className="max-w-4xl mx-auto animate-fade-in">
      <div className="mb-8 text-center">
        <div className="flex items-center justify-center space-x-3 mb-4">
          <div className="w-14 h-14 gradient-info rounded-xl flex items-center justify-center">
            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div>
            <h1 className="text-4xl font-bold text-gray-800">Verify Certificate</h1>
            <p className="text-gray-600">Instantly verify certificate authenticity</p>
          </div>
        </div>
      </div>

      <div className="bg-gradient-to-r from-blue-50 to-cyan-50 border-2 border-blue-200 rounded-2xl p-6 mb-8">
        <div className="flex items-start space-x-3">
          <svg className="w-6 h-6 text-blue-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <p className="text-blue-800 font-medium">
            Upload a certificate file or enter its hash to verify authenticity on the blockchain
          </p>
        </div>
      </div>

      <form onSubmit={handleVerify} className="space-y-6 mb-8">
        <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100">
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-semibold mb-3 text-gray-700">
                Option 1: Upload Certificate File
              </label>
              <input
                type="file"
                accept=".pdf"
                onChange={handleFileChange}
                className="hidden"
                id="verify-file-input"
              />
              <label
                htmlFor="verify-file-input"
                className="flex items-center justify-center w-full border-2 border-dashed border-gray-300 rounded-xl px-6 py-8 cursor-pointer hover:border-blue-500 hover:bg-blue-50 transition-all"
              >
                <div className="text-center">
                  <svg className="w-12 h-12 text-gray-400 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                  </svg>
                  {file ? (
                    <p className="text-sm font-medium text-gray-700">
                      📄 {file.name}
                    </p>
                  ) : (
                    <>
                      <p className="text-sm font-medium text-gray-700">Click to upload certificate</p>
                      <p className="text-xs text-gray-500 mt-1">PDF files only</p>
                    </>
                  )}
                </div>
              </label>
              {computedHash && (
                <div className="mt-3 bg-blue-50 rounded-lg p-3">
                  <p className="text-xs font-semibold text-blue-700 mb-1">Computed Hash:</p>
                  <p className="font-mono text-xs text-blue-900 break-all">{computedHash}</p>
                </div>
              )}
            </div>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-4 bg-white text-gray-500 font-medium">OR</span>
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold mb-3 text-gray-700">
                Option 2: Enter Certificate Hash
              </label>
              <input
                type="text"
                value={certHash}
                onChange={(e) => setCertHash(e.target.value)}
                className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 font-mono text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all outline-none"
                placeholder="0x..."
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={!certHash || isLoading}
            className="w-full mt-8 bg-gradient-to-r from-cyan-500 to-blue-500 text-white py-4 rounded-xl hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed font-semibold text-lg"
          >
            {isLoading ? '🔍 Verifying...' : '🔍 Verify Certificate'}
          </button>
        </div>
      </form>

      {error && (
        <div className="bg-red-50 border-2 border-red-200 rounded-2xl p-6 animate-fade-in">
          <p className="text-red-800 font-medium">Error verifying certificate</p>
        </div>
      )}

      {certificateData && exists && (
        <div className="bg-white rounded-2xl shadow-2xl border-2 overflow-hidden animate-fade-in">
          <div className={`p-8 text-center ${revoked ? 'bg-gradient-to-r from-red-500 to-pink-500' : 'bg-gradient-to-r from-green-500 to-emerald-500'}`}>
            <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
              {revoked ? (
                <svg className="w-10 h-10 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg className="w-10 h-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                </svg>
              )}
            </div>
            <h2 className="text-4xl font-bold text-white mb-2">
              {revoked ? 'CERTIFICATE REVOKED' : 'CERTIFICATE VALID'}
            </h2>
            <p className="text-white/90 text-lg">
              {revoked ? 'This certificate has been revoked' : 'This certificate is authentic and verified'}
            </p>
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
                  {new Date(Number(issuedAt) * 1000).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}
                </p>
              </div>
            </div>

            <div className="bg-gray-50 rounded-xl p-4">
              <p className="text-sm font-semibold text-gray-600 mb-2">Certificate Hash</p>
              <p className="font-mono text-sm break-all text-gray-800">{certHash}</p>
            </div>

            <div className="bg-gradient-to-r from-blue-50 to-cyan-50 rounded-xl p-4 border-2 border-blue-200">
              <p className="text-sm font-semibold text-gray-700 mb-2">📄 Original Document</p>
              <a
                href={getIPFSUrl(ipfsHash || '')}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:text-blue-800 font-medium hover:underline inline-flex items-center"
              >
                View Certificate on IPFS
                <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
              </a>
            </div>

            {revoked && (
              <div className="bg-red-50 border-2 border-red-200 rounded-xl p-6">
                <div className="flex items-start space-x-3">
                  <svg className="w-6 h-6 text-red-600 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                  <div>
                    <h4 className="font-bold text-red-800 mb-1">⚠️ Warning</h4>
                    <p className="text-red-700 text-sm">
                      This certificate has been revoked by the issuing authority and is no longer valid.
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {certificateData && !exists && (
        <div className="bg-red-50 border-2 border-red-500 rounded-2xl p-12 text-center animate-fade-in shadow-lg">
          <div className="w-20 h-20 bg-red-200 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="w-10 h-10 text-red-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </div>
          <h2 className="text-3xl font-bold text-red-800 mb-3">CERTIFICATE NOT FOUND</h2>
          <p className="text-red-700 text-lg">
            This certificate does not exist in the blockchain registry.
          </p>
        </div>
      )}
    </div>
  );
}
