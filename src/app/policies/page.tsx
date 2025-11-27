import AppShellWrapper from "@/components/AppShellWrapper";
import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/authz";
import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

async function addCategory(fd: FormData) {
  "use server";
  const session = await getServerSession(authOptions);
  const role = (session?.user as unknown as { role?: string })?.role;
  if (!session || role !== "ADMIN") {
    throw new Error("Unauthorized");
  }
  const orgId = session.user.organizationId!;
  const name = String(fd.get("name") || "");
  await prisma.category.create({ data: { name, organizationId: orgId } });
  redirect("/policies");
}

async function removeCategory(fd: FormData) {
  "use server";
  const session = await getServerSession(authOptions);
  const role = (session?.user as unknown as { role?: string })?.role;
  if (!session || role !== "ADMIN") {
    throw new Error("Unauthorized");
  }
  const orgId = session.user.organizationId!;
  const id = String(fd.get("id") || "");
  await prisma.category.deleteMany({ where: { id, organizationId: orgId } });
  redirect("/policies");
}

async function addPolicy(fd: FormData) {
  "use server";
  const session = await getServerSession(authOptions);
  const role = (session?.user as unknown as { role?: string })?.role;
  if (!session || role !== "ADMIN") {
    throw new Error("Unauthorized");
  }
  const orgId = session.user.organizationId!;
  const categoryId = String(fd.get("categoryId") || "");
  const maxAmount = fd.get("maxAmount") ? Number(fd.get("maxAmount")) : null;
  const monthlyLimit = fd.get("monthlyLimit") ? Number(fd.get("monthlyLimit")) : null;
  await prisma.policy.create({
    data: {
      name: `Policy for ${new Date().toISOString().split('T')[0]}`,
      categoryId: categoryId || null,
      maxAmount,
      monthlyLimit,
      organizationId: orgId
    }
  });
  redirect("/policies");
}

async function removePolicy(fd: FormData) {
  "use server";
  const session = await getServerSession(authOptions);
  const role = (session?.user as unknown as { role?: string })?.role;
  if (!session || role !== "ADMIN") {
    throw new Error("Unauthorized");
  }
  const orgId = session.user.organizationId!;
  const id = String(fd.get("id") || "");
  await prisma.policy.deleteMany({ where: { id, organizationId: orgId } });
  redirect("/policies");
}

export default async function PoliciesPage({
  searchParams,
}: {
  searchParams: Promise<{ search?: string }>;
}) {
  const session = await getServerSession(authOptions);
  const role = (session?.user as unknown as { role?: string })?.role;
  const canManagePolicies = (session?.user as unknown as { canManagePolicies?: boolean })?.canManagePolicies;
  if (!session || (role !== "ADMIN" && !canManagePolicies)) {
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
  const params = await searchParams;
  const searchQuery = params.search?.toLowerCase() || "";

  const whereClause: Record<string, unknown> = { organizationId: orgId };

  // Add search filter
  if (searchQuery) {
    whereClause.OR = [
      { name: { contains: searchQuery } },
    ];
  }

  const categories = await prisma.category.findMany({
    where: whereClause,
    orderBy: { name: "asc" },
    include: {
      policies: {
        orderBy: { createdAt: "desc" }
      }
    }
  });

  return (
    <AppShellWrapper>
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
        <h1 className="text-2xl font-semibold">Policies & Categories</h1>
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
              placeholder="Search categories..."
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

      <div className="space-y-6">
        <div>
          <h2 className="text-lg font-medium mb-3">Categories & Policies</h2>
          <div className="space-y-4">
            {categories.map(c => (
              <div key={c.id} className="border border-neutral-200 rounded-lg p-4">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-md font-semibold">{c.name}</h3>
                  {role === "ADMIN" && (
                    <form action={removeCategory} suppressHydrationWarning={true}>
                      <input type="hidden" name="id" value={c.id} suppressHydrationWarning={true} />
                      <button type="submit" className="text-red-600 hover:underline text-sm" suppressHydrationWarning={true}>Remove Category</button>
                    </form>
                  )}
                </div>
                <div className="space-y-2">
                  {c.policies.length > 0 ? (
                    c.policies.map(p => (
                      <div key={p.id} className="flex items-center justify-between bg-neutral-50 p-2 rounded">
                        <div>
                          {p.maxAmount != null && <span className="text-sm text-neutral-600">Max: {Number(p.maxAmount)}</span>}
                          {p.monthlyLimit != null && <span className="ml-2 text-sm text-neutral-600">Monthly: {Number(p.monthlyLimit)}</span>}
                          {p.maxAmount == null && p.monthlyLimit == null && <span className="text-sm text-neutral-500 italic">No limits set</span>}
                        </div>
                        {role === "ADMIN" && (
                          <form action={removePolicy} suppressHydrationWarning={true}>
                            <input type="hidden" name="id" value={p.id} suppressHydrationWarning={true} />
                            <button type="submit" className="text-red-600 hover:underline text-sm" suppressHydrationWarning={true}>Remove</button>
                          </form>
                        )}
                      </div>
                    ))
                  ) : (
                    <p className="text-sm text-neutral-500 italic">No policies for this category</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {role === "ADMIN" && (
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-md font-medium mb-3">Add New Category</h3>
              <form action={addCategory} className="space-y-2" suppressHydrationWarning={true}>
                <input name="name" placeholder="New category" className="w-full rounded border border-neutral-300 px-3 py-2 bg-transparent" suppressHydrationWarning={true} />
                <button className="rounded bg-neutral-100 px-3 py-2 text-sm" suppressHydrationWarning={true}>Add Category</button>
              </form>
            </div>
            <div>
              <h3 className="text-md font-medium mb-3">Add New Policy</h3>
              <form action={addPolicy} className="space-y-2" suppressHydrationWarning={true}>
                <select name="categoryId" className="w-full rounded border border-neutral-300 px-3 py-2 bg-white" suppressHydrationWarning={true}>
                  <option value="">Select category (optional)</option>
                  {categories.map(c => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                </select>
                <div className="grid grid-cols-2 gap-2">
                  <input name="maxAmount" type="number" step="0.01" placeholder="Max per expense" className="rounded border border-neutral-300 px-3 py-2 bg-transparent" min="0" suppressHydrationWarning={true} />
                  <input name="monthlyLimit" type="number" step="0.01" placeholder="Monthly limit" className="rounded border border-neutral-300 px-3 py-2 bg-transparent" min="0" suppressHydrationWarning={true} />
                </div>
                <button className="rounded bg-neutral-100 px-3 py-2 text-sm" suppressHydrationWarning={true}>Add Policy</button>
              </form>
            </div>
          </div>
        )}
      </div>
    </AppShellWrapper>
  );
}
