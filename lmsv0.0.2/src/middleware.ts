import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { createClerkClient } from "@clerk/backend";

const clerkClient = createClerkClient({
    secretKey: process.env.CLERK_SECRET_KEY,
});

const isPublicRoute = createRouteMatcher([
  '/',
  '/api/fetch-roles',
]);

// restarting functions
export default clerkMiddleware(async (auth, req) => {
  const { userId } = await auth();
  const isAuthenticated = !!userId;
  const currentPath = req.nextUrl.pathname;

  console.log('🔍 Middleware check:', {
    path: currentPath,
    isAuthenticated,
    userId
  });

  // Block access to private routes if not authenticated
  if (!isPublicRoute(req) && !isAuthenticated) {
    console.log('⚠️ Unauthenticated access attempt');
    return NextResponse.redirect(new URL('/', req.url));
  }

  // If authenticated, check role-based access
  if (isAuthenticated) {
    try {
      // Get user with private metadata (where role is stored)
      const user = await clerkClient.users.getUser(userId);
      const userRole = user?.privateMetadata?.role as string;
      
      console.log('👤 User role from metadata:', {
        userId,
        role: userRole,
        metadata: user?.privateMetadata
      });

      // Check if the current path is under admin or faculty routes
      const isAdminRoute = currentPath.startsWith('/admin/');
      const isFacultyRoute = currentPath.startsWith('/faculty/');

      if (isAdminRoute || isFacultyRoute) {
        // If user has no role, redirect to unauthorized
        if (!userRole) {
          console.log('❌ No role found for user');
          return NextResponse.redirect(new URL('/unauthorized', req.url));
        }

        // Check if user's role has access to the current route
        const hasAccess = (userRole === 'admin' && isAdminRoute) || 
                         (userRole === 'faculty' && isFacultyRoute);

        if (!hasAccess) {
          console.log('❌ Role access denied:', {
            path: currentPath,
            role: userRole,
            isAdminRoute,
            isFacultyRoute
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
