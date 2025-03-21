import Link from 'next/link';

export default function AuthError() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#111111] p-8">
      <div className="max-w-md w-full space-y-8 p-8 bg-[#1a1a1a] rounded-xl border border-[#25D366]/20">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-white">Authentication Error</h2>
          <p className="mt-2 text-gray-300">
            There was an error during authentication. Please try again.
          </p>
        </div>
        <div className="mt-8">
          <Link
            href="/auth/login"
            className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-black bg-[#25D366] hover:bg-[#34eb74] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#25D366]"
          >
            Try Again
          </Link>
          <Link
            href="/"
            className="mt-4 w-full flex justify-center py-3 px-4 border border-[#25D366]/20 rounded-md shadow-sm text-sm font-medium text-white bg-transparent hover:bg-[#252525] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#25D366]"
          >
            Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
} 