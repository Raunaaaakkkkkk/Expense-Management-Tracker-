import { prisma } from "@/lib/prisma";
import { PrismaAdapter } from "@auth/prisma-adapter";
import Credentials from "next-auth/providers/credentials";
import { compare } from "bcryptjs";
import NextAuth from "next-auth";

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: PrismaAdapter(prisma),
  session: { strategy: "jwt" },
  providers: [
    Credentials({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;
        const user = await prisma.user.findUnique({ where: { email: credentials.email } });
        if (!user || !user.passwordHash) return null;
        const ok = await compare(credentials.password, user.passwordHash);
        if (!ok) return null;
        return {
          id: user.id,
          email: user.email,
          name: user.name ?? undefined,
          image: user.image ?? undefined,
          role: user.role,
          organizationId: user.organizationId,
          canViewTeamPage: user.canViewTeamPage,
          canViewApprovalPage: user.canViewApprovalPage,
          canManageTeamExpenses: user.canManageTeamExpenses,
          canViewReports: user.canViewReports,
          canManagePolicies: user.canManagePolicies,
          canManageStores: user.canManageStores,
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user, trigger }) {
      if (user) {
        token.role = user.role;
        token.organizationId = user.organizationId;
        token.canViewTeamPage = user.canViewTeamPage;
        token.canViewApprovalPage = user.canViewApprovalPage;
        token.canManageTeamExpenses = user.canManageTeamExpenses;
        token.canViewReports = user.canViewReports;
        token.canManagePolicies = user.canManagePolicies;
        token.canManageStores = user.canManageStores;
      }
      // Refresh user data from database on update trigger or when any field is not set
      if (trigger === "update" || token.role === undefined || token.organizationId === undefined || token.canViewTeamPage === undefined || token.canViewApprovalPage === undefined || token.canManageTeamExpenses === undefined || token.canViewReports === undefined || token.canManagePolicies === undefined || token.canManageStores === undefined) {
        const dbUser = await prisma.user.findUnique({
          where: { id: token.sub },
          select: {
            role: true,
            organizationId: true,
            canViewTeamPage: true,
            canViewApprovalPage: true,
            canManageTeamExpenses: true,
            canViewReports: true,
            canManagePolicies: true,
            canManageStores: true
          }
        });
        if (dbUser) {
          token.role = dbUser.role;
          token.organizationId = dbUser.organizationId;
          token.canViewTeamPage = dbUser.canViewTeamPage;
          token.canViewApprovalPage = dbUser.canViewApprovalPage;
          token.canManageTeamExpenses = dbUser.canManageTeamExpenses;
          token.canViewReports = dbUser.canViewReports;
          token.canManagePolicies = dbUser.canManagePolicies;
          token.canManageStores = dbUser.canManageStores;
        }
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.role = token.role as string | undefined;
        session.user.organizationId = token.organizationId as string | undefined;
        session.user.id = token.sub as string | undefined;
        session.user.canViewTeamPage = token.canViewTeamPage as boolean | undefined;
        session.user.canViewApprovalPage = token.canViewApprovalPage as boolean | undefined;
        session.user.canManageTeamExpenses = token.canManageTeamExpenses as boolean | undefined;
        session.user.canViewReports = token.canViewReports as boolean | undefined;
        session.user.canManagePolicies = token.canManagePolicies as boolean | undefined;
        session.user.canManageStores = token.canManageStores as boolean | undefined;
      }
      return session;
    },
  },
  pages: {
    signIn: "/login",
  },
  debug: process.env.NODE_ENV === "development",
  secret: process.env.NEXTAUTH_SECRET,
});
