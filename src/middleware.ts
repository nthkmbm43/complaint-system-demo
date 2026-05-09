import { NextResponse, NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // 1. Skip static files and API routes
  if (
    pathname.startsWith("/_next") || 
    pathname.startsWith("/api") || 
    pathname.includes(".")
  ) {
    return NextResponse.next();
  }

  try {
    // 2. Get the token with explicit secret for maximum stability
    const token = await getToken({
      req,
      secret: process.env.NEXTAUTH_SECRET || "rmuti-complaint-secret-2025"
    });

    const publicRoutes = ["/", "/student/login", "/admin/login", "/student/register", "/manual", "/student/manual"];
    const authRoutes = ["/student/login", "/admin/login", "/student/register"];
    
    // Normalize pathname by removing trailing slash if exists (except for root)
    const normalizedPath = pathname.endsWith("/") && pathname !== "/" ? pathname.slice(0, -1) : pathname;
    
    const isPublicname = publicRoutes.some(r => normalizedPath === r);
    const isAuthRoute = authRoutes.some(r => normalizedPath === r);

    // 3. Unauthorized access handling
    if (!token) {
      if (isPublicname) return NextResponse.next();
      
      // Redirect to correct login page based on path
      const loginUrl = pathname.startsWith("/admin") ? "/admin/login" : "/student/login";
      const url = new URL(loginUrl, req.url);
      // Optional: Add callbackUrl to redirect back after login
      // url.searchParams.set("callbackUrl", pathname);
      return NextResponse.redirect(url);
    }

    // 4. Authorized user handling
    const userType = (token as any).type;
    const userRole = Number((token as any).role) || 0;

    // If logged in, don't allow access to login/register pages
    if (isAuthRoute) {
      const dashboardUrl = userType === "staff" ? "/admin/dashboard" : "/student/dashboard";
      return NextResponse.redirect(new URL(dashboardUrl, req.url));
    }

    // 5. Cross-portal access prevention
    if (userType === "student" && pathname.startsWith("/admin")) {
      return NextResponse.redirect(new URL("/student/dashboard", req.url));
    }

    // 6. Administrative Role-Based Access Control (RBAC)
    if (userType === "staff" && pathname.startsWith("/admin")) {
      // Add logic here if you want to prevent staff from accessing student side
      
      const adminPaths = ["/admin/staff", "/admin/students", "/admin/units", "/admin/settings", "/admin/users"];
      if (adminPaths.some(p => pathname.startsWith(p)) && userRole < 3) {
        return NextResponse.redirect(new URL("/admin/dashboard", req.url));
      }
      
      const opPaths = ["/admin/reports", "/admin/complaints"];
      if (opPaths.some(p => pathname.startsWith(p)) && userRole < 2) {
        return NextResponse.redirect(new URL("/admin/assignments", req.url));
      }
    }

    return NextResponse.next();
  } catch (e) {
    console.error("Middleware Error:", e);
    return NextResponse.next();
  }
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
