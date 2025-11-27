-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Policy" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "maxAmount" DECIMAL,
    "perExpense" BOOLEAN NOT NULL DEFAULT true,
    "monthlyLimit" DECIMAL,
    "appliesToRole" TEXT,
    "categoryId" TEXT,
    "organizationId" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Policy_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "Category" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "Policy_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_Policy" ("appliesToRole", "createdAt", "id", "maxAmount", "monthlyLimit", "name", "organizationId", "perExpense", "updatedAt") SELECT "appliesToRole", "createdAt", "id", "maxAmount", "monthlyLimit", "name", "organizationId", "perExpense", "updatedAt" FROM "Policy";
DROP TABLE "Policy";
ALTER TABLE "new_Policy" RENAME TO "Policy";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
