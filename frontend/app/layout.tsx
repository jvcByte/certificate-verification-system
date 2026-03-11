import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";
import Link from "next/link";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "CertifyChain - Blockchain Certificate Verification",
  description: "Blockchain-based certificate verification and lifecycle management",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.className} bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50 min-h-screen`}>
        <Providers>
          <nav className="backdrop-blur-md bg-white/80 border-b border-gray-200 sticky top-0 z-50 shadow-sm">
            <div className="container mx-auto px-4 sm:px-6 py-3 sm:py-4">
              <div className="flex justify-between items-center">
                <Link href="/" className="flex items-center space-x-2 sm:space-x-3 group">
                  <div className="w-8 h-8 sm:w-10 sm:h-10 gradient-primary rounded-lg flex items-center justify-center transform group-hover:scale-110 transition-transform">
                    <svg className="w-4 h-4 sm:w-6 sm:h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                    </svg>
                  </div>
                  <div className="hidden xs:block">
                    <div className="text-base sm:text-lg font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                      CertifyChain
                    </div>
                    <div className="text-xs text-gray-500 hidden sm:block">Blockchain Verification</div>
                  </div>
                </Link>
                <div className="flex items-center space-x-1 sm:space-x-2">
                  <Link href="/admin/issue" className="px-2 sm:px-4 py-2 rounded-lg hover:bg-purple-50 text-gray-700 hover:text-purple-600 transition-colors font-medium text-xs sm:text-sm">
                    Issue
                  </Link>
                  <Link href="/admin/revoke" className="px-2 sm:px-4 py-2 rounded-lg hover:bg-red-50 text-gray-700 hover:text-red-600 transition-colors font-medium text-xs sm:text-sm hidden sm:inline-block">
                    Revoke
                  </Link>
                  <Link href="/student" className="px-2 sm:px-4 py-2 rounded-lg hover:bg-green-50 text-gray-700 hover:text-green-600 transition-colors font-medium text-xs sm:text-sm hidden md:inline-block">
                    Student
                  </Link>
                  <Link href="/verify" className="px-3 sm:px-4 py-2 rounded-lg bg-gradient-to-r from-purple-600 to-blue-600 text-white hover:shadow-lg transition-all text-xs sm:text-sm font-medium">
                    Verify
                  </Link>
                </div>
              </div>
            </div>
          </nav>
          <main className="container mx-auto px-4 sm:px-6 py-6 sm:py-12">{children}</main>
          <footer className="mt-12 sm:mt-20 py-6 sm:py-8 border-t border-gray-200 bg-white/50 backdrop-blur-sm">
            <div className="container mx-auto px-4 sm:px-6 text-center text-gray-600 text-xs sm:text-sm">
              <p>Powered by Ethereum & IPFS • Built for Academic Excellence</p>
            </div>
          </footer>
        </Providers>
      </body>
    </html>
  );
}

