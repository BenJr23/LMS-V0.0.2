import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

const isPublicRoute = createRouteMatcher([
  '/',
  '/api/fetch-roles',
]);

// Define role-based route access
const roleBasedRoutes = {
  admin: ['/admin/'],
  faculty: ['/faculty/'],
};

interface SessionClaims {
  privateMetadata?: {
    role?: string;
  };
}

export default clerkMiddleware(async (auth, req) => {
  const { userId, sessionClaims } = await auth();
  const isAuthenticated = !!userId;

  // Block access to private routes if not authenticated
  if (!isPublicRoute(req) && !isAuthenticated) {
    return NextResponse.redirect(new URL('/', req.url));
  }

  // If authenticated, check role-based access
  if (isAuthenticated && sessionClaims) {
    const userRole = (sessionClaims as SessionClaims).privateMetadata?.role;
    const currentPath = req.nextUrl.pathname;

    // Check if the current path is a dashboard route
    const isDashboardRoute = currentPath.startsWith('/admin-dashboard') || 
                           currentPath.startsWith('/faculty-dashboard');

    if (isDashboardRoute) {
      // If user has no role, redirect to unauthorized
      if (!userRole) {
        return NextResponse.redirect(new URL('/unauthorized', req.url));
      }

      // Check if user's role has access to the current route
      const allowedRoutes = roleBasedRoutes[userRole as keyof typeof roleBasedRoutes] || [];
      const hasAccess = allowedRoutes.some(route => currentPath.startsWith(route));

      if (!hasAccess) {
        return NextResponse.redirect(new URL('/unauthorized', req.url));
      }
    }
  }

  return NextResponse.next();
});

export const config = {
  matcher: [
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    '/(api|trpc)(.*)',
  ],
};
