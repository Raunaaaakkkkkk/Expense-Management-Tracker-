"use client";
import Link from "next/link";
import Image from "next/image";
import UserMenuWrapper from "./UserMenuWrapper";
import { usePathname } from "next/navigation";

interface AppShellProps {
  children: React.ReactNode;
  userRole?: string;
  permissions?: {
    canViewTeamPage: boolean;
    canViewApprovalPage: boolean;
    canViewReports: boolean;
    canManagePolicies: boolean;
    canManageStores: boolean;
  };
}

export default function AppShell({ children, userRole, permissions }: AppShellProps) {
  const pathname = usePathname();
  
  return (
    <div className="min-h-screen grid grid-cols-[260px_1fr]">
      {/* Sidebar always visible */}
      <aside
        className="static z-auto flex flex-col gap-2 border-r border-neutral-200 p-4 bg-white bg-white/70 backdrop-blur"
      >
        <div className="flex items-center justify-start gap-2">
          <div className="flex items-center gap-2">
            <Image src="/logo.svg" alt="Expense Management logo" width={28} height={28} />
            <div className="text-lg font-semibold text-[color:var(--brand)]">Expense Management</div>
          </div>
        </div>
        <nav className="mt-4 grid gap-1 text-sm">
          <Link
            className={`px-3 py-2 rounded hover:bg-neutral-100 text-neutral-900 ${pathname === '/dashboard' ? 'bg-[var(--brand)] text-white font-semibold' : ''}`}
            href="/dashboard"
          >
            Dashboard
          </Link>
          <Link
            className={`px-3 py-2 rounded hover:bg-neutral-100 text-neutral-900 ${pathname === '/expenses' ? 'bg-[var(--brand)] text-white font-semibold' : ''}`}
            href="/expenses"
          >
            Expenses
          </Link>
          <Link
            className={`px-3 py-2 rounded hover:bg-neutral-100 text-neutral-900 ${pathname === '/approvals' ? 'bg-[var(--brand)] text-white font-semibold' : ''}`}
            href="/approvals"
          >
            Approvals
          </Link>
          <Link
            className={`px-3 py-2 rounded hover:bg-neutral-100 text-neutral-900 ${pathname === '/reports' ? 'bg-[var(--brand)] text-white font-semibold' : ''}`}
            href="/reports"
          >
            Reports
          </Link>
          <Link
            className={`px-3 py-2 rounded hover:bg-neutral-100 text-neutral-900 ${pathname === '/teams' ? 'bg-[var(--brand)] text-white font-semibold' : ''}`}
            href="/teams"
          >
            Teams
          </Link>
          <Link
            className={`px-3 py-2 rounded hover:bg-neutral-100 text-neutral-900 ${pathname === '/policies' ? 'bg-[var(--brand)] text-white font-semibold' : ''}`}
            href="/policies"
          >
            Policies
          </Link>
          <Link
            className={`px-3 py-2 rounded hover:bg-neutral-100 text-neutral-900 ${pathname === '/locations' ? 'bg-[var(--brand)] text-white font-semibold' : ''}`}
            href="/locations"
          >
            Locations
          </Link>
          <Link
            className={`px-3 py-2 rounded hover:bg-neutral-100 text-neutral-900 ${pathname === '/settings' ? 'bg-[var(--brand)] text-white font-semibold' : ''}`}
            href="/settings"
          >
            Settings
          </Link>
        </nav>
        
        {/* User menu always visible */}
        <div className="mt-auto pt-4 border-t border-neutral-200">
          <UserMenuWrapper />
        </div>
      </aside>
      
      <main className="p-8">
        <div className="flex justify-end mb-4 gap-4">
          {/* User menu with sign out */}
          <UserMenuWrapper />
        </div>
        {children}
      </main>
    </div>
  );
}
