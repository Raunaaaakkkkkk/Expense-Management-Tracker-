-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Organization" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "brandColor" TEXT,
    "defaultCurrency" TEXT NOT NULL DEFAULT 'INR',
    "timezone" TEXT NOT NULL DEFAULT 'UTC',
    "fiscalYearStart" INTEGER NOT NULL DEFAULT 1,
    "contactEmail" TEXT,
    "address" TEXT,
    "phone" TEXT,
    "website" TEXT,
    "taxId" TEXT,
    "businessRegistrationNumber" TEXT,
    "logoUrl" TEXT,
    "description" TEXT,
    "autoApprovalLimit" DECIMAL,
    "receiptRequiredThreshold" DECIMAL,
    "defaultMileageRate" DECIMAL,
    "enableTaxCalculation" BOOLEAN NOT NULL DEFAULT false,
    "expenseSubmissionDeadline" INTEGER,
    "enableEmailNotifications" BOOLEAN NOT NULL DEFAULT true,
    "dateFormat" TEXT NOT NULL DEFAULT 'DD/MM/YYYY',
    "numberFormat" TEXT NOT NULL DEFAULT 'en-IN',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);
INSERT INTO "new_Organization" ("brandColor", "createdAt", "id", "name", "slug", "updatedAt") SELECT "brandColor", "createdAt", "id", "name", "slug", "updatedAt" FROM "Organization";
DROP TABLE "Organization";
ALTER TABLE "new_Organization" RENAME TO "Organization";
CREATE UNIQUE INDEX "Organization_slug_key" ON "Organization"("slug");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
