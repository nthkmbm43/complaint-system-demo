import { NextResponse, NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

export async function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl;

  if (pathname.startsWith("/_next") || pathname.startsWith("/api") || pathname.includes(".")) {
    return NextResponse.next();
  }

  try {
    const token = await getToken({
      req,
      secret: process.env.NEXTAUTH_SECRET || "rmuti-complaint-secret-2025"
    });

    const publicRoutes = ["/", "/student/login", "/admin/login", "/student/register"];
    const isPublic = publicRoutes.some(r => pathname === r || pathname === `${r}/`);

    if (!token) {
      if (isPublic) return NextResponse.next();
      return NextResponse.redirect(new URL(pathname.startsWith("/admin") ? "/admin/login" : "/student/login", req.url));
    }

    const userType = (token as any).type;
    const userRole = Number((token as any).role) || 0;

    if (isPublic) {
      return NextResponse.redirect(new URL(userType === "staff" ? "/admin/dashboard" : "/student/dashboard", req.url));
    }

    if (userType === "student" && pathname.startsWith("/admin")) {
      return NextResponse.redirect(new URL("/student/dashboard", req.url));
    }

    if (userType === "staff" && pathname.startsWith("/admin")) {
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
    return NextResponse.next();
  }
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
