import Link from "next/link";

export default function PortalFooter() {
  return (
    <footer className="bg-gray-900 text-gray-300 py-10 mt-16">
      <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-3 gap-10">
        {/* Branding */}
        <div>
          <h2 className="text-2xl font-bold text-white">VideoCMS</h2>
          <p className="mt-3 text-sm">
            Empowering teams to launch, manage, and analyze video campaigns
            effortlessly.
          </p>
        </div>

        {/* Quick Links */}
        <div>
          <h3 className="font-semibold text-white mb-3">Quick Links</h3>
          <ul className="space-y-2">
            <li><Link href="/dashboard" className="hover:text-white">Dashboard</Link></li>
            <li><Link href="/campaigns" className="hover:text-white">Campaigns</Link></li>
            <li><Link href="/analytics" className="hover:text-white">Analytics</Link></li>
            <li><Link href="/settings" className="hover:text-white">Settings</Link></li>
          </ul>
        </div>

        {/* Legal */}
        <div>
          <h3 className="font-semibold text-white mb-3">Legal</h3>
          <ul className="space-y-2">
            <li><Link href="/privacy" className="hover:text-white">Privacy Policy</Link></li>
            <li><Link href="/terms" className="hover:text-white">Terms & Conditions</Link></li>
          </ul>
        </div>
      </div>

      <div className="border-t border-gray-700 mt-10 pt-6 text-center text-sm">
        © {new Date().getFullYear()} VideoCMS. All rights reserved.
      </div>
    </footer>
  );
}
