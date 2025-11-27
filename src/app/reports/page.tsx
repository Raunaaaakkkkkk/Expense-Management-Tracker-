import AppShellWrapper from "@/components/AppShellWrapper";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { CategoryBarChart, MonthlyLineChart } from "@/components/Charts";

function toMonthKey(d: Date) {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
}

export default async function ReportsPage() {
  const session = await getServerSession(authOptions);
  const role = (session?.user as unknown as { role?: string })?.role;
  const canViewReports = (session?.user as unknown as { canViewReports?: boolean })?.canViewReports;
  if (!session || (role !== "ADMIN" && !canViewReports)) {
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

  const expenses = await prisma.expense.findMany({
    where: { organizationId: orgId },
    include: { category: true },
    orderBy: { createdAt: "asc" },
  });

  const byCategory = new Map<string, number>();
  const byMonth = new Map<string, number>();
  for (const e of expenses) {
    const cat = e.category?.name ?? "Uncategorized";
    byCategory.set(cat, (byCategory.get(cat) ?? 0) + Number(e.amount));
    const key = toMonthKey(new Date(e.createdAt));
    byMonth.set(key, (byMonth.get(key) ?? 0) + Number(e.amount));
  }

  const catData = Array.from(byCategory.entries()).map(([name, total]) => ({ name, total }));
  const monthData = Array.from(byMonth.entries()).map(([month, total]) => ({ month, total }));

  return (
    <AppShellWrapper>
      <h1 className="text-2xl font-semibold mb-6">Reports</h1>
      <div className="grid gap-6">
        <div>
          <h2 className="text-lg font-medium mb-2">By Category</h2>
          <CategoryBarChart data={catData} />
        </div>
        <div>
          <h2 className="text-lg font-medium mb-2">Monthly Trend</h2>
          <MonthlyLineChart data={monthData} />
        </div>
        <div>
          <a className="inline-block rounded-lg bg-neutral-100 px-4 py-2 text-sm hover:bg-neutral-200" href="/api/reports/export">Download CSV Export</a>
        </div>
      </div>
    </AppShellWrapper>
  );
}
