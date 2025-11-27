import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import DashboardClient from "@/components/DashboardClient";
import AppShellWrapper from "@/components/AppShellWrapper";

function monthBoundary(offset = 0) {
  const start = new Date();
  start.setDate(1); start.setHours(0,0,0,0);
  start.setMonth(start.getMonth() + offset);
  const end = new Date(start);
  end.setMonth(start.getMonth() + 1);
  return { start, end };
}

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.organizationId) {
    return (
      <div className="p-4 text-center text-red-600 font-semibold">
        You are not authorized to view or manage this page. Please contact your administrator to request access.
      </div>
    );
  }
  const orgId = session.user.organizationId;
  const role = (session?.user as { role?: string })?.role;
  const isAdmin = role === "ADMIN";
  const userFilter = isAdmin ? {} : { userId: session.user.id };

  // KPIs
  const [totalCount, pendingCount, approvedCount, rejectedCount, totalAmount] = await Promise.all([
    prisma.expense.count({ where: { organizationId: orgId, ...userFilter } }),
    prisma.expense.count({ where: { organizationId: orgId, status: "PENDING", ...userFilter } }),
    prisma.expense.count({ where: { organizationId: orgId, status: "APPROVED", ...userFilter } }),
    prisma.expense.count({ where: { organizationId: orgId, status: "REJECTED", ...userFilter } }),
    prisma.expense.aggregate({ _sum: { amount: true }, where: { organizationId: orgId, ...userFilter } }),
  ]);

  const totalAmt = Number(totalAmount._sum.amount ?? 0);

  // This month vs last month spend
  const { start: mStart, end: mEnd } = monthBoundary(0);
  const { start: pmStart, end: pmEnd } = monthBoundary(-1);
  const [thisMonth, lastMonth] = await Promise.all([
    prisma.expense.aggregate({ _sum: { amount: true }, where: { organizationId: orgId, createdAt: { gte: mStart, lt: mEnd }, ...userFilter } }),
    prisma.expense.aggregate({ _sum: { amount: true }, where: { organizationId: orgId, createdAt: { gte: pmStart, lt: pmEnd }, ...userFilter } }),
  ]);
  const thisMonthSum = Number(thisMonth._sum.amount ?? 0);
  const lastMonthSum = Number(lastMonth._sum.amount ?? 0);

  // Recent expenses
  const recent = await prisma.expense.findMany({
    where: { organizationId: orgId, ...userFilter },
    include: { user: true, category: true },
    orderBy: { createdAt: "desc" },
    take: 5,
  });

  // Convert Decimal objects to numbers for client component
  const serializedRecent = recent.map(e => ({
    ...e,
    amount: Number(e.amount),
    createdAt: e.createdAt.toISOString(),
    category: e.category ? { name: e.category.name } : undefined,
    user: e.user ? { name: e.user.name || undefined, email: e.user.email } : undefined,
  }));

  // Small charts (reuse reports logic): by category and by month (last 6 months)
  const all = await prisma.expense.findMany({ where: { organizationId: orgId, ...userFilter }, include: { category: true }, orderBy: { createdAt: "asc" } });
  const byCategory = new Map<string, number>();
  const byMonth = new Map<string, number>();
  for (const e of all) {
    const cat = e.category?.name ?? "Uncategorized";
    byCategory.set(cat, (byCategory.get(cat) ?? 0) + Number(e.amount));
    const d = new Date(e.createdAt);
    const key = `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}`;
    byMonth.set(key, (byMonth.get(key) ?? 0) + Number(e.amount));
  }
  const catData = Array.from(byCategory.entries()).map(([name, total]) => ({ name, total }));
  const monthData = Array.from(byMonth.entries()).slice(-6).map(([month, total]) => ({ month, total }));

  // Calculate month-over-month change
  const monthChange = lastMonthSum > 0
    ? ((thisMonthSum - lastMonthSum) / lastMonthSum * 100).toFixed(1)
    : "N/A";
  const isIncrease = thisMonthSum > lastMonthSum;

  // Calculate approval rate
  const approvalRate = totalCount > 0
    ? ((approvedCount / totalCount) * 100).toFixed(1)
    : "0";

  return (
    <AppShellWrapper>
      <DashboardClient
        totalCount={totalCount}
        pendingCount={pendingCount}
        approvedCount={approvedCount}
        rejectedCount={rejectedCount}
        totalAmt={totalAmt}
        thisMonthSum={thisMonthSum}
        recent={serializedRecent}
        catData={catData}
        monthData={monthData}
        monthChange={monthChange}
        isIncrease={isIncrease}
        approvalRate={approvalRate}
        session={session}
      />
    </AppShellWrapper>
  );
}
