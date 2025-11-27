import AppShellWrapper from "@/components/AppShellWrapper";
import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/authz";
import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

async function addStore(fd: FormData) {
  "use server";
  const session = await getServerSession(authOptions);
  const role = (session?.user as unknown as { role?: string })?.role;
  if (!session || role !== "ADMIN") {
    throw new Error("Unauthorized");
  }
  const orgId = session.user.organizationId!;
  const name = String(fd.get("name") || "");
  const address = String(fd.get("address") || "");
  const type = String(fd.get("type") || "");
  const numberOfEmployees = fd.get("numberOfEmployees") ? parseInt(String(fd.get("numberOfEmployees"))) : null;
  await prisma.store.create({ data: { name, address: address || null, type: type || null, numberOfEmployees, organizationId: orgId } });
  redirect("/locations");
}

async function deleteStore(fd: FormData) {
  "use server";
  const session = await getServerSession(authOptions);
  const role = (session?.user as unknown as { role?: string })?.role;
  if (!session || role !== "ADMIN") {
    throw new Error("Unauthorized");
  }
  const id = String(fd.get("id") || "");
  await prisma.store.delete({ where: { id } });
  redirect("/locations");
}

export default async function LocationsPage({
  searchParams,
}: {
  searchParams: Promise<{ search?: string }>;
}) {
  const session = await getServerSession(authOptions);
  const role = (session?.user as unknown as { role?: string })?.role;
  const canManageStores = (session?.user as unknown as { canManageStores?: boolean })?.canManageStores;
  if (!session || (role !== "ADMIN" && !canManageStores)) {
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
      { address: { contains: searchQuery } },
      { type: { contains: searchQuery } },
    ];
  }

  const stores = await prisma.store.findMany({ where: whereClause, orderBy: { name: "asc" } });

  return (
    <AppShellWrapper>
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
        <h1 className="text-2xl font-semibold">Locations</h1>
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
              placeholder="Search locations..."
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

      <div className="grid md:grid-cols-2 gap-8">
        <div>
          <h2 className="text-lg font-medium mb-3">All Locations</h2>
          <ul className="space-y-2">
            {stores.map(s => (
              <li key={s.id} className="flex justify-between items-center text-sm border rounded p-2">
                <div>
                  <div className="font-medium">{s.name}</div>
                  {s.address && <div className="text-xs text-gray-600">{s.address}</div>}
                  {s.type && <div className="text-xs text-gray-600">Type: {s.type}</div>}
                  {s.numberOfEmployees && <div className="text-xs text-gray-600">Employees: {s.numberOfEmployees}</div>}
                </div>
                <form action={deleteStore} className="ml-2">
                  <input type="hidden" name="id" value={s.id} />
                  <button type="submit" className="text-red-500 hover:text-red-700 text-xs">Delete</button>
                </form>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h2 className="text-lg font-medium mb-3">Add Location</h2>
          <form action={addStore} className="space-y-2" suppressHydrationWarning={true}>
            <input name="name" placeholder="Name" className="w-full rounded border border-neutral-300 px-3 py-2 bg-transparent" required />
            <input name="address" placeholder="Address" className="w-full rounded border border-neutral-300 px-3 py-2 bg-transparent" />
            <input name="type" placeholder="Type (e.g., office, store, school)" className="w-full rounded border border-neutral-300 px-3 py-2 bg-transparent" />
            <input name="numberOfEmployees" type="number" placeholder="Number of Employees" className="w-full rounded border border-neutral-300 px-3 py-2 bg-transparent" />
            <button className="rounded bg-neutral-100 px-3 py-2 text-sm">Add Location</button>
          </form>
        </div>
      </div>
    </AppShellWrapper>
  );
}
