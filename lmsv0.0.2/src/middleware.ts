import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { createClerkClient } from "@clerk/backend";

const clerkClient = createClerkClient({
    secretKey: process.env.CLERK_SECRET_KEY,
});

const isPublicRoute = createRouteMatcher([
  '/',
  '/student-login',
  '/faculty-login',
  '/api/fetch-roles',
  '/api/fetch-students',
  '/unauthorized' // Add unauthorized page to public routes
]);

export default clerkMiddleware(async (auth, req) => {
  const { userId } = await auth();
  const isAuthenticated = !!userId;
  const currentPath = req.nextUrl.pathname;

  // Skip middleware for static files and API routes that don't need auth
  if (req.nextUrl.pathname.match(/\.(ico|png|jpg|jpeg|svg|css|js)$/)) {
    return NextResponse.next();
  }

  // Handle login page redirects
  if (isAuthenticated && (currentPath === '/' || currentPath === '/student-login' || currentPath === '/faculty-login')) {
    try {
      const user = await clerkClient.users.getUser(userId);
      const userRole = user?.privateMetadata?.role as string;

      switch (userRole) {
        case 'admin':
          return NextResponse.redirect(new URL('/admin/dashboard', req.url));
        case 'faculty':
          return NextResponse.redirect(new URL('/faculty/dashboard', req.url));
        case 'student':
          return NextResponse.redirect(new URL('/student/dashboard', req.url));
        default:
          return NextResponse.redirect(new URL('/', req.url));
      }
    } catch (error) {
      // If we can't get user role, just redirect to home
      return NextResponse.redirect(new URL('/', req.url));
    }
  }

  // Handle unauthenticated access
  if (!isPublicRoute(req) && !isAuthenticated) {
    return NextResponse.redirect(new URL('/', req.url));
  }

  // Handle role-based access
  if (isAuthenticated) {
    try {
      const user = await clerkClient.users.getUser(userId);
      const userRole = user?.privateMetadata?.role as string;

      const isAdminRoute = currentPath.startsWith('/admin/');
      const isFacultyRoute = currentPath.startsWith('/faculty/');
      const isStudentRoute = currentPath.startsWith('/student/');

      // Only check role access for protected routes
      if (isAdminRoute || isFacultyRoute || isStudentRoute) {
        if (!userRole) {
          return NextResponse.redirect(new URL('/unauthorized', req.url));
        }

        const hasAccess = (
          (userRole === 'admin' && isAdminRoute) ||
          (userRole === 'faculty' && isFacultyRoute) ||
          (userRole === 'student' && isStudentRoute)
        );

        if (!hasAccess) {
          return NextResponse.redirect(new URL('/unauthorized', req.url));
        }
      }
    } catch (error) {
      // Only redirect to unauthorized if we're on a protected route
      if (currentPath.startsWith('/admin/') || 
          currentPath.startsWith('/faculty/') || 
          currentPath.startsWith('/student/')) {
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
