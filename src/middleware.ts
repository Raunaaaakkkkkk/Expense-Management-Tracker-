export { default } from "next-auth/middleware";

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/expenses/:path*",
    "/approvals/:path*",
    "/reports/:path*",
    "/teams/:path*",
    "/policies/:path*",
    "/settings/:path*",
  ],
};
