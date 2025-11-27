import AppShellWrapper from "@/components/AppShellWrapper";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { promises as fs } from "fs";
import path from "path";

async function createExpense(data: FormData) {
  "use server";
  const session = await getServerSession(authOptions);
  if (!session || !session.user || !session.user.organizationId || !session.user.id) {
    throw new Error("Unauthorized");
  }
  const orgId = session.user.organizationId;
  const userId = session.user.id;

  const title = String(data.get("title") || "");
  const amount = parseFloat(String(data.get("amount") || "0"));
  const notes = String(data.get("notes") || "");
  const categoryId = String(data.get("categoryId") || "");
  const dateString = String(data.get("date") || "");
  const date = dateString ? new Date(dateString) : new Date();
  if (isNaN(date.getTime())) {
    throw new Error("Invalid date provided");
  }

  // Optional receipt upload
  let receiptUrl: string | null = null;
  const file = data.get("receipt") as File | null;
  if (file && typeof file === "object") {
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const uploadsDir = path.join(process.cwd(), "public", "uploads");
    await fs.mkdir(uploadsDir, { recursive: true });
    const filename = `${Date.now()}_${file.name.replace(/[^a-zA-Z0-9_.-]/g, "_")}`;
    const filePath = path.join(uploadsDir, filename);
    await fs.writeFile(filePath, buffer);
    receiptUrl = `/uploads/${filename}`;
  }

  // Policy enforcement (simple): check max per expense and monthly per category
  if (categoryId) {
    const policies = await prisma.policy.findMany({ where: { organizationId: orgId } });
    const maxPerExpense = policies.find(p => p.maxAmount !== null && p.perExpense)?.maxAmount;
    if (maxPerExpense && amount > Number(maxPerExpense)) {
      throw new Error("Amount exceeds the maximum allowed per expense by policy");
    }

    const budget = await prisma.budget.findFirst({ where: { organizationId: orgId, categoryId } });
    if (budget) {
      const start = new Date();
      start.setDate(1); start.setHours(0,0,0,0);
      const end = new Date(start); end.setMonth(end.getMonth()+1);
      const agg = await prisma.expense.aggregate({
        _sum: { amount: true },
        where: { organizationId: orgId, categoryId, createdAt: { gte: start, lt: end } },
      });
      const spent = Number(agg._sum.amount ?? 0);
      if (spent + amount > Number(budget.amount)) {
        throw new Error("Monthly category budget limit would be exceeded by this expense");
      }
    }
  }

  await prisma.expense.create({
    data: {
      title,
      amount,
      date,
      notes: notes || null,
      organizationId: orgId,
      userId,
      categoryId: categoryId || null,
      receiptUrl,
    },
  });

  redirect("/expenses");
}

