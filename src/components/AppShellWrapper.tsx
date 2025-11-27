import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import AppShell from "./AppShell";

export default async function AppShellWrapper({ children }: { children: React.ReactNode }) {
  const session = await getServerSession(authOptions);
  const user = session?.user;
  
  const permissions = {
    canViewTeamPage: user?.canViewTeamPage || false,
    canViewApprovalPage: user?.canViewApprovalPage || false,
    canViewReports: user?.canViewReports || false,
    canManagePolicies: user?.canManagePolicies || false,
    canManageStores: user?.canManageStores || false,
  };

  return (
    <AppShell userRole={user?.role} permissions={permissions}>
      {children}
    </AppShell>
  );
}
