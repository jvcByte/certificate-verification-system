'use client';

import { getIPFSUrl } from '@/lib/ipfs';

interface CertificateData {
  exists: boolean;
  revoked: boolean;
  ipfsHash: string;
  studentId: string;
  issuedAt: bigint;
}

interface CertificateVerifierProps {
  data: CertificateData;
  certHash: string;
}

export function CertificateVerifier({ data, certHash }: CertificateVerifierProps) {
  const { exists, revoked, ipfsHash, studentId, issuedAt } = data;

  if (!exists) {
    return (
      <div className="bg-red-50 border-2 border-red-500 rounded-lg p-6 text-center">
        <div className="text-4xl mb-2">❌</div>
        <h3 className="text-xl font-bold text-red-800 mb-2">
          Certificate Not Found
        </h3>
        <p className="text-red-700">
          This certificate does not exist in the blockchain registry.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white border-2 rounded-lg p-6 shadow-lg">
      <div className="text-center mb-6">
        {revoked ? (
          <div className="inline-block bg-red-100 border-2 border-red-500 rounded-full px-8 py-4">
            <div className="text-4xl mb-1">❌</div>
            <span className="text-2xl font-bold text-red-800">REVOKED</span>
          </div>
        ) : (
          <div className="inline-block bg-green-100 border-2 border-green-500 rounded-full px-8 py-4">
            <div className="text-4xl mb-1">✓</div>
            <span className="text-2xl font-bold text-green-800">VALID</span>
          </div>
        )}
      </div>

      <div className="space-y-4">
        <div className="border-t pt-4">
          <h4 className="text-sm font-medium text-gray-500 mb-1">Student ID</h4>
          <p className="text-lg font-semibold">{studentId}</p>
        </div>

        <div>
          <h4 className="text-sm font-medium text-gray-500 mb-1">Issued Date</h4>
          <p className="text-lg">
            {new Date(Number(issuedAt) * 1000).toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
              hour: '2-digit',
              minute: '2-digit',
            })}
          </p>
        </div>

        <div>
          <h4 className="text-sm font-medium text-gray-500 mb-1">
            Certificate Hash
          </h4>
          <p className="font-mono text-sm bg-gray-50 p-3 rounded break-all">
            {certHash}
          </p>
        </div>

        <div>
          <h4 className="text-sm font-medium text-gray-500 mb-1">
            Original Document
          </h4>
          <a
            href={getIPFSUrl(ipfsHash)}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center text-blue-600 hover:text-blue-800 hover:underline"
          >
            <svg
              className="w-5 h-5 mr-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
              />
            </svg>
            View Certificate on IPFS
          </a>
        </div>
      </div>

      {revoked && (
        <div className="mt-6 bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-start">
            <svg
              className="w-5 h-5 text-red-600 mt-0.5 mr-2"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                clipRule="evenodd"
              />
            </svg>
            <div>
              <h5 className="font-semibold text-red-800">Warning</h5>
              <p className="text-sm text-red-700 mt-1">
                This certificate has been revoked by the issuing authority and is
                no longer valid.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