export default async function NewExpensePage() {
  const session = await getServerSession(authOptions);
  if (!session || !session.user || !session.user.organizationId) {
    return (
      <AppShellWrapper>
        <div className="max-w-3xl mx-auto">
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-red-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-red-800">Unauthorized</h3>
                <div className="mt-2 text-sm text-red-700">
                  <p>You are unauthorized to view or manage this page.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </AppShellWrapper>
    );
  }
  const orgId = session.user.organizationId;
  const categories = await prisma.category.findMany({ where: { organizationId: orgId }, orderBy: { name: "asc" } });
  const policies = await prisma.policy.findMany({ where: { organizationId: orgId } });
  const budgets = await prisma.budget.findMany({ where: { organizationId: orgId, categoryId: { not: null } } });

  // Calculate spent this month per category
  const start = new Date();
  start.setDate(1); start.setHours(0,0,0,0);
  const end = new Date(start); end.setMonth(end.getMonth()+1);
  const categorySpent = new Map<string, number>();
  for (const cat of categories) {
    const agg = await prisma.expense.aggregate({
      _sum: { amount: true },
      where: { organizationId: orgId, categoryId: cat.id, createdAt: { gte: start, lt: end } },
    });
    categorySpent.set(cat.id, Number(agg._sum.amount ?? 0));
  }

  const maxPerExpense = policies.find(p => p.maxAmount !== null && p.perExpense)?.maxAmount;
  return (
    <AppShellWrapper>
      <div className="max-w-3xl mx-auto">
        <div className="flex items-center mb-6">
          <a href="/expenses" className="mr-4 p-2 rounded-full hover:bg-neutral-100 transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
          </a>
          <h1 className="text-2xl font-bold">New Expense</h1>
        </div>
        
        <div className="bg-white rounded-xl border border-neutral-200 p-6 shadow-sm">
          <form action={createExpense} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium mb-2">Title</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-neutral-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                    </svg>
                  </div>
                  <input 
                    name="title" 
                    required 
                    placeholder="Expense title"
                    className="w-full pl-10 rounded-lg border border-neutral-300 bg-transparent px-3 py-3 outline-none focus:ring-2 focus:ring-indigo-500 transition-colors" 
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2">Amount</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <span className="text-neutral-500">₹</span>
                  </div>
                  <input 
                    name="amount" 
                    type="number" 
                    step="0.01" 
                    required 
                    placeholder="0.00"
                    className="w-full pl-8 rounded-lg border border-neutral-300 bg-transparent px-3 py-3 outline-none focus:ring-2 focus:ring-indigo-500 transition-colors" 
                  />
                </div>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium mb-2">Date</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-neutral-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <input 
                    name="date" 
                    type="date" 
                    required 
                    className="w-full pl-10 rounded-lg border border-neutral-300 bg-transparent px-3 py-3 outline-none focus:ring-2 focus:ring-indigo-500 transition-colors" 
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2">Category</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-neutral-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                    </svg>
                  </div>
                  <select
                    name="categoryId"
                    className="w-full pl-10 appearance-none rounded-lg border border-neutral-300 bg-transparent px-3 py-3 outline-none focus:ring-2 focus:ring-indigo-500 transition-colors"
                  >
                    <option value="">Uncategorized</option>
                    {categories.map(c => {
                      const budget = budgets.find(b => b.categoryId === c.id);
                      const limit = budget ? Number(budget.amount) : null;
                      const spent = categorySpent.get(c.id) ?? 0;
                      return (
                        <option key={c.id} value={c.id}>
                          {c.name} {limit ? `(₹${Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(limit).replace('₹', '')} limit, ₹${Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(spent).replace('₹', '')} spent)` : ''}
                        </option>
                      );
                    })}
                  </select>
                  <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-neutral-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </div>
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-2">Notes</label>
              <div className="relative">
                <div className="absolute top-3 left-3 flex items-start pointer-events-none">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-neutral-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <textarea 
                  name="notes" 
                  rows={4} 
                  placeholder="Additional details about this expense..."
                  className="w-full pl-10 rounded-lg border border-neutral-300 bg-transparent px-3 py-3 outline-none focus:ring-2 focus:ring-indigo-500 transition-colors" 
                />
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-2">Receipt (optional)</label>
              <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-neutral-300 border-dashed rounded-lg">
                <div className="space-y-1 text-center">
                  <svg className="mx-auto h-12 w-12 text-neutral-400" stroke="currentColor" fill="none" viewBox="0 0 48 48" aria-hidden="true">
                    <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                  <div className="flex text-sm text-neutral-600">
                    <label htmlFor="file-upload" className="relative cursor-pointer bg-white rounded-md font-medium text-indigo-600 hover:text-indigo-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-indigo-500">
                      <span>Upload a file</span>
                      <input id="file-upload" name="receipt" type="file" accept="image/*,application/pdf" className="sr-only" />
                    </label>
                    <p className="pl-1">or drag and drop</p>
                  </div>
                  <p className="text-xs text-neutral-500">PNG, JPG, PDF up to 10MB</p>
                </div>
              </div>
            </div>
            
            <div className="flex items-center justify-end space-x-3 pt-4">
              <a 
                href="/expenses" 
                className="px-4 py-2 border border-neutral-300 rounded-lg text-sm font-medium text-neutral-700 hover:bg-neutral-50 transition-colors"
              >
                Cancel
              </a>
              <button 
                type="submit" 
                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-sm font-medium shadow-sm transition-colors"
              >
                Create Expense
              </button>
            </div>
          </form>
        </div>
        
        <div className="mt-6 bg-amber-50 border border-amber-200 rounded-lg p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-amber-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-amber-800">Policy Information</h3>
              <div className="mt-2 text-sm text-amber-700">
                <p>
                  Your expense will be automatically checked against company policies. Make sure your expense complies with:
                </p>
                <ul className="list-disc pl-5 mt-1 space-y-1">
                  {maxPerExpense && <li>Maximum amount per expense: ₹{Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(Number(maxPerExpense)).replace('₹', '')}</li>}
                  {budgets.length > 0 && <li>Monthly category budget limits: {budgets.map(b => {
                    const cat = categories.find(c => c.id === b.categoryId);
                    return `${cat?.name}: ₹${Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(Number(b.amount)).replace('₹', '')}`;
                  }).join(', ')}</li>}
                  <li>Required documentation for reimbursement</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AppShellWrapper>
  );
}
