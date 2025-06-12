import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

const isPublicRoute = createRouteMatcher([
  '/',
  '/api/fetch-roles',
]);

interface SessionClaims {
  privateMetadata?: {
    role?: string;
  };
}

// restarting functions
export default clerkMiddleware(async (auth, req) => {
  const { userId, sessionClaims } = await auth();
  const isAuthenticated = !!userId;
  const currentPath = req.nextUrl.pathname;

  // Block access to private routes if not authenticated
  if (!isPublicRoute(req) && !isAuthenticated) {
    return NextResponse.redirect(new URL('/', req.url));
  }

  // If authenticated, check role-based access
  if (isAuthenticated && sessionClaims) {
    const userRole = (sessionClaims as SessionClaims).privateMetadata?.role;

    // Check if the current path is under admin or faculty routes
    const isAdminRoute = currentPath.startsWith('/admin/');
    const isFacultyRoute = currentPath.startsWith('/faculty/');

    if (isAdminRoute || isFacultyRoute) {
      // If user has no role, redirect to unauthorized
      if (!userRole) {
        return NextResponse.redirect(new URL('/unauthorized', req.url));
      }

      // Check if user's role has access to the current route
      const hasAccess = (userRole === 'admin' && isAdminRoute) || 
                       (userRole === 'faculty' && isFacultyRoute);

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
