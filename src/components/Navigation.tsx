import Link from "next/link";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export default async function Navigation() {
  const session = await getServerSession(authOptions);
  const user = session?.user;
  const role = user?.role;
  
  // Admin has access to everything
  const isAdmin = role === "ADMIN";
  
  // Get user permissions
  const canViewTeamPage = isAdmin || user?.canViewTeamPage;
  const canViewApprovalPage = isAdmin || user?.canViewApprovalPage;
  const canViewReports = isAdmin || user?.canViewReports;
  const canManagePolicies = isAdmin || user?.canManagePolicies;
  const canManageStores = isAdmin || user?.canManageStores;

  return (
    <nav className="mt-4 grid gap-1 text-sm">
      <Link
        className="px-3 py-2 rounded hover:bg-neutral-100 dark:hover:bg-neutral-700 text-neutral-900 dark:text-neutral-100"
        href="/dashboard"
      >
        Dashboard
      </Link>
      <Link
        className="px-3 py-2 rounded hover:bg-neutral-100 dark:hover:bg-neutral-700 text-neutral-900 dark:text-neutral-100"
        href="/expenses"
      >
        Expenses
      </Link>
      {canViewApprovalPage && (
        <Link
          className="px-3 py-2 rounded hover:bg-neutral-100 dark:hover:bg-neutral-700 text-neutral-900 dark:text-neutral-100"
          href="/approvals"
        >
          Approvals
        </Link>
      )}
      {canViewReports && (
        <Link
          className="px-3 py-2 rounded hover:bg-neutral-100 dark:hover:bg-neutral-700 text-neutral-900 dark:text-neutral-100"
          href="/reports"
        >
          Reports
        </Link>
      )}
      {canViewTeamPage && (
        <Link
          className="px-3 py-2 rounded hover:bg-neutral-100 dark:hover:bg-neutral-700 text-neutral-900 dark:text-neutral-100"
          href="/teams"
        >
          Teams
        </Link>
      )}
      {canManagePolicies && (
        <Link
          className="px-3 py-2 rounded hover:bg-neutral-100 dark:hover:bg-neutral-700 text-neutral-900 dark:text-neutral-100"
          href="/policies"
        >
          Policies
        </Link>
      )}
      {canManageStores && (
        <Link
          className="px-3 py-2 rounded hover:bg-neutral-100 dark:hover:bg-neutral-700 text-neutral-900 dark:text-neutral-100"
          href="/locations"
        >
          Locations
        </Link>
      )}
      <Link
        className="px-3 py-2 rounded hover:bg-neutral-100 dark:hover:bg-neutral-700 text-neutral-900 dark:text-neutral-100"
        href="/settings"
      >
        Settings
      </Link>
    </nav>
  );
}
