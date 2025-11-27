

declare module "next-auth" {
  interface Session {
    user: {
      id?: string;
      name?: string | null;
      email?: string | null;
      image?: string | null;
      role?: string;
      organizationId?: string;
      canViewTeamPage?: boolean;
      canViewApprovalPage?: boolean;
      canManageTeamExpenses?: boolean;
      canViewReports?: boolean;
      canManagePolicies?: boolean;
      canManageStores?: boolean;
    };
  }
}
