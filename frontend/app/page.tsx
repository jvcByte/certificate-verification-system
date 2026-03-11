import Link from 'next/link';

export default function Home() {
  return (
    <div className="max-w-6xl mx-auto animate-fade-in">
      {/* Hero Section */}
      <div className="text-center mb-8 sm:mb-16">
        <div className="inline-block mb-3 sm:mb-4">
          <span className="px-3 sm:px-4 py-1.5 sm:py-2 bg-purple-100 text-purple-700 rounded-full text-xs sm:text-sm font-semibold">
            🔐 Blockchain-Powered Verification
          </span>
        </div>
        <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-4 sm:mb-6 bg-gradient-to-r from-purple-600 via-blue-600 to-cyan-600 bg-clip-text text-transparent px-4">
          Secure Certificate Verification
        </h1>
        <p className="text-base sm:text-lg md:text-xl text-gray-600 max-w-2xl mx-auto px-4">
          Issue, manage, and verify academic certificates with the power of blockchain technology and IPFS
        </p>
      </div>

      {/* Feature Cards */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-8 sm:mb-16 px-4">
        <div className="bg-white rounded-2xl shadow-lg p-6 sm:p-8 card-hover border border-gray-100">
          <div className="w-12 h-12 sm:w-14 sm:h-14 gradient-primary rounded-xl flex items-center justify-center mb-3 sm:mb-4">
            <svg className="w-6 h-6 sm:w-8 sm:h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold mb-2 sm:mb-3 text-gray-800">Admin Portal</h2>
          <p className="text-sm sm:text-base text-gray-600 mb-4 sm:mb-6">
            Issue and manage certificates on the blockchain with full control
          </p>
          <div className="space-y-2 sm:space-y-3">
            <Link
              href="/admin/issue"
              className="block w-full bg-gradient-to-r from-purple-600 to-blue-600 text-white py-2.5 sm:py-3 px-4 rounded-xl hover:shadow-lg transition-all text-center font-medium text-sm sm:text-base"
            >
              Issue Certificate
            </Link>
            <Link
              href="/admin/revoke"
              className="block w-full bg-gradient-to-r from-red-500 to-pink-500 text-white py-2.5 sm:py-3 px-4 rounded-xl hover:shadow-lg transition-all text-center font-medium text-sm sm:text-base"
            >
              Revoke Certificate
            </Link>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-6 sm:p-8 card-hover border border-gray-100">
          <div className="w-12 h-12 sm:w-14 sm:h-14 gradient-success rounded-xl flex items-center justify-center mb-3 sm:mb-4">
            <svg className="w-6 h-6 sm:w-8 sm:h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold mb-2 sm:mb-3 text-gray-800">Student Portal</h2>
          <p className="text-sm sm:text-base text-gray-600 mb-4 sm:mb-6">
            View, share, and manage your verified certificates
          </p>
          <Link
            href="/student"
            className="block w-full bg-gradient-to-r from-green-500 to-emerald-500 text-white py-2.5 sm:py-3 px-4 rounded-xl hover:shadow-lg transition-all text-center font-medium text-sm sm:text-base"
          >
            View My Certificates
          </Link>
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-6 sm:p-8 card-hover border border-gray-100 sm:col-span-2 lg:col-span-1">
          <div className="w-12 h-12 sm:w-14 sm:h-14 gradient-info rounded-xl flex items-center justify-center mb-3 sm:mb-4">
            <svg className="w-6 h-6 sm:w-8 sm:h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold mb-2 sm:mb-3 text-gray-800">Verifier Portal</h2>
          <p className="text-sm sm:text-base text-gray-600 mb-4 sm:mb-6">
            Instantly verify the authenticity of any certificate
          </p>
          <Link
            href="/verify"
            className="block w-full bg-gradient-to-r from-cyan-500 to-blue-500 text-white py-2.5 sm:py-3 px-4 rounded-xl hover:shadow-lg transition-all text-center font-medium text-sm sm:text-base"
          >
            Verify Certificate
          </Link>
        </div>
      </div>

      {/* Features Section */}
      <div className="bg-white rounded-2xl shadow-lg p-6 sm:p-8 md:p-12 border border-gray-100 mx-4">
        <h3 className="text-2xl sm:text-3xl font-bold mb-6 sm:mb-8 text-center text-gray-800">Why CertifyChain?</h3>
        <div className="grid sm:grid-cols-2 gap-6 sm:gap-8">
          <div className="flex items-start space-x-3 sm:space-x-4">
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-purple-100 rounded-lg flex items-center justify-center flex-shrink-0">
              <svg className="w-5 h-5 sm:w-6 sm:h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
            <div>
              <h4 className="font-semibold text-base sm:text-lg mb-1 sm:mb-2 text-gray-800">Immutable Records</h4>
              <p className="text-sm sm:text-base text-gray-600">Certificates stored on Ethereum blockchain cannot be altered or forged</p>
            </div>
          </div>

          <div className="flex items-start space-x-3 sm:space-x-4">
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
              <svg className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z" />
              </svg>
            </div>
            <div>
              <h4 className="font-semibold text-base sm:text-lg mb-1 sm:mb-2 text-gray-800">Decentralized Storage</h4>
              <p className="text-sm sm:text-base text-gray-600">Certificate files stored on IPFS for permanent, distributed access</p>
            </div>
          </div>

          <div className="flex items-start space-x-3 sm:space-x-4">
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
              <svg className="w-5 h-5 sm:w-6 sm:h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <div>
              <h4 className="font-semibold text-base sm:text-lg mb-1 sm:mb-2 text-gray-800">Instant Verification</h4>
              <p className="text-sm sm:text-base text-gray-600">Verify certificate authenticity in seconds with cryptographic proof</p>
            </div>
          </div>

          <div className="flex items-start space-x-3 sm:space-x-4">
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-cyan-100 rounded-lg flex items-center justify-center flex-shrink-0">
              <svg className="w-5 h-5 sm:w-6 sm:h-6 text-cyan-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
            </div>
            <div>
              <h4 className="font-semibold text-base sm:text-lg mb-1 sm:mb-2 text-gray-800">Tamper-Proof</h4>
              <p className="text-sm sm:text-base text-gray-600">Cryptographic hashing ensures any modification is immediately detected</p>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="mt-8 sm:mt-16 grid grid-cols-3 gap-3 sm:gap-6 px-4">
        <div className="text-center p-4 sm:p-6 bg-white rounded-xl shadow-md border border-gray-100">
          <div className="text-2xl sm:text-4xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent mb-1 sm:mb-2">
            100%
          </div>
          <div className="text-xs sm:text-base text-gray-600 font-medium">Secure</div>
        </div>
        <div className="text-center p-4 sm:p-6 bg-white rounded-xl shadow-md border border-gray-100">
          <div className="text-2xl sm:text-4xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent mb-1 sm:mb-2">
            Instant
          </div>
          <div className="text-xs sm:text-base text-gray-600 font-medium">Verification</div>
        </div>
        <div className="text-center p-4 sm:p-6 bg-white rounded-xl shadow-md border border-gray-100">
          <div className="text-2xl sm:text-4xl font-bold bg-gradient-to-r from-cyan-600 to-blue-600 bg-clip-text text-transparent mb-1 sm:mb-2">
            Forever
          </div>
          <div className="text-xs sm:text-base text-gray-600 font-medium">Accessible</div>
        </div>
      </div>
    </div>
  );
}
