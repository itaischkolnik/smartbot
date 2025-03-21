import Image from "next/image";
import Link from "next/link";

export const dynamic = 'force-static';

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-[#111111] p-8">
      {/* Hero Section */}
      <div className="relative w-full max-w-6xl mx-auto text-center">
        {/* Background Gradient Effect */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#25D366]/20 to-transparent blur-3xl -z-10" />
        
        {/* Main Content */}
        <div className="space-y-12 px-4">
          {/* Logo and Title */}
          <div className="space-y-6">
            <div className="mx-auto h-16 w-16 bg-[#25D366] rounded-2xl rotate-45 transform transition-transform hover:rotate-0 duration-500" />
            <h1 className="text-5xl sm:text-6xl font-bold text-white">
              Welcome to <span className="text-[#25D366]">SmartBot</span>
            </h1>
          </div>

          {/* Description */}
          <p className="text-xl sm:text-2xl text-gray-300 max-w-2xl mx-auto">
            Create and manage intelligent WhatsApp chatbots powered by advanced AI technology
          </p>

          {/* Features Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto mt-12">
            {[
              "AI-Powered Responses",
              "Easy Integration",
              "Real-time Monitoring",
              "Custom Workflows",
              "Analytics Dashboard",
              "24/7 Availability"
            ].map((feature, index) => (
              <div
                key={index}
                className="bg-[#1a1a1a] p-6 rounded-xl border border-[#25D366]/20 hover:border-[#25D366]/40 transition-colors"
              >
                <div className="text-[#25D366] mb-2">●</div>
                <h3 className="text-white font-semibold">{feature}</h3>
              </div>
            ))}
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mt-12">
            <Link
              href="/auth/login"
              className="px-8 py-4 bg-[#25D366] hover:bg-[#34eb74] text-black font-bold rounded-lg transform transition hover:scale-105 text-center"
            >
              Get Started
            </Link>
            <Link
              href="#features"
              className="px-8 py-4 bg-[#1a1a1a] hover:bg-[#252525] text-white font-bold rounded-lg border border-[#25D366]/20 transform transition hover:scale-105"
            >
              Learn More
            </Link>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="mt-24 text-gray-400 text-sm">
        Powered by Next.js and OpenAI
      </footer>
    </main>
  );
} 