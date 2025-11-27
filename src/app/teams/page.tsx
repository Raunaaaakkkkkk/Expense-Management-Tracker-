import AppShellWrapper from "@/components/AppShellWrapper";
import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/authz";
import { redirect } from "next/navigation";
import { hash } from "bcryptjs";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";

import { Role } from "@/generated/prisma";

async function addMember(fd: FormData) {
  "use server";
  const session = await getServerSession(authOptions);
  const role = (session?.user as unknown as { role?: string })?.role;
  if (!session || role !== "ADMIN") {
    throw new Error("Unauthorized");
  }
  if (!session?.user?.organizationId) {
    throw new Error("User is not associated with an organization.");
  }
  const orgId = session.user.organizationId;
  console.log("orgId in addMember:", orgId);
  const email = String(fd.get("email") || "");
  const name = String(fd.get("name") || "");
  const roleValue = String(fd.get("role") || "EMPLOYEE") as Role;
  const password = String(fd.get("password") || "demo123");

  // Check if user with this email already exists
  const existingUser = await prisma.user.findUnique({ where: { email } });
  if (existingUser) {
    redirect("/teams?error=email_exists");
  }

  const passwordHash = await hash(password, 10);
  await prisma.user.create({ data: { email, name, role: roleValue, passwordHash, organizationId: orgId } });
  redirect("/teams?success=member_added");
}

async function updateRole(fd: FormData) {
  "use server";
  const session = await getServerSession(authOptions);
  const role = (session?.user as unknown as { role?: string })?.role;
  if (!session || role !== "ADMIN") {
    throw new Error("Unauthorized");
  }
  const userId = String(fd.get("userId") || "");
  const roleValue = String(fd.get("role") || "EMPLOYEE") as Role;
  await prisma.user.update({ where: { id: userId }, data: { role: roleValue } });
  redirect("/teams");
}

async function updateMember(fd: FormData) {
  "use server";
  const session = await getServerSession(authOptions);
  const role = (session?.user as unknown as { role?: string })?.role;
  if (!session || role !== "ADMIN") {
    throw new Error("Unauthorized");
  }
  const userId = String(fd.get("userId") || "");
  const name = String(fd.get("name") || "");
  const email = String(fd.get("email") || "");
  const roleValue = String(fd.get("role") || "EMPLOYEE") as Role;
  const password = String(fd.get("password") || "");

  // Get checkbox values - they will be "on" if checked, null if unchecked
  const canViewTeamPage = fd.get("canViewTeamPage") === "on";
  const canViewApprovalPage = fd.get("canViewApprovalPage") === "on";
  const canManageTeamExpenses = fd.get("canManageTeamExpenses") === "on";
  const canViewReports = fd.get("canViewReports") === "on";
  const canManagePolicies = fd.get("canManagePolicies") === "on";
  const canManageStores = fd.get("canManageStores") === "on";

  console.log("Updating user permissions:", {
    userId,
    canViewTeamPage,
    canViewApprovalPage,
    canManageTeamExpenses,
    canViewReports,
    canManagePolicies,
    canManageStores
  });

  // Prepare data to update
  const dataToUpdate: {
    name: string;
    email: string;
    role: Role;
    canViewTeamPage: boolean;
    canViewApprovalPage: boolean;
    canManageTeamExpenses?: boolean;
    canViewReports?: boolean;
    canManagePolicies?: boolean;
    canManageStores?: boolean;
    passwordHash?: string
  } = {
    name,
    email,
    role: roleValue,
    canViewTeamPage,
    canViewApprovalPage,
    canManageTeamExpenses,
    canViewReports,
    canManagePolicies,
    canManageStores
  };

  // Only update password if provided
  if (password) {
    dataToUpdate.passwordHash = await hash(password, 10);
  }

  // Update the user in the database
  await prisma.user.update({
    where: { id: userId },
    data: dataToUpdate
  });

  // Note: User will need to log out and log back in for permission changes to take effect
  redirect("/teams?updated=true");
}


import SessionRefreshNotice from "@/components/SessionRefreshNotice";

