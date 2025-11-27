const { PrismaClient } = require("../src/generated/prisma");
const bcrypt = require("bcryptjs");

const prisma = new PrismaClient();

async function main() {
  const org = await prisma.organization.upsert({
    where: { slug: "demo-org" },
    update: {},
    create: {
      name: "Demo Organization",
      slug: "demo-org",
      defaultCurrency: "INR",
      timezone: "UTC",
      fiscalYearStart: 1,
      enableEmailNotifications: true,
      dateFormat: "DD/MM/YYYY",
      numberFormat: "en-IN",
    },
  });

  // Ensure at least 10 common categories
  const categoryNames = [
    "Travel", "Meals", "Lodging", "Fuel", "Supplies", "Utilities", "Rent", "Maintenance", "IT", "Training", "Marketing"
  ];
  const categories = [];
  for (const name of categoryNames) {
    const id = `seed-${name.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`;
    const c = await prisma.category.upsert({
      where: { id },
      update: {},
      create: { id, name, organizationId: org.id },
    });
    categories.push(c);
  }
  const travel = categories.find(c => c.name === "Travel");
  const supplies = categories.find(c => c.name === "Supplies");

  const store = await prisma.store.upsert({
    where: { id: "seed-store-1" },
    update: {},
    create: { id: "seed-store-1", name: "Main Mall Store A", organizationId: org.id },
  });

  const adminPass = await bcrypt.hash("demo123", 10);

  const admin = await prisma.user.upsert({
    where: { email: "admin@demo.local" },
    update: {},
    create: {
      email: "admin@demo.local",
      name: "Demo Admin",
      role: "ADMIN",
      passwordHash: adminPass,
      organizationId: org.id,
    },
  });

  const employeePass = await bcrypt.hash("demo123", 10);
  const employee = await prisma.user.upsert({
    where: { email: "employee@demo.local" },
    update: {},
    create: {
      email: "employee@demo.local",
      name: "Alex Employee",
      role: "EMPLOYEE",
      passwordHash: employeePass,
      organizationId: org.id,
    },
  });

  const managerPass = await bcrypt.hash("demo123", 10);
  const manager = await prisma.user.upsert({
    where: { email: "manager@demo.local" },
    update: {},
    create: {
      email: "manager@demo.local",
      name: "Jordan Manager",
      role: "MANAGER",
      passwordHash: managerPass,
      organizationId: org.id,
      canViewTeamPage: true,
      canViewApprovalPage: true,
      canManageTeamExpenses: true,
    },
  });

  const accountantPass = await bcrypt.hash("demo123", 10);
  const accountant = await prisma.user.upsert({
    where: { email: "accountant@demo.local" },
    update: {},
    create: {
      email: "accountant@demo.local",
      name: "Sam Accountant",
      role: "ACCOUNTANT",
      passwordHash: accountantPass,
      organizationId: org.id,
      canViewReports: true,
      canManagePolicies: true,
    },
  });

  // Sample policies
  await prisma.policy.createMany({
    data: [
      {
        name: "Travel Expense Limit",
        maxAmount: 500.00,
        perExpense: true,
        appliesToRole: "EMPLOYEE",
        categoryId: travel.id,
        organizationId: org.id,
      },
      {
        name: "Monthly Meal Allowance",
        monthlyLimit: 200.00,
        appliesToRole: "MANAGER",
        categoryId: categories.find(c => c.name === "Meals").id,
        organizationId: org.id,
      },
      {
        name: "IT Equipment Budget",
        maxAmount: 1000.00,
        perExpense: false,
        categoryId: categories.find(c => c.name === "IT").id,
        organizationId: org.id,
      },
    ],
  });

  // Sample budgets
  await prisma.budget.createMany({
    data: [
      {
        name: "Q4 Travel Budget",
        period: "Quarterly",
        amount: 5000.00,
        categoryId: travel.id,
        organizationId: org.id,
      },
      {
        name: "Annual Marketing Budget",
        period: "Yearly",
        amount: 25000.00,
        categoryId: categories.find(c => c.name === "Marketing").id,
        organizationId: org.id,
      },
      {
        name: "Monthly Supplies Budget",
        period: "Monthly",
        amount: 1000.00,
        categoryId: supplies.id,
        organizationId: org.id,
      },
    ],
  });

  // Sample expenses
  await prisma.expense.createMany({
    data: [
      {
        title: "Flight to client site",
        amount: 450.25,
        status: "PENDING",
        userId: employee.id,
        organizationId: org.id,
        storeId: store.id,
        categoryId: travel.id,
      },
      {
        title: "Office supplies",
        amount: 89.99,
        status: "APPROVED",
        userId: employee.id,
        organizationId: org.id,
        categoryId: supplies.id,
        approvedById: accountant.id,
        approvedAt: new Date(),
      },
      {
        title: "Business lunch with client",
        amount: 125.50,
        status: "PENDING",
        userId: manager.id,
        organizationId: org.id,
        categoryId: categories.find(c => c.name === "Meals").id,
      },
      {
        title: "Hotel accommodation",
        amount: 320.00,
        status: "APPROVED",
        userId: manager.id,
        organizationId: org.id,
        categoryId: categories.find(c => c.name === "Lodging").id,
        approvedById: admin.id,
        approvedAt: new Date(),
      },
      {
        title: "Fuel for company vehicle",
        amount: 75.30,
        status: "REIMBURSED",
        userId: employee.id,
        organizationId: org.id,
        categoryId: categories.find(c => c.name === "Fuel").id,
        approvedById: accountant.id,
        approvedAt: new Date(),
      },
      {
        title: "IT software license",
        amount: 199.99,
        status: "PENDING",
        userId: admin.id,
        organizationId: org.id,
        categoryId: categories.find(c => c.name === "IT").id,
      },
      {
        title: "Marketing campaign materials",
        amount: 450.00,
        status: "APPROVED",
        userId: admin.id,
        organizationId: org.id,
        categoryId: categories.find(c => c.name === "Marketing").id,
        approvedById: admin.id,
        approvedAt: new Date(),
      },
      {
        title: "Training workshop fee",
        amount: 299.00,
        status: "REJECTED",
        rejectedReason: "Exceeds professional development budget for this quarter.",
        userId: employee.id,
        organizationId: org.id,
        categoryId: categories.find(c => c.name === "Training").id,
      },
      {
        title: "Client Gift Basket",
        amount: 150.00,
        status: "PENDING",
        userId: manager.id,
        organizationId: org.id,
        categoryId: categories.find(c => c.name === "Supplies").id,
      },
      {
        title: "Webinar Hosting Subscription",
        amount: 75.00,
        status: "APPROVED",
        userId: admin.id,
        organizationId: org.id,
        categoryId: categories.find(c => c.name === "IT").id,
        approvedById: admin.id,
        approvedAt: new Date(),
      },
      {
        title: "Team Dinner",
        amount: 350.00,
        status: "REIMBURSED",
        userId: manager.id,
        organizationId: org.id,
        categoryId: categories.find(c => c.name === "Meals").id,
        approvedById: accountant.id,
        approvedAt: new Date(),
      },
    ],
  });

  console.log("Seed completed. Admin: admin@demo.local / demo123");
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
}).finally(async () => {
  await prisma.$disconnect();
});
