'use client';

import { useState } from 'react';
import { useAccount, useWriteContract, useWaitForTransactionReceipt } from 'wagmi';
import { WalletConnect } from '@/components/WalletConnect';
import { CONTRACT_ADDRESS, CONTRACT_ABI } from '@/lib/contract';
import { hashFile } from '@/lib/hash';
import { uploadToIPFS, getIPFSUrl } from '@/lib/ipfs';

export default function IssueCertificatePage() {
  const { isConnected } = useAccount();
  const [file, setFile] = useState<File | null>(null);
  const [studentId, setStudentId] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [ipfsHash, setIpfsHash] = useState('');
  const [certHash, setCertHash] = useState<`0x${string}` | null>(null);

  const { writeContract, data: hash, isPending, error } = useWriteContract();
  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({ hash });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file || !studentId) return;

    try {
      setIsUploading(true);

      const ipfsCid = await uploadToIPFS(file);
      setIpfsHash(ipfsCid);

      const fileHash = await hashFile(file);
      setCertHash(fileHash);

      writeContract({
        address: CONTRACT_ADDRESS,
        abi: CONTRACT_ABI,
        functionName: 'issueCertificate',
        args: [fileHash, studentId, ipfsCid],
      });
    } catch (err) {
      console.error('Error issuing certificate:', err);
      alert('Failed to issue certificate. Check console for details.');
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto animate-fade-in">
      <div className="mb-8">
        <div className="flex items-center space-x-3 mb-4">
          <div className="w-12 h-12 gradient-primary rounded-xl flex items-center justify-center">
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-800">Issue Certificate</h1>
            <p className="text-gray-600">Upload and register a new certificate on the blockchain</p>
          </div>
        </div>
      </div>

      <WalletConnect />

      {isConnected && (
        <form onSubmit={handleSubmit} className="mt-8 space-y-6">
          <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100">
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-semibold mb-3 text-gray-700">Student ID</label>
                <input
                  type="text"
                  value={studentId}
                  onChange={(e) => setStudentId(e.target.value)}
                  className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition-all outline-none"
                  placeholder="e.g., STU123456"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-semibold mb-3 text-gray-700">Certificate File (PDF)</label>
                <div className="relative">
                  <input
                    type="file"
                    accept=".pdf"
                    onChange={handleFileChange}
                    className="hidden"
                    id="file-input"
                    required
                  />
                  <label
                    htmlFor="file-input"
                    className="flex items-center justify-center w-full border-2 border-dashed border-gray-300 rounded-xl px-6 py-8 cursor-pointer hover:border-purple-500 hover:bg-purple-50 transition-all"
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
                          <p className="text-sm font-medium text-gray-700">Click to upload or drag and drop</p>
                          <p className="text-xs text-gray-500 mt-1">PDF files only</p>
                        </>
                      )}
                    </div>
                  </label>
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={!file || !studentId || isUploading || isPending || isConfirming}
              className="w-full mt-8 bg-gradient-to-r from-purple-600 to-blue-600 text-white py-4 rounded-xl hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed font-semibold text-lg"
            >
              {isUploading
                ? '📤 Uploading to IPFS...'
                : isPending
                ? '⏳ Waiting for approval...'
                : isConfirming
                ? '⏳ Confirming transaction...'
                : '🚀 Issue Certificate'}
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
            <h3 className="text-2xl font-bold text-green-800 mb-2">Certificate Issued Successfully!</h3>
            <p className="text-green-700">The certificate has been registered on the blockchain</p>
          </div>
          
          <div className="space-y-4">
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
            
            <div className="bg-white rounded-xl p-4">
              <p className="text-sm font-semibold text-gray-600 mb-2">Certificate Hash</p>
              <p className="font-mono text-sm break-all text-gray-800">{certHash}</p>
            </div>
            
            <div className="bg-white rounded-xl p-4">
              <p className="text-sm font-semibold text-gray-600 mb-2">IPFS Document</p>
              <a
                href={getIPFSUrl(ipfsHash || '')}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:text-blue-800 text-sm break-all hover:underline"
              >
                {ipfsHash}
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
