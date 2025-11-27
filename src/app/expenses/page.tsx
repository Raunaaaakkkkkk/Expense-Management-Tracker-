import AppShellWrapper from "@/components/AppShellWrapper";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import Link from "next/link";

export default async function ExpensesPage({
  searchParams,
}: {
  searchParams: Promise<{ search?: string; status?: string; category?: string }>;
}) {
  const session = await getServerSession(authOptions);
  if (!session) {
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
  const orgId = session.user.organizationId;
  const role = session?.user?.role;
  const isAdmin = role === "ADMIN";
  const params = await searchParams;
  const searchQuery = params.search?.toLowerCase() || "";
  const statusFilter = params.status || "";
  const categoryFilter = params.category || "";

  const whereClause: Record<string, unknown> = { organizationId: orgId };

  // Non-admins can only see their own expenses
  if (!isAdmin) {
    whereClause.userId = session.user.id;
  }

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

  // Add status filter
  if (statusFilter) {
    whereClause.status = statusFilter;
  }

  // Add category filter
  if (categoryFilter) {
    whereClause.category = { name: { contains: categoryFilter } };
  }

  const expenses = await prisma.expense.findMany({
    where: whereClause,
    include: {
      user: { select: { name: true, email: true } },
      store: { select: { name: true } },
      category: { select: { name: true } }
    },
    orderBy: { createdAt: "desc" },
    take: 50,
  });

  // Group expenses by status for summary
  const pendingCount = expenses.filter(e => e.status === 'PENDING').length;
  const approvedCount = expenses.filter(e => e.status === 'APPROVED').length;
  const rejectedCount = expenses.filter(e => e.status === 'REJECTED').length;
  
  // Calculate total amount
  const totalAmount = expenses.reduce((sum, e) => sum + Number(e.amount), 0);

  return (
    <AppShellWrapper>
      <div className="space-y-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold">Expenses</h1>
            <p className="text-neutral-500 mt-1">Manage and track all your organization&apos;s expenses</p>
          </div>
          <div className="flex gap-3">
            <button className="px-4 py-2 bg-white rounded-lg border border-neutral-200 text-sm font-medium shadow-sm hover:bg-neutral-50 transition-colors">
              <span className="flex items-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
                </svg>
                Filter
              </span>
            </button>
            <Link 
              href="/expenses/new" 
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-sm font-medium shadow-sm transition-colors"
            >
              <span className="flex items-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                New Expense
              </span>
            </Link>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          <div className="bg-white rounded-lg border border-neutral-200 p-4 shadow-sm">
            <div className="text-sm text-neutral-500">Total Expenses</div>
            <div className="text-xl font-bold mt-1">{expenses.length}</div>
          </div>
          <div className="bg-white rounded-lg border border-neutral-200 p-4 shadow-sm">
            <div className="text-sm text-neutral-500">Total Amount</div>
            <div className="text-xl font-bold mt-1">{Intl.NumberFormat('en-IN', { style: "currency", currency: "INR" }).format(totalAmount)}</div>
          </div>
          <div className="bg-white rounded-lg border border-neutral-200 p-4 shadow-sm flex items-center">
            <div className="w-3 h-3 rounded-full bg-amber-400 mr-2"></div>
            <div>
              <div className="text-sm text-neutral-500">Pending</div>
              <div className="text-xl font-bold mt-1">{pendingCount}</div>
            </div>
          </div>
          <div className="bg-white rounded-lg border border-neutral-200 p-4 shadow-sm flex items-center">
            <div className="w-3 h-3 rounded-full bg-green-400 mr-2"></div>
            <div>
              <div className="text-sm text-neutral-500">Approved</div>
              <div className="text-xl font-bold mt-1">{approvedCount}</div>
            </div>
          </div>
          <div className="bg-white rounded-lg border border-neutral-200 p-4 shadow-sm flex items-center">
            <div className="w-3 h-3 rounded-full bg-red-400 mr-2"></div>
            <div>
              <div className="text-sm text-neutral-500">Rejected</div>
              <div className="text-xl font-bold mt-1">{rejectedCount}</div>
            </div>
          </div>
        </div>

        {/* Search and Filter */}
        <div className="bg-white rounded-lg border border-neutral-200 p-4 shadow-sm">
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
                placeholder="Search expenses..."
                defaultValue={params.search || ""}
                className="w-full pl-10 pr-4 py-2 border border-neutral-300 rounded-lg bg-transparent"
              />
            </div>
            <div className="flex gap-2">
              <select name="status" defaultValue={params.status || ""} className="border border-neutral-300 rounded-lg px-3 py-2 bg-transparent">
                <option value="">All Statuses</option>
                <option value="PENDING">Pending</option>
                <option value="APPROVED">Approved</option>
                <option value="REJECTED">Rejected</option>
                <option value="REIMBURSED">Reimbursed</option>
              </select>
              <select name="category" defaultValue={params.category || ""} className="border border-neutral-300 rounded-lg px-3 py-2 bg-transparent">
                <option value="">All Categories</option>
                <option value="Travel">Travel</option>
                <option value="Meals">Meals</option>
                <option value="Supplies">Supplies</option>
              </select>
              <button type="submit" className="px-3 py-2 bg-neutral-100 rounded-lg border border-neutral-200 text-sm hover:bg-neutral-200 transition-colors">
                <span className="flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                </span>
              </button>
            </div>
          </form>
        </div>

        {/* Expenses Table */}
        <div className="bg-white rounded-xl border border-neutral-200 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-neutral-200">
              <thead className="bg-neutral-50">
                <tr>
                  <Th>Title</Th>
                  <Th>Amount</Th>
                  <Th>Status</Th>
                  <Th>Employee</Th>
                  <Th className="hidden md:table-cell">Category</Th>
                  <Th className="hidden md:table-cell">Date</Th>
                  <Th>Actions</Th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-200">
                {expenses.length > 0 ? (
                  expenses.map((e) => (
                    <tr key={e.id} className="hover:bg-neutral-50 transition-colors">
                      <Td className="font-medium">{e.title}</Td>
                      <Td>{Intl.NumberFormat('en-IN', { style: "currency", currency: "INR" }).format(Number(e.amount))}</Td>
                      <Td>
                        <StatusBadge status={e.status} />
                      </Td>
                      <Td>{e.user?.name ?? e.user?.email}</Td>
                      <Td className="hidden md:table-cell">
                        {e.category?.name ? (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                            {e.category.name}
                          </span>
                        ) : '-'}
                      </Td>
                      <Td className="hidden md:table-cell">{new Date(e.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}</Td>
                      <Td>
                        <div className="flex items-center space-x-2">
                          <button className="p-1 rounded-md hover:bg-neutral-100">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-neutral-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                            </svg>
                          </button>
                          {e.receiptUrl && (
                            <a href={e.receiptUrl} target="_blank" className="p-1 rounded-md hover:bg-neutral-100">
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-neutral-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                              </svg>
                            </a>
                          )}
                        </div>
                      </Td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={7} className="px-4 py-8 text-center text-neutral-500">
                      No expenses found. Create your first expense to get started.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          
          {/* Pagination */}
          {expenses.length > 0 && (
            <div className="px-4 py-3 flex items-center justify-between border-t border-neutral-200">
              <div className="flex-1 flex justify-between sm:hidden">
                <button className="relative inline-flex items-center px-4 py-2 border border-neutral-300 text-sm font-medium rounded-md text-neutral-700 bg-white hover:bg-neutral-50">
                  Previous
                </button>
                <button className="ml-3 relative inline-flex items-center px-4 py-2 border border-neutral-300 text-sm font-medium rounded-md text-neutral-700 bg-white hover:bg-neutral-50">
                  Next
                </button>
              </div>
              <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                <div>
                  <p className="text-sm text-neutral-700">
                    Showing <span className="font-medium">1</span> to <span className="font-medium">{Math.min(50, expenses.length)}</span> of{' '}
                    <span className="font-medium">{expenses.length}</span> results
                  </p>
                </div>
                <div>
                  <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                    <button className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-neutral-300 bg-white text-sm font-medium text-neutral-500 hover:bg-neutral-50">
                      <span className="sr-only">Previous</span>
                      <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                        <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </button>
                    <button className="relative inline-flex items-center px-4 py-2 border border-neutral-300 bg-white text-sm font-medium text-neutral-700 hover:bg-neutral-50">
                      1
                    </button>
                    <button className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-neutral-300 bg-white text-sm font-medium text-neutral-500 hover:bg-neutral-50">
                      <span className="sr-only">Next</span>
                      <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                        <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                      </svg>
                    </button>
                  </nav>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </AppShellWrapper>
  );
}

function StatusBadge({ status }: { status: string }) {
  switch (status) {
    case 'PENDING':
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-amber-100 text-amber-800">
          Pending
        </span>
      );
    case 'APPROVED':
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
          Approved
        </span>
      );
    case 'REJECTED':
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
          Rejected
        </span>
      );
    case 'REIMBURSED':
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
          Reimbursed
        </span>
      );
    default:
      return <span>{status}</span>;
  }
}

function Th({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return <th className={`px-4 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider ${className}`}>{children}</th>;
}

function Td({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return <td className={`px-4 py-3 text-sm ${className}`}>{children}</td>;
}
