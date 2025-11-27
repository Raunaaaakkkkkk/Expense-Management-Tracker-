import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const roles = ["ADMIN", "MANAGER", "ACCOUNTANT", "EMPLOYEE"];
    const users = await Promise.all(
      roles.map(role => 
        prisma.user.findFirst({
          where: { role: role as any, organization: { slug: "demo-org" } },
          select: { email: true, role: true },
        })
      )
    );

    const demoUsers = users.filter(Boolean);

    return NextResponse.json(demoUsers);
  } catch (error) {
    console.error("Failed to fetch demo users:", error);
    return NextResponse.json({ error: "Failed to fetch demo users" }, { status: 500 });
  }
}
