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
  '/api/fetch-students' // ✅ make sure student fetch api stays public during login
]);

export default clerkMiddleware(async (auth, req) => {
  const { userId } = await auth();
  const isAuthenticated = !!userId;
  const currentPath = req.nextUrl.pathname;

  console.log('🔍 Middleware check:', {
    path: currentPath,
    isAuthenticated,
    userId
  });

  // Redirect logged-in users away from login pages
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
      console.error('💥 Error checking user role:', error);
      return NextResponse.redirect(new URL('/', req.url));
    }
  }

  if (!isPublicRoute(req) && !isAuthenticated) {
    console.log('⚠️ Unauthenticated access attempt');
    return NextResponse.redirect(new URL('/', req.url));
  }

  if (isAuthenticated) {
    try {
      const user = await clerkClient.users.getUser(userId);
      const userRole = user?.privateMetadata?.role as string;

      console.log('👤 User role from metadata:', {
        userId,
        role: userRole,
        metadata: user?.privateMetadata
      });

      const isAdminRoute = currentPath.startsWith('/admin/');
      const isFacultyRoute = currentPath.startsWith('/faculty/');
      const isStudentRoute = currentPath.startsWith('/student/');

      if (isAdminRoute || isFacultyRoute || isStudentRoute) {
        if (!userRole) {
          console.log('❌ No role found for user');
          return NextResponse.redirect(new URL('/unauthorized', req.url));
        }

        const hasAccess = (
          (userRole === 'admin' && isAdminRoute) ||
          (userRole === 'faculty' && isFacultyRoute) ||
          (userRole === 'student' && isStudentRoute)
        );

        if (!hasAccess) {
          console.log('❌ Role access denied:', {
            path: currentPath,
            role: userRole,
            isAdminRoute,
            isFacultyRoute,
            isStudentRoute
          });
          return NextResponse.redirect(new URL('/unauthorized', req.url));
        }

        console.log('✅ Access granted:', {
          path: currentPath,
          role: userRole
        });
      }
    } catch (error) {
      console.error('💥 Error checking user role:', error);
      return NextResponse.redirect(new URL('/unauthorized', req.url));
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
