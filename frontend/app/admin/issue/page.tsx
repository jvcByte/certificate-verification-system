'use client';

import { useState } from 'react';
import { useAccount, useWaitForTransactionReceipt, usePublicClient } from 'wagmi';
import { WalletConnect } from '@/components/WalletConnect';
import { ErrorDisplay } from '@/components/ErrorDisplay';
import { CONTRACT_ADDRESS, CONTRACT_ABI } from '@/lib/contract';
import { hashFile } from '@/lib/hash';
import { uploadToIPFS, getIPFSUrl } from '@/lib/ipfs';
import { validateFile, validateStudentId, parseWeb3Error } from '@/lib/errors';
import { useContractWriteWithError } from '@/hooks/useContractWrite';

export default function IssueCertificatePage() {
  const { isConnected, address } = useAccount();
  const publicClient = usePublicClient();
  const [file, setFile] = useState<File | null>(null);
  const [studentId, setStudentId] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [ipfsHash, setIpfsHash] = useState('');
  const [certHash, setCertHash] = useState<`0x${string}` | null>(null);

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

  // Watch for transaction receipt
  const { data: receipt } = useWaitForTransactionReceipt({ hash });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      
      const validationError = validateFile(selectedFile);
      if (validationError) {
        setError(validationError);
        return;
      }

      setFile(selectedFile);
      clearError();
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    clearError();

    // Validation
    if (!file) {
      setError({
        title: 'No File Selected',
        message: 'Please select a certificate file to upload.',
      });
      return;
    }

    const studentIdError = validateStudentId(studentId);
    if (studentIdError) {
      setError(studentIdError);
      return;
    }

    if (!isConnected || !address) {
      setError({
        title: 'Wallet Not Connected',
        message: 'Please connect your wallet to continue.',
      });
      return;
    }

    try {
      setIsUploading(true);

      // Upload to IPFS
      let ipfsCid: string;
      try {
        ipfsCid = await uploadToIPFS(file);
        setIpfsHash(ipfsCid);
      } catch (err) {
        console.error('IPFS upload error:', err);
        throw new Error('Failed to upload certificate to IPFS. Please check your internet connection and try again.');
      }

      // Hash the file
      let fileHash: `0x${string}`;
      try {
        fileHash = await hashFile(file);
        setCertHash(fileHash);
      } catch (err) {
        console.error('File hash error:', err);
        throw new Error('Failed to generate certificate hash. Please try again.');
      }

      // Pre-validate: Check if certificate already exists
      if (publicClient) {
        try {
          const exists = await publicClient.readContract({
            address: CONTRACT_ADDRESS,
            abi: CONTRACT_ABI,
            functionName: 'certificateExists',
            args: [fileHash],
          });

          if (exists) {
            setError({
              title: 'Certificate Already Exists',
              message: 'This certificate has already been issued. Each certificate can only be issued once.',
              details: 'Try using a different certificate file or verify if this certificate was previously issued.',
            });
            return;
          }
        } catch (err) {
          console.error('Error checking certificate existence:', err);
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

      // Write to contract
      writeContract(
        {
          address: CONTRACT_ADDRESS,
          abi: CONTRACT_ABI,
          functionName: 'issueCertificate',
          args: [fileHash, studentId.trim(), ipfsCid],
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
      console.error('Error in handleSubmit:', err);
      setError({
        title: 'Upload Error',
        message: err instanceof Error ? err.message : 'An unexpected error occurred.',
      });
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
                  disabled={isUploading || isPending || isConfirming}
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
                    disabled={isUploading || isPending || isConfirming}
                  />
                  <label
                    htmlFor="file-input"
                    className={`flex items-center justify-center w-full border-2 border-dashed border-gray-300 rounded-xl px-6 py-8 cursor-pointer hover:border-purple-500 hover:bg-purple-50 transition-all ${
                      (isUploading || isPending || isConfirming) ? 'opacity-50 cursor-not-allowed' : ''
                    }`}
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
                          <p className="text-xs text-gray-500 mt-1">PDF files only (max 10MB)</p>
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
        <div className="mt-6">
          <ErrorDisplay error={error} onDismiss={clearError} />
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
                href={`https://sepolia.basescan.org/tx/${hash}`}
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
