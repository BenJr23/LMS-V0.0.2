import Link from 'next/link';
import { ReactNode } from 'react';
import { Bell } from 'lucide-react';
import Image from 'next/image';

export default function DashboardLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex h-screen overflow-hidden">
      {/* Sidebar */}
      <aside className="w-64 bg-gradient-to-b from-[#800000] to-[#a52a2a] text-white flex flex-col justify-between shadow-lg">
        <div>
          {/* System Logo */}
          <div className="flex justify-center items-center px-6 pt-8 pb-2">
            <div className="bg-white rounded-full p-2 shadow-md">
              <Image src="/assets/sjsfi_logo.svg" alt="SJSFI Logo" width={56} height={56} />
            </div>
          </div>
          {/* System Title */}
          <div className="text-2xl font-bold px-6 pt-2 pb-4 text-center tracking-wide">LMS Portal</div>

          {/* Top separator */}
          <div className="border-b border-gray-200/60 mx-6 mt-2"></div>

          {/* Label */}
          <div className="px-6 py-2 text-sm font-medium text-white text-center">
            Student Portal
          </div>

          {/* Bottom separator */}
          <div className="border-b border-gray-200/60 mx-6 mb-4"></div>

          {/* Nav links */}
          <nav className="px-4">
            <ul className="space-y-2">
              <li>
                <Link href="/student-dashboard" className="block px-4 py-2 rounded-lg hover:bg-white/20 transition font-medium">
                  Dashboard
                </Link>
              </li>
              <li>
                <Link href="/calendar" className="block px-4 py-2 rounded-lg hover:bg-white/20 transition font-medium">
                  Calendar
                </Link>
              </li>
            </ul>
          </nav>
        </div>

        {/* Footer */}
        <div className="text-center text-sm mb-4 text-white/70">© 2025 LMS System</div>
      </aside>

      {/* Main content area */}
      <div className="flex-1 flex flex-col bg-gray-100">
        {/* Topbar */}
        <header className="flex justify-between items-center px-6 py-4 bg-white/80 shadow border-b border-gray-200 backdrop-blur-md">
          <h1 className="text-xl font-semibold text-[#800000] tracking-wide">WELCOME USER</h1>
          <div className="flex items-center space-x-4">
            <Bell className="text-[#800000]" />
            <div className="bg-[#800000] text-white px-3 py-1 rounded-full text-sm font-medium">
              Student User
            </div>
          </div>
        </header>

        {/* Routed Page Content */}
        <main className="p-6 overflow-y-auto">{children}</main>
      </div>
    </div>
  );
}