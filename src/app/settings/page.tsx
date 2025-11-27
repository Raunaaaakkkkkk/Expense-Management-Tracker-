import AppShellWrapper from "@/components/AppShellWrapper";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";

async function updateOrg(fd: FormData) {
  "use server";
  const session = await getServerSession(authOptions);
  if (!session?.user?.organizationId) throw new Error("Unauthorized");
  const orgId = session.user.organizationId;
  const name = String(fd.get("name") || "");
  const brandColor = String(fd.get("brandColor") || "");
  const defaultCurrency = String(fd.get("defaultCurrency") || "INR");
  const timezone = String(fd.get("timezone") || "UTC");
  const fiscalYearStart = fd.get("fiscalYearStart") ? Number(fd.get("fiscalYearStart")) : 1;
  const contactEmail = String(fd.get("contactEmail") || "");
  const address = String(fd.get("address") || "");
  const phone = String(fd.get("phone") || "");
  const website = String(fd.get("website") || "");
  const taxId = String(fd.get("taxId") || "");
  const businessRegistrationNumber = String(fd.get("businessRegistrationNumber") || "");
  const logoUrl = String(fd.get("logoUrl") || "");
  const description = String(fd.get("description") || "");
  const autoApprovalLimit = fd.get("autoApprovalLimit") ? Number(fd.get("autoApprovalLimit")) : null;
  const receiptRequiredThreshold = fd.get("receiptRequiredThreshold") ? Number(fd.get("receiptRequiredThreshold")) : null;
  const defaultMileageRate = fd.get("defaultMileageRate") ? Number(fd.get("defaultMileageRate")) : null;
  const enableTaxCalculation = fd.get("enableTaxCalculation") === "on";
  const expenseSubmissionDeadline = fd.get("expenseSubmissionDeadline") ? Number(fd.get("expenseSubmissionDeadline")) : null;
  const enableEmailNotifications = fd.get("enableEmailNotifications") !== "off";
  const dateFormat = String(fd.get("dateFormat") || "DD/MM/YYYY");
  const numberFormat = String(fd.get("numberFormat") || "en-IN");
  await prisma.organization.update({
    where: { id: orgId },
    data: {
      name, brandColor, defaultCurrency, timezone, fiscalYearStart, contactEmail, address,
      phone, website, taxId, businessRegistrationNumber, logoUrl, description,
      autoApprovalLimit, receiptRequiredThreshold, defaultMileageRate, enableTaxCalculation,
      expenseSubmissionDeadline, enableEmailNotifications, dateFormat, numberFormat
    }
  });
  redirect("/settings");
}

