import AppShellWrapper from "@/components/AppShellWrapper";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import SessionRefreshNotice from "@/components/SessionRefreshNotice";

async function approve(id: string) {
  "use server";
  const session = await getServerSession(authOptions);
  const role = session?.user?.role;
  const canViewApprovalPage = session?.user?.canViewApprovalPage;
  const isAdmin = role === "ADMIN";
  
  // Check if user has permission (admin/manager OR has canViewApprovalPage permission)
  if (!session || !(isAdmin || role === "MANAGER" || canViewApprovalPage)) {
    redirect("/login");
  }
  if (!session?.user?.organizationId) {
    redirect("/login");
  }
  
  await prisma.expense.update({
    where: { id },
    data: {
      status: "APPROVED",
      approvedById: session.user.id,
      approvedAt: new Date(),
      rejectedReason: null,
    },
  });
  await prisma.auditLog.create({
    data: {
      action: "APPROVE_EXPENSE",
      actorId: session.user.id!,
      organizationId: session.user.organizationId!,
      target: id,
    },
  });
  redirect('/approvals');
}

async function reject(id: string, reason: string) {
  "use server";
  const session = await getServerSession(authOptions);
  const role = session?.user?.role;
  const canViewApprovalPage = session?.user?.canViewApprovalPage;
  const isAdmin = role === "ADMIN";
  
  // Check if user has permission (admin/manager OR has canViewApprovalPage permission)
  if (!session || !(isAdmin || role === "MANAGER" || canViewApprovalPage)) {
    redirect("/login");
  }
  
  await prisma.expense.update({
    where: { id },
    data: {
      status: "REJECTED",
      approvedById: null,
      approvedAt: null,
      rejectedReason: reason || "",
    },
  });
  await prisma.auditLog.create({
    data: {
      action: "REJECT_EXPENSE",
      actorId: session.user.id!,
      organizationId: session.user.organizationId!,
      target: id,
      metadata: { reason },
    },
  });
  redirect('/approvals');
}

export default async function ApprovalsPage({
  searchParams,
}: {
  searchParams: Promise<{ updated?: string; search?: string }>;
}) {
  const session = await getServerSession(authOptions);
  const role = session?.user?.role;
  const canViewApprovalPage = session?.user?.canViewApprovalPage;
  const isAdmin = role === "ADMIN";

  // Check if user has permission (admin/manager OR has canViewApprovalPage permission)
  if (!session || !(isAdmin || role === "MANAGER" || canViewApprovalPage)) {
    return (
      <AppShellWrapper>
        <div className="p-4 text-center text-red-600 font-semibold">
          You are not authorized to view or manage this page. Please contact your administrator to request access.
        </div>
      </AppShellWrapper>
    );
  }

  const orgId = session.user.organizationId!;
  const params = await searchParams;
  const showNotice = params.updated === "true";
  const searchQuery = params.search?.toLowerCase() || "";

  const whereClause: Record<string, unknown> = { organizationId: orgId, status: "PENDING" };

  // Add search filter
  if (searchQuery) {
    whereClause.OR = [
      { title: { contains: searchQuery } },
      { notes: { contains: searchQuery } },
      { user: { name: { contains: searchQuery } } },
      { user: { email: { contains: searchQuery } } },
      { category: { name: { contains: searchQuery } } },
      { store: { name: { contains: searchQuery } } },
    ];
  }

  const pending = await prisma.expense.findMany({
    where: whereClause,
    include: { user: true, store: true, category: true },
    orderBy: { createdAt: "desc" },
  });

  return (
    <AppShellWrapper>
      {showNotice && <SessionRefreshNotice />}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
        <h1 className="text-2xl font-semibold">Approvals</h1>
      </div>

      {/* Search */}
      <div className="bg-white rounded-lg border border-neutral-200 p-4 shadow-sm mb-6">
        <form method="get" className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-grow">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-neutral-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <input
              name="search"
              type="text"
              placeholder="Search pending expenses..."
              defaultValue={params.search || ""}
              className="w-full pl-10 pr-4 py-2 border border-neutral-300 rounded-lg bg-transparent"
            />
          </div>
          <button type="submit" className="px-3 py-2 bg-neutral-100 rounded-lg border border-neutral-200 text-sm hover:bg-neutral-200 transition-colors">
            <span className="flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
            </span>
          </button>
        </form>
      </div>

      <div className="space-y-3">
        {pending.map((e) => (
          <div key={e.id} className="rounded-xl border border-neutral-200 p-4 bg-white/70 backdrop-blur flex items-center justify-between gap-4">
            <div>
              <div className="font-medium">{e.title} - {Number(e.amount)} {e.currency}</div>
              <div className="text-sm text-neutral-500">{e.user?.name ?? e.user?.email} · {e.category?.name ?? "-"} · {e.store?.name ?? "-"}</div>
            </div>
            <div className="flex items-center gap-2">
              <form action={async () => { 'use server'; await approve(e.id); }}>
                <button className="rounded-lg bg-green-600 hover:bg-green-500 text-white px-3 py-1.5 text-sm">Approve</button>
              </form>
              <form action={async (fd: FormData) => { 'use server'; await reject(e.id, String(fd.get('reason') || '')); }} className="flex items-center gap-2">
                <input name="reason" placeholder="Reason" className="rounded border border-neutral-300 bg-transparent px-2 py-1 text-sm" />
                <button className="rounded-lg bg-red-600 hover:bg-red-500 text-white px-3 py-1.5 text-sm">Reject</button>
              </form>
            </div>
          </div>
        ))}
        {pending.length === 0 && <div className="text-sm text-neutral-500">No pending expenses.</div>}
      </div>
    </AppShellWrapper>
  );
}
