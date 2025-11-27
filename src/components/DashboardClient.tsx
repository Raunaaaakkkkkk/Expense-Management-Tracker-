"use client";

import { useState } from "react";
import { CategoryBarChart, MonthlyLineChart } from "@/components/Charts";
import Link from "next/link";
import NotificationModal from "@/components/NotificationModal";
import { Session } from "next-auth";

interface Expense {
  id: string;
  title: string;
  amount: number;
  status: string;
  createdAt: string;
  category?: { name: string };
  user?: { name?: string; email?: string };
}

interface CategoryData {
  name: string;
  total: number;
}

interface MonthData {
  month: string;
  total: number;
}

interface DashboardClientProps {
  totalCount: number;
  pendingCount: number;
  approvedCount: number;
  rejectedCount: number;
  totalAmt: number;
  thisMonthSum: number;
  recent: Expense[];
  catData: CategoryData[];
  monthData: MonthData[];
  monthChange: string;
  isIncrease: boolean;
  approvalRate: string;
  session: Session;
}

export default function DashboardClient({
  totalCount,
  pendingCount,
  approvedCount,
  rejectedCount,
  totalAmt,
  thisMonthSum,
  recent,
  catData,
  monthData,
  monthChange,
  isIncrease,
  approvalRate,
  session
}: DashboardClientProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <div className="grid gap-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold">Dashboard</h1>
              <p className="text-neutral-500 mt-1">Welcome back, <span className="font-medium text-neutral-700">{session?.user?.name ?? session?.user?.email}</span>.</p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => setIsModalOpen(true)}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-sm font-medium shadow-sm transition-colors"
              >
                <span className="flex items-center gap-2">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-5 5v-5zM4.868 12.683A17.925 17.925 0 0112 21c7.962 0 12-1.21 12-2.683m-12 2.683a17.925 17.925 0 01-7.132-8.317M12 21V9m0 0l-4 4m4-4l4 4" />
                  </svg>
                  Notifications
                </span>
              </button>
              <Link href="/reports" className="px-4 py-2 bg-white rounded-lg border border-neutral-200 text-sm font-medium shadow-sm hover:bg-neutral-50 transition-colors">
                <span className="flex items-center gap-2">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                  </svg>
                  Export Report
                </span>
              </Link>
              <Link href="/expenses/new" className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-sm font-medium shadow-sm transition-colors">
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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <KPICard
            title="Total Expenses"
            value={String(totalCount)}
            icon={
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
              </svg>
            }
            subtitle="All time"
          />
          <KPICard
            title="Total Amount"
            value={Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(totalAmt)}
            icon={
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            }
            subtitle="All time"
          />
          <KPICard
            title="This Month"
            value={Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(thisMonthSum)}
            icon={
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-purple-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            }
            subtitle={
              <span className={`flex items-center ${isIncrease ? 'text-red-500' : 'text-green-500'}`}>
                {isIncrease ? (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                  </svg>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 17h8m0 0V9m0 8l-8-8-4 4-6-6" />
                  </svg>
                )}
                {monthChange !== "N/A" ? `${monthChange}% from last month` : "No data from last month"}
              </span>
            }
          />
          <KPICard
            title="Approval Rate"
            value={`${approvalRate}%`}
            icon={
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-amber-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            }
            subtitle={`${approvedCount} approved, ${pendingCount} pending, ${rejectedCount} rejected`}
          />
        </div>

        {/* Status Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <StatusCard
            title="Pending"
            count={pendingCount}
            color="bg-amber-100"
            textColor="text-amber-800"
            icon={
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            }
          />
          <StatusCard
            title="Approved"
            count={approvedCount}
            color="bg-green-100"
            textColor="text-green-800"
            icon={
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            }
          />
          <StatusCard
            title="Rejected"
            count={rejectedCount}
            color="bg-red-100"
            textColor="text-red-800"
            icon={
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            }
          />
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white rounded-xl border border-neutral-200 p-5 shadow-sm">
            <h2 className="text-lg font-semibold mb-4">Expenses by Category</h2>
            <div className="h-64">
              <CategoryBarChart data={catData} />
            </div>
          </div>
          <div className="bg-white rounded-xl border border-neutral-200 p-5 shadow-sm">
            <h2 className="text-lg font-semibold mb-4">Monthly Expense Trend</h2>
            <div className="h-64">
              <MonthlyLineChart data={monthData} />
            </div>
          </div>
        </div>

        {/* Recent Expenses */}
        <div className="bg-white rounded-xl border border-neutral-200 p-5 shadow-sm">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold">Recent Expenses</h2>
            <Link href="/expenses" className="text-indigo-600 hover:text-indigo-500 text-sm font-medium flex items-center">
              View All
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-neutral-200">
              <thead>
                <tr>
                  <Th>Title</Th>
                  <Th>Amount</Th>
                  <Th>Category</Th>
                  <Th>Status</Th>
                  <Th>Employee</Th>
                  <Th>Date</Th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-200">
                {recent.map(e => (
                  <tr key={e.id} className="hover:bg-neutral-50 transition-colors">
                    <Td className="font-medium">{e.title}</Td>
                    <Td>{Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(Number(e.amount))}</Td>
                    <Td>
                      {e.category?.name ? (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                          {e.category.name}
                        </span>
                      ) : '-'}
                    </Td>
                    <Td>
                      <StatusBadge status={e.status} />
                    </Td>
                    <Td>{e.user?.name ?? e.user?.email}</Td>
                    <Td>{new Date(e.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}</Td>
                  </tr>
                ))}
                {recent.length === 0 && (
                  <tr>
                    <td colSpan={6} className="px-4 py-8 text-center text-neutral-500">
                      No expenses found. Create your first expense to get started.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
      <NotificationModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </>
  );
}

function KPICard({
  title,
  value,
  icon,
  subtitle
}: {
  title: string;
  value: string;
  icon: React.ReactNode;
  subtitle: React.ReactNode;
}) {
  return (
    <div className="rounded-xl border border-neutral-200 p-6 bg-white shadow-sm">
      <div className="flex justify-between items-start">
        <div>
          <div className="text-sm font-medium text-neutral-500">{title}</div>
          <div className="text-2xl font-bold mt-1 text-neutral-900">{value}</div>
        </div>
        <div className="p-2 rounded-lg bg-neutral-100">
          {icon}
        </div>
      </div>
      <div className="mt-2 text-xs text-neutral-500">
        {subtitle}
      </div>
    </div>
  );
}

function StatusCard({
  title,
  count,
  color,
  textColor,
  icon
}: {
  title: string;
  count: number;
  color: string;
  textColor: string;
  icon: React.ReactNode;
}) {
  return (
    <div className="rounded-xl border border-neutral-200 p-5 bg-white shadow-sm">
      <div className="flex items-center">
        <div className={`p-3 rounded-lg ${color} ${textColor} mr-4`}>
          {icon}
        </div>
        <div>
          <div className="text-sm font-medium text-neutral-500">{title}</div>
          <div className="text-xl font-bold mt-1">{count}</div>
        </div>
      </div>
    </div>
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

function Th({ children }: { children: React.ReactNode }) {
  return <th className="px-4 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">{children}</th>;
}

function Td({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return <td className={`px-4 py-3 text-sm ${className}`}>{children}</td>;
}
