export default function Footer() {
  return (
    <footer className="mt-auto py-6 px-4">
      <div className="text-center text-gray-500 text-sm">
        <p>© {new Date().getFullYear()} SmartBot. All rights reserved.</p>
        <div className="mt-2 space-x-4">
          <a href="/terms" className="hover:text-green-500 transition-colors">Terms of Service</a>
          <span>•</span>
          <a href="/privacy" className="hover:text-green-500 transition-colors">Privacy Policy</a>
        </div>
      </div>
    </footer>
  );
} 