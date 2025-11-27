import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: Request) {
  const url = new URL(req.url);
  const orgId = url.searchParams.get("orgId");
  // In dev, we infer org from any existing expense/user; better: use session
  // Here, keep it simple and export all data (single-tenant dev) if orgId missing.

  const where = orgId ? { organizationId: orgId } : {};
  const expenses = await prisma.expense.findMany({ where, include: { category: true, user: true, store: true } });

  const rows = [
    ["Title", "Amount", "Status", "Employee", "Category", "Store", "Date"],
    ...expenses.map((e) => [
      e.title,
      String(e.amount),
      e.status,
      e.user?.email ?? "",
      e.category?.name ?? "",
      e.store?.name ?? "",
      new Date(e.createdAt).toISOString(),
    ]),
  ];

  const csv = rows.map((r) => r.map((c) => `"${String(c).replace(/"/g, '""')}"`).join(",")).join("\n");
  return new NextResponse(csv, {
    headers: {
      "content-type": "text/csv; charset=utf-8",
      "content-disposition": `attachment; filename=expenses_export.csv`,
    },
  });
}