export default async function TeamsPage({ searchParams }: { searchParams: Promise<{ updated?: string; search?: string; error?: string; success?: string }> }) {
  const session = await getServerSession(authOptions);
  const role = (session?.user as unknown as { role?: string })?.role;
  const canViewTeamPage = (session?.user as unknown as { canViewTeamPage?: boolean })?.canViewTeamPage;
  if (!session || (role !== "ADMIN" && !canViewTeamPage)) {
    return (
      <AppShellWrapper>
        <div className="p-4 text-center text-red-600 font-semibold">
          You are not authorized to view or manage this page. Please contact your administrator to request access.
        </div>
      </AppShellWrapper>
    );
  }
  if (!session?.user?.organizationId) {
    return (
      <AppShellWrapper>
        <div className="p-4 text-center text-red-600 font-semibold">
          You are not authorized to view or manage this page. Please contact your administrator to request access.
        </div>
      </AppShellWrapper>
    );
  }
  const orgId = session.user.organizationId!;
  const allUsers = await prisma.user.findMany({ where: { organizationId: orgId }, orderBy: { createdAt: "desc" } });
  const isAdmin = role === "ADMIN";
  const params = await searchParams;
  const searchQuery = params.search?.toLowerCase() || "";
  const users = searchQuery
    ? allUsers.filter(u =>
        u.name?.toLowerCase().includes(searchQuery) ||
        u.email.toLowerCase().includes(searchQuery)
      )
    : allUsers;

  return (
    <AppShellWrapper>
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Team Management</h1>

        {params.error === "email_exists" && (
          <div className="mb-6">
            <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-800">
              <div className="flex items-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path>
                  <line x1="12" y1="9" x2="12" y2="13"></line>
                  <line x1="12" y1="17" x2="12.01" y2="17"></line>
                </svg>
                <span className="font-medium">A user with this email already exists. Please use a different email address.</span>
              </div>
            </div>
          </div>
        )}

        {params.success === "member_added" && (
          <div className="mb-6">
            <div className="p-4 bg-green-50 border border-green-200 rounded-lg text-green-800">
              <div className="flex items-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                  <polyline points="22 4 12 14.01 9 11.01"></polyline>
                </svg>
                <span className="font-medium">Team member added successfully!</span>
              </div>
            </div>
          </div>
        )}

        {params.updated === "true" && (
          <div className="mb-6">
            <SessionRefreshNotice />
            <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-lg text-green-800">
              <div className="flex items-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                  <polyline points="22 4 12 14.01 9 11.01"></polyline>
                </svg>
                <span className="font-medium">User information and permissions updated successfully!</span>
              </div>
            </div>
          </div>
        )}
        
        <div className="grid lg:grid-cols-2 gap-8">
          <div>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">Team Members</h2>
              <form method="get" className="flex gap-2">
                <input
                  type="text"
                  name="search"
                  placeholder="Search by name or email..."
                  defaultValue={params.search || ""}
                  className="px-3 py-2 border border-neutral-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700 transition-colors"
                >
                  Search
                </button>
              </form>
            </div>
            <div className="rounded-xl border border-neutral-200 bg-white shadow-sm">
              {users.length === 0 ? (
                <div className="p-8 text-center text-neutral-500">
                  No team members yet. Add your first member to get started.
                </div>
              ) : (
                <div className="divide-y divide-neutral-200">
                  {users.map(u => (
                    <div key={u.id} className="p-5">
                      <form id={`update-member-${u.id}`} action={updateMember} className="space-y-4">
                        <input type="hidden" name="userId" value={u.id} />
                        
                        <div className="grid md:grid-cols-2 gap-3">
                          <div>
                            <label className="block text-xs font-medium text-neutral-600 mb-1">Name</label>
                            <input
                              name="name"
                              defaultValue={u.name ?? ""}
                              className="w-full rounded-lg border border-neutral-300 px-3 py-2 bg-transparent text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                              readOnly={!isAdmin}
                              title={u.name ?? ""}
                            />
                          </div>
                          <div>
                            <label className="block text-xs font-medium text-neutral-600 mb-1">Email</label>
                            <input
                              name="email"
                              defaultValue={u.email}
                              className="w-full rounded-lg border border-neutral-300 px-3 py-2 bg-transparent text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                              readOnly={!isAdmin}
                              title={u.email}
                            />
                          </div>
                        </div>

                        <div className="grid md:grid-cols-2 gap-3">
                          <div>
                            <label className="block text-xs font-medium text-neutral-600 mb-1">Role</label>
                            <select
                              name="role"
                              defaultValue={u.role}
                              className="w-full rounded-lg border border-neutral-300 text-sm px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                              disabled={!isAdmin}
                            >
                              <option>ADMIN</option>
                              <option>MANAGER</option>
                              <option>ACCOUNTANT</option>
                              <option>EMPLOYEE</option>
                            </select>
                          </div>
                          {isAdmin && (
                            <div>
                              <label className="block text-xs font-medium text-neutral-600 mb-1">New Password (optional)</label>
                              <input
                                name="password"
                                placeholder="Leave blank to keep current"
                                type="password"
                                className="w-full rounded-lg border border-neutral-300 px-3 py-2 bg-transparent text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                              />
                            </div>
                          )}
                        </div>

                        {isAdmin && (
                          <div className="space-y-3 pt-2">
                            <div className="flex flex-col gap-3">
                              <div className="text-sm font-medium text-neutral-700 mb-1">User Permissions:</div>
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 bg-neutral-50 p-3 rounded-lg border border-neutral-200">
                                <label className="flex items-center gap-2 text-sm cursor-pointer hover:bg-white p-2 rounded-md transition-colors">
                                  <input
                                    type="checkbox"
                                    name="canViewTeamPage"
                                    defaultChecked={u.canViewTeamPage}
                                    className="w-4 h-4 rounded border-neutral-300 text-blue-600 focus:ring-2 focus:ring-blue-500"
                                  />
                                  <span className="text-neutral-700">View Team Page</span>
                                </label>
                                <label className="flex items-center gap-2 text-sm cursor-pointer hover:bg-white p-2 rounded-md transition-colors">
                                  <input
                                    type="checkbox"
                                    name="canViewApprovalPage"
                                    defaultChecked={u.canViewApprovalPage}
                                    className="w-4 h-4 rounded border-neutral-300 text-blue-600 focus:ring-2 focus:ring-blue-500"
                                  />
                                  <span className="text-neutral-700">View Approval Page</span>
                                </label>
                                <label className="flex items-center gap-2 text-sm cursor-pointer hover:bg-white p-2 rounded-md transition-colors">
                                  <input
                                    type="checkbox"
                                    name="canManageTeamExpenses"
                                    defaultChecked={u.canManageTeamExpenses}
                                    className="w-4 h-4 rounded border-neutral-300 text-blue-600 focus:ring-2 focus:ring-blue-500"
                                  />
                                  <span className="text-neutral-700">Manage Team Expenses</span>
                                </label>
                                <label className="flex items-center gap-2 text-sm cursor-pointer hover:bg-white p-2 rounded-md transition-colors">
                                  <input
                                    type="checkbox"
                                    name="canViewReports"
                                    defaultChecked={u.canViewReports}
                                    className="w-4 h-4 rounded border-neutral-300 text-blue-600 focus:ring-2 focus:ring-blue-500"
                                  />
                                  <span className="text-neutral-700">View Reports</span>
                                </label>
                                <label className="flex items-center gap-2 text-sm cursor-pointer hover:bg-white p-2 rounded-md transition-colors">
                                  <input
                                    type="checkbox"
                                    name="canManagePolicies"
                                    defaultChecked={u.canManagePolicies}
                                    className="w-4 h-4 rounded border-neutral-300 text-blue-600 focus:ring-2 focus:ring-blue-500"
                                  />
                                  <span className="text-neutral-700">Manage Policies</span>
                                </label>
                                <label className="flex items-center gap-2 text-sm cursor-pointer hover:bg-white p-2 rounded-md transition-colors">
                                  <input
                                    type="checkbox"
                                    name="canManageStores"
                                    defaultChecked={u.canManageStores}
                                    className="w-4 h-4 rounded border-neutral-300 text-blue-600 focus:ring-2 focus:ring-blue-500"
                                  />
                                  <span className="text-neutral-700">Manage Locations</span>
                                </label>
                              </div>
                            </div>
                            <button 
                              type="submit" 
                              className="rounded-lg bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 text-sm font-medium transition-colors shadow-sm w-full"
                            >
                              Save Changes
                            </button>
                          </div>
                        )}
                      </form>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {isAdmin && (
            <div>
              <h2 className="text-xl font-semibold mb-4">Add New Member</h2>
              <div className="rounded-xl border border-neutral-200 bg-white shadow-sm p-6">
                <form action={addMember} className="space-y-5">
                  <div>
                    <label className="block text-sm font-medium text-neutral-700 mb-2">
                      Name
                    </label>
                    <input 
                      name="name" 
                      placeholder="Enter full name"
                      className="w-full rounded-lg border border-neutral-300 px-4 py-2.5 bg-transparent focus:outline-none focus:ring-2 focus:ring-blue-500 transition" 
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-neutral-700 mb-2">
                      Email <span className="text-red-500">*</span>
                    </label>
                    <input 
                      name="email" 
                      type="email" 
                      required 
                      placeholder="email@example.com"
                      className="w-full rounded-lg border border-neutral-300 px-4 py-2.5 bg-transparent focus:outline-none focus:ring-2 focus:ring-blue-500 transition" 
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-neutral-700 mb-2">
                      Role
                    </label>
                    <select 
                      name="role" 
                      className="w-full rounded-lg border border-neutral-300 px-4 py-2.5 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                    >
                      <option>EMPLOYEE</option>
                      <option>MANAGER</option>
                      <option>ACCOUNTANT</option>
                      <option>ADMIN</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-neutral-700 mb-2">
                      Temporary Password
                    </label>
                    <input 
                      name="password" 
                      type="text"
                      defaultValue="demo123" 
                      placeholder="Set initial password"
                      className="w-full rounded-lg border border-neutral-300 px-4 py-2.5 bg-transparent focus:outline-none focus:ring-2 focus:ring-blue-500 transition" 
                    />
                    <p className="text-xs text-neutral-500 mt-1">User can change this after first login</p>
                  </div>
                  <button 
                    type="submit"
                    className="w-full rounded-lg text-white px-6 py-3 text-sm font-semibold transition-all shadow-md hover:shadow-lg" 
                    style={{ backgroundColor: "var(--brand)" }}
                  >
                    Add Team Member
                  </button>
                </form>
              </div>
            </div>
          )}
        </div>
      </div>
    </AppShellWrapper>
  );
}