export default async function SettingsPage() {
  const session = await getServerSession(authOptions);
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
  const org = await prisma.organization.findUnique({ where: { id: orgId } });

  return (
    <AppShellWrapper>
      <h1 className="text-2xl font-semibold mb-6">Settings</h1>
      <form action={updateOrg} className="space-y-6 max-w-xl">
        <div>
          <label className="block text-sm mb-1">Organization Name</label>
          <input name="name" defaultValue={org?.name ?? ''} className="w-full rounded border border-neutral-300 px-3 py-2 bg-transparent" />
        </div>
        <div>
          <label className="block text-sm mb-1">Brand Color</label>
          <input name="brandColor" type="color" defaultValue={org?.brandColor ?? '#6366f1'} className="w-16 h-10 p-0 border-0 bg-transparent" />
        </div>
        <div>
          <label className="block text-sm mb-1">Default Currency</label>
          <select name="defaultCurrency" defaultValue={org?.defaultCurrency ?? 'INR'} className="w-full rounded border border-neutral-300 px-3 py-2 bg-white">
            <option value="INR">INR - Indian Rupee</option>
            <option value="USD">USD - US Dollar</option>
            <option value="EUR">EUR - Euro</option>
            <option value="GBP">GBP - British Pound</option>
            <option value="JPY">JPY - Japanese Yen</option>
          </select>
        </div>
        <div>
          <label className="block text-sm mb-1">Timezone</label>
          <select name="timezone" defaultValue={org?.timezone ?? 'UTC'} className="w-full rounded border border-neutral-300 px-3 py-2 bg-white">
            <option value="UTC">UTC</option>
            <option value="America/New_York">Eastern Time</option>
            <option value="America/Chicago">Central Time</option>
            <option value="America/Denver">Mountain Time</option>
            <option value="America/Los_Angeles">Pacific Time</option>
            <option value="Europe/London">London</option>
            <option value="Europe/Paris">Paris</option>
            <option value="Asia/Tokyo">Tokyo</option>
            <option value="Asia/Kolkata">India (Kolkata)</option>
          </select>
        </div>
        <div>
          <label className="block text-sm mb-1">Fiscal Year Start Month</label>
          <select name="fiscalYearStart" defaultValue={org?.fiscalYearStart ?? 1} className="w-full rounded border border-neutral-300 px-3 py-2 bg-white">
            <option value="1">January</option>
            <option value="2">February</option>
            <option value="3">March</option>
            <option value="4">April</option>
            <option value="5">May</option>
            <option value="6">June</option>
            <option value="7">July</option>
            <option value="8">August</option>
            <option value="9">September</option>
            <option value="10">October</option>
            <option value="11">November</option>
            <option value="12">December</option>
          </select>
        </div>
        <div>
          <label className="block text-sm mb-1">Contact Email</label>
          <input name="contactEmail" type="email" defaultValue={org?.contactEmail ?? ''} className="w-full rounded border border-neutral-300 px-3 py-2 bg-transparent" />
        </div>
        <div>
          <label className="block text-sm mb-1">Phone</label>
          <input name="phone" type="tel" defaultValue={org?.phone ?? ''} className="w-full rounded border border-neutral-300 px-3 py-2 bg-transparent" />
        </div>
        <div>
          <label className="block text-sm mb-1">Website</label>
          <input name="website" type="url" defaultValue={org?.website ?? ''} className="w-full rounded border border-neutral-300 px-3 py-2 bg-transparent" />
        </div>
        <div>
          <label className="block text-sm mb-1">Tax ID</label>
          <input name="taxId" defaultValue={org?.taxId ?? ''} className="w-full rounded border border-neutral-300 px-3 py-2 bg-transparent" />
        </div>
        <div>
          <label className="block text-sm mb-1">Business Registration Number</label>
          <input name="businessRegistrationNumber" defaultValue={org?.businessRegistrationNumber ?? ''} className="w-full rounded border border-neutral-300 px-3 py-2 bg-transparent" />
        </div>
        <div>
          <label className="block text-sm mb-1">Logo URL</label>
          <input name="logoUrl" type="url" defaultValue={org?.logoUrl ?? ''} className="w-full rounded border border-neutral-300 px-3 py-2 bg-transparent" />
        </div>
        <div>
          <label className="block text-sm mb-1">Description</label>
          <textarea name="description" defaultValue={org?.description ?? ''} rows={3} className="w-full rounded border border-neutral-300 px-3 py-2 bg-transparent" />
        </div>
        <div>
          <label className="block text-sm mb-1">Auto Approval Limit</label>
          <input name="autoApprovalLimit" type="number" step="0.01" defaultValue={org?.autoApprovalLimit?.toString() ?? ''} className="w-full rounded border border-neutral-300 px-3 py-2 bg-transparent" />
        </div>
        <div>
          <label className="block text-sm mb-1">Receipt Required Threshold</label>
          <input name="receiptRequiredThreshold" type="number" step="0.01" defaultValue={org?.receiptRequiredThreshold?.toString() ?? ''} className="w-full rounded border border-neutral-300 px-3 py-2 bg-transparent" />
        </div>
        <div>
          <label className="block text-sm mb-1">Default Mileage Rate</label>
          <input name="defaultMileageRate" type="number" step="0.01" defaultValue={org?.defaultMileageRate?.toString() ?? ''} className="w-full rounded border border-neutral-300 px-3 py-2 bg-transparent" />
        </div>
        <div>
          <label className="flex items-center space-x-2">
            <input name="enableTaxCalculation" type="checkbox" defaultChecked={org?.enableTaxCalculation ?? false} className="rounded border border-neutral-300" />
            <span className="text-sm">Enable Tax Calculation</span>
          </label>
        </div>
        <div>
          <label className="block text-sm mb-1">Expense Submission Deadline (days)</label>
          <input name="expenseSubmissionDeadline" type="number" defaultValue={org?.expenseSubmissionDeadline ?? ''} className="w-full rounded border border-neutral-300 px-3 py-2 bg-transparent" />
        </div>
        <div>
          <label className="flex items-center space-x-2">
            <input name="enableEmailNotifications" type="checkbox" defaultChecked={org?.enableEmailNotifications ?? true} className="rounded border border-neutral-300" />
            <span className="text-sm">Enable Email Notifications</span>
          </label>
        </div>
        <div>
          <label className="block text-sm mb-1">Date Format</label>
          <select name="dateFormat" defaultValue={org?.dateFormat ?? 'DD/MM/YYYY'} className="w-full rounded border border-neutral-300 px-3 py-2 bg-white">
            <option value="DD/MM/YYYY">DD/MM/YYYY</option>
            <option value="MM/DD/YYYY">MM/DD/YYYY</option>
            <option value="YYYY-MM-DD">YYYY-MM-DD</option>
          </select>
        </div>
        <div>
          <label className="block text-sm mb-1">Number Format</label>
          <select name="numberFormat" defaultValue={org?.numberFormat ?? 'en-IN'} className="w-full rounded border border-neutral-300 px-3 py-2 bg-white">
            <option value="en-IN">Indian (1,23,456.78)</option>
            <option value="en-US">US (123,456.78)</option>
            <option value="de-DE">German (123.456,78)</option>
          </select>
        </div>
        <div>
          <label className="block text-sm mb-1">Address</label>
          <textarea name="address" defaultValue={org?.address ?? ''} rows={3} className="w-full rounded border border-neutral-300 px-3 py-2 bg-transparent" />
        </div>
        <button className="rounded-lg text-white px-4 py-2 text-sm font-medium" style={{ backgroundColor: "var(--brand)" }}>Save</button>
      </form>
    </AppShellWrapper>
  );
}
