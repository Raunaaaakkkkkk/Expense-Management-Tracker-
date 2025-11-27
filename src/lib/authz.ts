import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";

export async function requireRole(roles: ("ADMIN"|"MANAGER"|"ACCOUNTANT"|"EMPLOYEE")[]) {
  const session = await getServerSession(authOptions);
  const role = session?.user?.role as string | undefined;
  if (!session || !role || !roles.includes(role as ("ADMIN"|"MANAGER"|"ACCOUNTANT"|"EMPLOYEE"))) {
    redirect("/login");
  }
  return session;
}

export function hasRole(role: string | undefined, roles: string[]) {
  return !!role && roles.includes(role);
}
